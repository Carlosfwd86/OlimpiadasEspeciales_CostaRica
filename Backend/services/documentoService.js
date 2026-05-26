/**
 * documentoService.js
 * Gestiona la subida, descarga y eliminación de documentos en AWS S3.
 * Todos los archivos (PDFs, imágenes, certificados) van al bucket configurado en .env.
 */
const crypto = require('crypto');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { models } = require('../config/database');

const { RegistroPendienteDocumento, AtletaDocumento } = models;

// ─── Helpers S3 ──────────────────────────────────────────────────────────────

function getS3Client() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-2';

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('[documentoService] Credenciales AWS no configuradas en .env');
  }

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // Necesario para buckets con punto en el nombre
  });
}

function getBucket() {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) throw new Error('[documentoService] AWS_S3_BUCKET_NAME no configurado en .env');
  return bucket;
}

function getRegion() {
  return process.env.AWS_REGION || 'us-east-2';
}

function buildPublicUrl(key) {
  const bucket = getBucket();
  const region = getRegion();
  return `https://s3.${region}.amazonaws.com/${bucket}/${key}`;
}

/**
 * Sube un archivo a S3 y retorna la key (ruta) dentro del bucket.
 */
async function uploadToS3(key, buffer, mimeType) {
  const s3 = getS3Client();
  const bucket = getBucket();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType || 'application/octet-stream',
  });
  await s3.send(command);
  return key;
}

/**
 * Elimina un archivo de S3 por su key.
 */
async function deleteFromS3(key) {
  if (!key) return;
  try {
    const s3 = getS3Client();
    const bucket = getBucket();
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    console.error('[documentoService] Error eliminando de S3:', err.message);
  }
}

/**
 * Descarga un archivo de S3 y retorna su buffer.
 */
async function downloadFromS3(key) {
  const s3 = getS3Client();
  const bucket = getBucket();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);

  // Convertir el stream a Buffer
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return {
    buffer: Buffer.concat(chunks),
    contentType: response.ContentType || 'application/octet-stream',
  };
}

// ─── Mapas y utilidades ───────────────────────────────────────────────────────

const CATEGORIA_TO_TIPO = {
  cedula: 'Identificación',
  certificado: 'Certificado Médico',
  certificado_medico: 'Certificado Médico',
  foto: 'Otro',
  identificacion_tutor: 'Autorización',
  id_tutor: 'Autorización',
  delincuencia: 'Otro',
  antecedentes: 'Otro',
  titulo: 'Otro',
  otro: 'Otro',
};

