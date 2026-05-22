const fs = require('fs');
const path = require('path');
const {
  encryptBuffer,
  decryptFileFromDisk,
  sha256,
  getStorageRoot,
  ensureDir,
} = require('../utils/fileEncryption');
const { models } = require('../config/database');

const { RegistroPendienteDocumento, AtletaDocumento } = models;

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

const PUBLIC_DOC_FIELDS = [
  'id',
  'categoria',
  'nombre_original',
  'mime_type',
  'tamano_bytes',
  'fecha_subida',
];

function sanitizePublicPending(doc) {
  const row = doc.toJSON ? doc.toJSON() : doc;
  return {
    id: row.id,
    categoria: row.categoria,
    nombre_original: row.nombre_original,
    mime_type: row.mime_type,
    tamano_bytes: row.tamano_bytes,
    created_at: row.created_at,
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
    tiene_archivo_cifrado: Boolean(row.storage_key && row.iv),
  };
}

/**
 * @param {Express.Multer.File} file
 */
async function writeEncryptedFile(relativeKey, buffer) {
  const { ciphertext, iv, authTag } = encryptBuffer(buffer);
  const fullPath = path.join(getStorageRoot(), relativeKey);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, ciphertext);
  return { iv, authTag, hash: sha256(buffer), tamano: buffer.length };
}

/**
 * Guarda documento de registro pendiente.
 */
async function savePendingDocument(registroId, categoria, file) {
  if (!file || !file.buffer) {
    throw new Error('Archivo inválido.');
  }
  const ext = path.extname(file.originalname || '') || '.bin';
  const safeCat = String(categoria).replace(/[^a-z0-9_]/gi, '_');
  const fileName = `${safeCat}_${Date.now()}${ext}.enc`;
  const storageKey = path.join('pending', String(registroId), fileName).replace(/\\/g, '/');

  const meta = await writeEncryptedFile(storageKey, file.buffer);

  const row = await RegistroPendienteDocumento.create({
    registro_pendiente_id: registroId,
    categoria: normalizeCategoria(categoria),
    nombre_original: file.originalname || fileName,
    mime_type: file.mimetype || 'application/octet-stream',
    storage_key: storageKey,
    iv: meta.iv,
    auth_tag: meta.authTag,
    hash_sha256: meta.hash,
    tamano_bytes: meta.tamano,
  });

  return sanitizePublicPending(row);
}

function normalizeCategoria(cat) {
  const map = {
    certificado: 'certificado_medico',
    identificacion_tutor: 'id_tutor',
    delincuencia: 'antecedentes',
  };
  return map[cat] || cat;
}

/**
 * Guarda documento oficial de atleta (admin).
 */
async function saveAtletaDocument(atletaId, tipoDocumento, nombreDocumento, file) {
  if (!file || !file.buffer) {
    throw new Error('Archivo inválido.');
  }
  const ext = path.extname(file.originalname || '') || '.bin';
  const fileName = `doc_${Date.now()}${ext}.enc`;
  const storageKey = path.join('atletas', String(atletaId), fileName).replace(/\\/g, '/');

  const meta = await writeEncryptedFile(storageKey, file.buffer);

  const row = await AtletaDocumento.create({
    atleta_id: atletaId,
    nombre_documento: nombreDocumento || file.originalname || 'Documento',
    tipo_documento: tipoDocumento || 'Otro',
    ruta_archivo: storageKey,
    nombre_original: file.originalname,
    mime_type: file.mimetype,
    storage_key: storageKey,
    iv: meta.iv,
    auth_tag: meta.authTag,
    hash_sha256: meta.hash,
    tamano_bytes: meta.tamano,
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

function resolveDownloadMeta(doc) {
  const storageKey = doc.storage_key || doc.ruta_archivo;
  if (!storageKey || !doc.iv || !doc.auth_tag) {
    return null;
  }
  return {
    buffer: decryptFileFromDisk(storageKey, doc.iv, doc.auth_tag),
    mime_type: doc.mime_type || 'application/octet-stream',
    nombre: doc.nombre_original || doc.nombre_documento || 'documento',
  };
}

async function deletePendingByRegistro(registroId) {
  const docs = await RegistroPendienteDocumento.findAll({
    where: { registro_pendiente_id: registroId },
  });
  for (const doc of docs) {
    deleteFileIfExists(doc.storage_key);
  }
  await RegistroPendienteDocumento.destroy({ where: { registro_pendiente_id: registroId } });
  const pendingDir = path.join(getStorageRoot(), 'pending', String(registroId));
  if (fs.existsSync(pendingDir)) {
    fs.rmSync(pendingDir, { recursive: true, force: true });
  }
}

async function deleteAtletaDocument(atletaId, docId) {
  const doc = await AtletaDocumento.findOne({ where: { id: docId, atleta_id: atletaId } });
  if (!doc) return false;
  deleteFileIfExists(doc.storage_key || doc.ruta_archivo);
  await doc.destroy();
  return true;
}

function deleteFileIfExists(storageKey) {
  if (!storageKey) return;
  const full = path.join(getStorageRoot(), storageKey);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

/**
 * Migra documentos pendientes al atleta aprobado.
 */
async function migratePendingToAtleta(registroId, atletaId) {
  const pending = await RegistroPendienteDocumento.findAll({
    where: { registro_pendiente_id: registroId },
  });
  if (!pending.length) return [];

  const created = [];
  const destDir = path.join(getStorageRoot(), 'atletas', String(atletaId));
  ensureDir(destDir);

  for (const doc of pending) {
    const srcPath = path.join(getStorageRoot(), doc.storage_key);
    if (!fs.existsSync(srcPath)) continue;

    const baseName = path.basename(doc.storage_key);
    const newKey = path.join('atletas', String(atletaId), baseName).replace(/\\/g, '/');
    const destPath = path.join(getStorageRoot(), newKey);

    try {
      fs.renameSync(srcPath, destPath);
    } catch {
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
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
      iv: doc.iv,
      auth_tag: doc.auth_tag,
      hash_sha256: doc.hash_sha256,
      tamano_bytes: doc.tamano_bytes,
    });
    created.push(sanitizePublicAtleta(atletaDoc));
  }

  await RegistroPendienteDocumento.destroy({ where: { registro_pendiente_id: registroId } });
  const pendingDir = path.join(getStorageRoot(), 'pending', String(registroId));
  if (fs.existsSync(pendingDir)) {
    fs.rmSync(pendingDir, { recursive: true, force: true });
  }

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
};
