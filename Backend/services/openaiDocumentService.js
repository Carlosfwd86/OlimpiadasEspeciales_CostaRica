/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVICIO: openaiDocumentService.js
 * DESCRIPCIÓN: Analiza documentos de registros pendientes con OpenAI (gpt-4o).
 *   - Imágenes: URL pública pasada directamente a GPT-4o Vision (sin descarga).
 *   - PDFs: descarga en RAM con axios + extrae texto con pdf-parse.
 *   - Persiste resultado en `estado_ia` y `analisis_ia` de la BD.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const axios = require('axios');
const { getOpenAIClient, isOpenAIConfigured } = require('../config/openai');
const { models } = require('../config/database');

const { RegistroPendienteDocumento } = models;

// ─── Constantes ──────────────────────────────────────────────────────────────
const MIME_IMAGENES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MIME_PDF      = 'application/pdf';

// ─── Prompts por categoría ────────────────────────────────────────────────────
const PROMPTS_CATEGORIA = {
  certificado_medico: `Eres un revisor estricto de documentos médicos para Olimpiadas Especiales Costa Rica.
Analiza este documento y verifica:
1. Que sea un certificado médico oficial y legible.
2. Que indique explícitamente que el paciente está APTO para realizar actividad física o deporte.
3. Que contenga firma y/o sello de un médico o profesional de salud.
4. Que la fecha de emisión sea reciente (preferiblemente dentro del último año).
Responde ÚNICAMENTE con JSON válido (sin markdown, sin texto extra):
{"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  cedula: `Eres un revisor de documentos de identidad para Olimpiadas Especiales Costa Rica.
Verifica: 1) Documento oficial de identificación. 2) Legible y datos visibles. 3) No alterado.
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  antecedentes: `Eres un revisor de documentos oficiales para Olimpiadas Especiales Costa Rica.
Verifica que sea una hoja de delincuencia o carta de buena conducta, legible y reciente (últimos 3 meses).
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  titulo: `Eres un revisor de documentos académicos para Olimpiadas Especiales Costa Rica.
Verifica que sea un título, certificación o licencia de entrenador oficial, con sellos o firmas.
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  id_tutor: `Verifica que sea un documento oficial de identidad legible del tutor.
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  foto: `Verifica que sea una foto de perfil clara de una persona con el rostro visible y buena calidad.
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,

  otro: `Verifica que el documento sea legible, válido y oficial.
Responde ÚNICAMENTE con JSON: {"estado":"APROBADO","razon":"..."} o {"estado":"RECHAZADO","razon":"..."}`,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearRespuestaIA(raw) {
  if (!raw) throw new Error('OpenAI no devolvió contenido.');
  const limpio = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const match  = limpio.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No se encontró JSON válido en la respuesta de IA.');
  const parsed     = JSON.parse(match[0]);
  const estadoNorm = String(parsed.estado || '').toUpperCase().trim();
  if (!['APROBADO', 'RECHAZADO'].includes(estadoNorm)) {
    throw new Error(`Estado IA inválido: "${parsed.estado}"`);
  }
  return { estado: estadoNorm, razon: String(parsed.razon || 'Sin detalles.') };
}

async function descargarBufferDesdeUrl(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    maxContentLength: 10 * 1024 * 1024,
  });
  return Buffer.from(response.data);
}

// ─── Función principal ────────────────────────────────────────────────────────