function normalizeCategoria(cat) {
  const map = {
    certificado: 'certificado_medico',
    identificacion_tutor: 'id_tutor',
    delincuencia: 'antecedentes',
  };
  return map[cat] || cat;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sanitizePublicPending(doc) {
  const row = doc.toJSON ? doc.toJSON() : doc;
  return {
    id: row.id,
    categoria: row.categoria,
    nombre_original: row.nombre_original,
    mime_type: row.mime_type,
    tamano_bytes: row.tamano_bytes,
    url_documento: row.url_documento || null,
    estado_ia: row.estado_ia || 'PENDIENTE',
    analisis_ia: row.analisis_ia || null,
    created_at: row.created_at,
    s3_url: row.storage_key ? buildPublicUrl(row.storage_key) : null,
  };
}

function sanitizePublicAtleta(doc) {
  const row = doc.toJSON ? doc.toJSON() : doc;
  return {
    id: row.id,
    nombre_documento: row.nombre_documento,
    tipo_documento: row.tipo_documento,
    nombre_original: row.nombre_original || row.nombre_documento,
    mime_type: row.mime_type,
    tamano_bytes: row.tamano_bytes,
    fecha_subida: row.fecha_subida,
    s3_url: row.storage_key ? buildPublicUrl(row.storage_key) : null,
  };
}

// ─── Operaciones principales ──────────────────────────────────────────────────

/**
 * Guarda un documento de registro pendiente en S3.
 */
async function savePendingDocument(registroId, categoria, file) {
  if (!file || !file.buffer) throw new Error('Archivo inválido.');

  const ext = require('path').extname(file.originalname || '') || '.bin';
  const safeCat = String(categoria).replace(/[^a-z0-9_]/gi, '_');
  const fileName = `${safeCat}_${Date.now()}${ext}`;
  const key = `documentos/pending/${registroId}/${fileName}`;

  await uploadToS3(key, file.buffer, file.mimetype);

  const row = await RegistroPendienteDocumento.create({
    registro_pendiente_id: registroId,
    categoria: normalizeCategoria(categoria),
    nombre_original: file.originalname || 'documento',
    mime_type: file.mimetype || 'application/octet-stream',
    // Campos crypto quedan null (ya no se usa cifrado en disco)
    storage_key: null,
    iv: null,
    auth_tag: null,
    hash_sha256: null,
    tamano_bytes: file.size || file.buffer.length,
    url_documento: urlDocumento,
    estado_ia: 'PENDIENTE',
  });

  return sanitizePublicPending(row);
}

/**
 * Guarda un documento oficial de atleta en S3.
 */
async function saveAtletaDocument(atletaId, tipoDocumento, nombreDocumento, file) {
  if (!file || !file.buffer) throw new Error('Archivo inválido.');

  const ext = require('path').extname(file.originalname || '') || '.bin';
  const fileName = `doc_${Date.now()}${ext}`;
  const key = `documentos/atletas/${atletaId}/${fileName}`;

  await uploadToS3(key, file.buffer, file.mimetype);

  const row = await AtletaDocumento.create({
    atleta_id: atletaId,
    nombre_documento: nombreDocumento || file.originalname || 'Documento',
    tipo_documento: tipoDocumento || 'Otro',
    ruta_archivo: key,
    nombre_original: file.originalname,
    mime_type: file.mimetype,
    storage_key: key,
    iv: null,
    auth_tag: null,
    hash_sha256: sha256(file.buffer),
    tamano_bytes: file.buffer.length,
  });

  return sanitizePublicAtleta(row);
}

async function listPendingDocuments(registroId) {
  const rows = await RegistroPendienteDocumento.findAll({
    where: { registro_pendiente_id: registroId },
    order: [['id', 'ASC']],
  });
  return rows.map(sanitizePublicPending);
}

async function getPendingDocumentForDownload(registroId, docId) {
  return RegistroPendienteDocumento.findOne({
    where: { id: docId, registro_pendiente_id: registroId },
  });
}

async function getAtletaDocumentForDownload(atletaId, docId) {
  return AtletaDocumento.findOne({
    where: { id: docId, atleta_id: atletaId },
  });
}

/**
 * Resuelve los metadatos de descarga: descarga el archivo desde S3.
 */
async function resolveDownloadMeta(doc) {
  const key = doc.storage_key || doc.ruta_archivo;
  if (!key) return null;

  const { buffer, contentType } = await downloadFromS3(key);
  return {
    buffer,
    mime_type: contentType || doc.mime_type || 'application/octet-stream',
    nombre: doc.nombre_original || doc.nombre_documento || 'documento',
  };
}

async function deletePendingByRegistro(registroId) {
  const docs = await RegistroPendienteDocumento.findAll({
    where: { registro_pendiente_id: registroId },
  });
  for (const doc of docs) {
    if (doc.url_documento) {
      // Nuevo flujo: eliminar de S3 / almacenamiento local público
      await deleteDocumentoPendiente(doc.url_documento).catch(() => {});
    } else if (doc.storage_key) {
      // Legado: eliminar archivo cifrado del disco
      deleteFileIfExists(doc.storage_key);
    }
  }
  await RegistroPendienteDocumento.destroy({ where: { registro_pendiente_id: registroId } });
  // Limpiar directorio cifrado legado si existe
  const pendingDir = path.join(getStorageRoot(), 'pending', String(registroId));
  if (fs.existsSync(pendingDir)) {
    fs.rmSync(pendingDir, { recursive: true, force: true });
  }
}

async function deleteAtletaDocument(atletaId, docId) {
  const doc = await AtletaDocumento.findOne({ where: { id: docId, atleta_id: atletaId } });
  if (!doc) return false;
  await deleteFromS3(doc.storage_key || doc.ruta_archivo);
  await doc.destroy();
  return true;
}

/**
 * Migra documentos pendientes a la carpeta definitiva de un atleta aprobado.
 * En S3 esto implica copiar el objeto a la nueva key y borrar la anterior.
 */
async function migratePendingToAtleta(registroId, atletaId) {
  const { CopyObjectCommand } = require('@aws-sdk/client-s3');
  const pending = await RegistroPendienteDocumento.findAll({
    where: { registro_pendiente_id: registroId },
  });
  if (!pending.length) return [];

  const s3 = getS3Client();
  const bucket = getBucket();
  const created = [];

  for (const doc of pending) {
    if (!doc.storage_key) continue;

    const baseName = require('path').basename(doc.storage_key);
    const newKey = `documentos/atletas/${atletaId}/${baseName}`;

    try {
      // Copiar a la nueva ubicación en S3
      await s3.send(new CopyObjectCommand({
        Bucket: bucket,
        CopySource: `${bucket}/${doc.storage_key}`,
        Key: newKey,
      }));
      // Eliminar la copia pendiente
      await deleteFromS3(doc.storage_key);
    } catch (err) {
      console.error('[documentoService] Error migrando archivo en S3:', err.message);
      continue;
    }

    const tipo = CATEGORIA_TO_TIPO[doc.categoria] || 'Otro';
    const atletaDoc = await AtletaDocumento.create({
      atleta_id: atletaId,
      nombre_documento: doc.nombre_original,
      tipo_documento: tipo,
      ruta_archivo: newKey,
      nombre_original: doc.nombre_original,
      mime_type: doc.mime_type,
      storage_key: newKey,
      iv: null,
      auth_tag: null,
      hash_sha256: doc.hash_sha256,
      tamano_bytes: doc.tamano_bytes,
    });
    created.push(sanitizePublicAtleta(atletaDoc));
  }

  await RegistroPendienteDocumento.destroy({ where: { registro_pendiente_id: registroId } });
  return created;
}

/**
 * Procesa req.files de multer.fields() tras crear registro pendiente.
 */
async function savePendingFilesFromRequest(registroId, files) {
  if (!files) return [];
  const saved = [];
  const fieldMap = files && typeof files === 'object' ? files : {};

  for (const [fieldName, fileList] of Object.entries(fieldMap)) {
    const list = Array.isArray(fileList) ? fileList : [fileList];
    for (const file of list) {
      if (file && file.buffer) {
        const doc = await savePendingDocument(registroId, fieldName, file);
        saved.push(doc);
      }
    }
  }

  // NUEVO: Disparar el análisis IA (fire-and-forget) para todos los documentos recién subidos
  if (saved.length > 0) {
    const { dispararAnalisisIA } = require('./openaiDocumentService');
    dispararAnalisisIA(registroId, saved);
  }

  return saved;
}

module.exports = {
  savePendingDocument,
  saveAtletaDocument,
  listPendingDocuments,
  getPendingDocumentForDownload,
  getAtletaDocumentForDownload,
  resolveDownloadMeta,
  deletePendingByRegistro,
  deleteAtletaDocument,
  migratePendingToAtleta,
  savePendingFilesFromRequest,
  sanitizePublicAtleta,
  CATEGORIA_TO_TIPO,
  buildPublicUrl,
};
