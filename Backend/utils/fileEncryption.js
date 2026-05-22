const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getEncryptionKey() {
  const hex = process.env.DOCUMENT_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      '[fileEncryption] DOCUMENT_ENCRYPTION_KEY debe ser 64 caracteres hex (32 bytes). Generar con: openssl rand -hex 32'
    );
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Cifra un buffer con AES-256-GCM.
 * @returns {{ ciphertext: Buffer, iv: string, authTag: string }}
 */
function encryptBuffer(buffer) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Descifra un archivo desde disco usando metadata almacenada.
 */
function decryptFileFromDisk(storageKey, ivHex, authTagHex) {
  const key = getEncryptionKey();
  const absolutePath = path.join(getStorageRoot(), storageKey);
  if (!fs.existsSync(absolutePath)) {
    throw new Error('Archivo cifrado no encontrado en almacenamiento.');
  }
  const ciphertext = fs.readFileSync(absolutePath);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function getStorageRoot() {
  return path.join(__dirname, '..', 'storage', 'encrypted');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = {
  encryptBuffer,
  decryptFileFromDisk,
  sha256,
  getStorageRoot,
  ensureDir,
  getEncryptionKey,
};