async function analizarDocumentoConIA(registroId, docId) {
  if (!isOpenAIConfigured()) {
    console.warn('[openaiDocumentService] OPENAI_API_KEY no configurada. Saltando análisis.');
    return;
  }

  let doc;
  try {
    doc = await RegistroPendienteDocumento.findOne({
      where: { id: docId, registro_pendiente_id: registroId },
    });

    if (!doc) {
      console.warn(`[openaiDocumentService] Documento ID=${docId} no encontrado.`);
      return;
    }

    const esImagen = MIME_IMAGENES.includes(doc.mime_type);
    const esPdf    = doc.mime_type === MIME_PDF;

    if (!esImagen && !esPdf) {
      await doc.update({
        estado_ia:   'NO_APLICA',
        analisis_ia: `Formato no analizable automáticamente (${doc.mime_type}).`,
      });
      return;
    }

    const promptSistema = PROMPTS_CATEGORIA[doc.categoria] || PROMPTS_CATEGORIA.otro;
    const openai        = getOpenAIClient();
    let   mensajesUsuario;

    // ── NUEVO FLUJO: doc tiene url_documento ─────────────────────────────────
    if (doc.url_documento) {
      if (esImagen) {
        // Pasar URL directamente a GPT-4o Vision
        mensajesUsuario = [{
          role: 'user',
          content: [
            { type: 'text',      text: 'Analiza la siguiente imagen del documento:' },
            { type: 'image_url', image_url: { url: doc.url_documento, detail: 'high' } },
          ],
        }];
      } else {
        // PDF: descargar en RAM y extraer texto
        let textoPdf = '';
        try {
          const buffer   = await descargarBufferDesdeUrl(doc.url_documento);
          const pdfParse = require('pdf-parse');
          const pdfData  = await pdfParse(buffer);
          textoPdf       = pdfData.text?.trim() || '';
        } catch (pdfErr) {
          console.warn(`[openaiDocumentService] Error leyendo PDF docId=${docId}:`, pdfErr.message);
        }

        if (!textoPdf) {
          await doc.update({
            estado_ia:   'PENDIENTE',
            analisis_ia: 'PDF sin texto extraíble (posiblemente escaneado). Requiere revisión manual.',
          });
          return;
        }
        mensajesUsuario = [{ role: 'user', content: `Texto del PDF:\n\n${textoPdf.substring(0, 6000)}` }];
      }

    // ── FLUJO LEGADO: registros cifrados en disco ─────────────────────────────
    } else if (doc.storage_key && doc.iv && doc.auth_tag) {
      const { resolveDownloadMeta } = require('./documentoService');
      const metaFile = resolveDownloadMeta(doc);
      if (!metaFile || !metaFile.buffer) throw new Error('No se pudo descifrar el documento legado.');

      if (esImagen) {
        const base64 = metaFile.buffer.toString('base64');
        mensajesUsuario = [{
          role: 'user',
          content: [
            { type: 'text',      text: 'Analiza la siguiente imagen del documento:' },
            { type: 'image_url', image_url: { url: `data:${doc.mime_type};base64,${base64}`, detail: 'high' } },
          ],
        }];
      } else {
        let textoPdf = '';
        try {
          const pdfParse = require('pdf-parse');
          const pdfData  = await pdfParse(metaFile.buffer);
          textoPdf       = pdfData.text?.trim() || '';
        } catch { /* ignorar */ }

        if (!textoPdf) {
          await doc.update({
            estado_ia:   'PENDIENTE',
            analisis_ia: 'PDF sin texto extraíble. Requiere revisión manual.',
          });
          return;
        }
        mensajesUsuario = [{ role: 'user', content: `Texto del PDF:\n\n${textoPdf.substring(0, 6000)}` }];
      }

    } else {
      await doc.update({
        estado_ia:   'NO_APLICA',
        analisis_ia: 'Documento sin archivo disponible para análisis.',
      });
      return;
    }

    // ── Llamada a OpenAI ──────────────────────────────────────────────────────
    const response = await openai.chat.completions.create({
      model:           process.env.OPENAI_VISION_MODEL || 'gpt-4o',
      messages:        [{ role: 'system', content: promptSistema }, ...mensajesUsuario],
      response_format: { type: 'json_object' },
      temperature:     0.1,
      max_tokens:      400,
    });

    const resultado = parsearRespuestaIA(response.choices[0]?.message?.content);
    await doc.update({ estado_ia: resultado.estado, analisis_ia: resultado.razon });
    console.log(`[openaiDocumentService] ✅ DocID=${docId} (${doc.categoria}) → ${resultado.estado}`);

  } catch (err) {
    console.error(`[openaiDocumentService] ❌ Error analizando docId=${docId}:`, err.message);
    try {
      if (doc) {
        await doc.update({
          estado_ia:   'PENDIENTE',
          analisis_ia: `Error en análisis automático: ${err.message}. Requiere revisión manual.`,
        });
      }
    } catch { /* silenciar */ }
  }
}

/**
 * Dispara análisis IA para todos los documentos de un registro (fire-and-forget).
 * NO bloquea el response HTTP.
 */
function dispararAnalisisIA(registroId, documentos) {
  if (!documentos || documentos.length === 0) return;
  Promise.allSettled(
    documentos.map((doc) => analizarDocumentoConIA(registroId, doc.id))
  ).then((res) => {
    const ok  = res.filter((r) => r.status === 'fulfilled').length;
    const err = res.filter((r) => r.status === 'rejected').length;
    console.log(`[openaiDocumentService] registroId=${registroId}: ${ok} OK, ${err} errores`);
  });
}

module.exports = { analizarDocumentoConIA, dispararAnalisisIA };
