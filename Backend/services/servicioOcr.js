// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO: c:\Users\FWD8D\OneDrive\Desktop\OlimpiadasEspeciales_CostaRica\Backend\services\servicioOcr.js
// DESCRIPCIÓN: Servicio de Inteligencia Artificial para el análisis de certificados médicos (OCR con Visión).
//              Utiliza el modelo "gpt-4o-mini" de OpenAI con Structured Outputs (Salidas Estructuradas en JSON).
// ─────────────────────────────────────────────────────────────────────────────

const { OpenAI } = require('openai');
require('dotenv').config();

// Inicialización del cliente de OpenAI utilizando la clave de entorno cargada.
const llaveAPI = process.env.OPENAI_API_KEY;
const clienteOpenAI = llaveAPI ? new OpenAI({
  apiKey: llaveAPI
}) : null;

/**
 * Convierte un buffer binario de archivo a su representación en cadena Base64.
 * @param {Buffer} buffer - Buffer de datos del archivo.
 * @returns {string} Cadena en formato Base64.
 */
const convertirBufferABase64 = (buffer) => {
  return buffer.toString('base64');
};

/**
 * Envía la imagen del certificado médico al modelo de visión de OpenAI para
 * realizar OCR y extraer los campos requeridos estructurados bajo un esquema estricto de JSON.
 * @param {Object} archivo - Objeto de archivo proporcionado por Multer (mimetype, buffer).
 * @returns {Promise<Object>} Promesa que resuelve en un objeto con { nombre_atleta, fecha_vencimiento }.
 */
const analizarCertificadoOcr = async (archivo) => {
  try {
    if (!clienteOpenAI) {
      throw new Error('La clave OPENAI_API_KEY no está configurada en las variables de entorno (.env).');
    }

    if (archivo.mimetype === 'application/pdf') {
      throw new Error('El sistema requiere que el certificado médico se suba en formato de imagen (PNG, JPG o WEBP) para procesar el análisis de visión artificial.');
    }

    if (!archivo.buffer || archivo.buffer.length < 100) {
      throw new Error('El archivo de imagen está vacío o corrupto. Por favor seleccione un archivo válido.');
    }

    const cadenaBase64 = convertirBufferABase64(archivo.buffer);

    const instruccionSistema = `
      Eres un sistema experto en OCR y análisis de documentos para Olimpiadas Especiales Costa Rica.
      Tu tarea es analizar la imagen del certificado médico provista y extraer de manera 100% precisa los siguientes datos:
      1. nombre_atleta: Nombre completo del atleta que se indica en el documento. Debe ser legible y completo.
      2. fecha_vencimiento: Fecha exacta de vencimiento del certificado médico en formato YYYY-MM-DD.
      
      Reglas de negocio críticas para las fechas:
      - Si el documento indica explícitamente una "Fecha de Vencimiento" o "Válido hasta", usa esa fecha.
      - Si el documento NO indica una fecha de vencimiento de manera explícita, pero sí indica una "Fecha de Emisión", "Fecha de Examen" o "Fecha de Firma", calcula la fecha de vencimiento sumando exactamente 1 AÑO (365 días) a esa fecha de emisión.
      - Si no es posible encontrar ninguna fecha o deducirla con las reglas anteriores, establece "fecha_vencimiento" como null o una cadena vacía.
      - Por favor, sé sumamente estricto y preciso con los nombres y las fechas.
    `;

    try {
      const respuestaIA = await clienteOpenAI.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: instruccionSistema
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analiza este certificado médico y devuelve la información del atleta de forma estructurada en JSON.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${archivo.mimetype};base64,${cadenaBase64}`
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.15
      });

      const contenidoRespuesta = respuestaIA.choices[0]?.message?.content;
      if (!contenidoRespuesta) {
        throw new Error('OpenAI no devolvió contenido en el análisis del certificado.');
      }
      return JSON.parse(contenidoRespuesta);
    } catch (errorIA) {
      if (errorIA.message?.includes('image') || errorIA.message?.includes('does not support image')) {
        throw new Error('El modelo de IA no puede procesar esta imagen. Verifique que sea un archivo válido (PNG, JPG, WebP).');
      }
      throw errorIA;
    }

  } catch (errorAnalisis) {
    console.error('Error detallado en servicioOcr.js:', errorAnalisis);
    throw new Error(`Fallo en el servicio de OCR con Inteligencia Artificial: ${errorAnalisis.message}`);
  }
};

module.exports = {
  analizarCertificadoOcr
};
