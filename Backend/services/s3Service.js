const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configuración de AWS S3
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && 
                          process.env.AWS_ACCESS_KEY_ID !== 'tu_aws_access_key' &&
                          process.env.AWS_SECRET_ACCESS_KEY &&
                          process.env.AWS_SECRET_ACCESS_KEY !== 'tu_aws_secret_key' &&
                          process.env.AWS_S3_BUCKET_NAME &&
                          process.env.AWS_S3_BUCKET_NAME !== 'olimpiadas-especiales-avatars';

let s3Client = null;
if (hasAwsCredentials) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
  });
}

const PUBLIC_LOCAL_DIR = path.join(__dirname, '../storage/public/avatars');

// Asegurar que exista el directorio local en caso de usar el fallback
if (!hasAwsCredentials) {
  if (!fs.existsSync(PUBLIC_LOCAL_DIR)) {
    fs.mkdirSync(PUBLIC_LOCAL_DIR, { recursive: true });
  }
}

/**
 * Sube un avatar decodificando de base64.
 * @param {string|number} userId 
 * @param {string} base64String 
 * @returns {Promise<string>} La URL pública (S3 o Local)
 */
async function uploadAvatar(userId, base64String) {
  if (!base64String || !base64String.startsWith('data:image/')) {
    throw new Error('Formato de imagen inválido o no es base64.');
  }

  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Base64 string inválido.');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  // Extraer extensión del mimeType (ej. image/jpeg -> jpeg)
  let extension = mimeType.split('/')[1] || 'jpg';
  // Evitar nombres raros si es un formato no estandar
  if (extension === 'jpeg') extension = 'jpg';

  const fileName = `avatar_${userId}_${Date.now()}.${extension}`;
  
  if (hasAwsCredentials) {
    // S3 Upload
    const key = `avatars/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      // ACL: 'public-read' puede fallar si el bucket bloquea ACLs, pero 
      // generalmente las fotos de perfil se configuran como lectura pública mediante bucket policies.
    });

    await s3Client.send(command);
    
    // Construir URL pública
    if (process.env.AWS_S3_ENDPOINT) {
        // Estilo forcePathStyle (LocalStack, MinIO)
        const endpoint = process.env.AWS_S3_ENDPOINT.replace(/\/$/, '');
        return `${endpoint}/${process.env.AWS_S3_BUCKET_NAME}/${key}`;
    }
    // Estilo AWS estandar
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  } else {
    // Local Fallback
    const filePath = path.join(PUBLIC_LOCAL_DIR, fileName);
    fs.writeFileSync(filePath, buffer);
    const port = process.env.PORT || 3000;
    // URL expuesta por app.use('/uploads', ...)
    return `http://localhost:${port}/uploads/avatars/${fileName}`;
  }
}

/**
 * Intenta eliminar el avatar antiguo de S3 o local
 * @param {string} oldUrl 
 */
async function deleteOldAvatar(oldUrl) {
  if (!oldUrl) return;

  try {
    if (hasAwsCredentials && oldUrl.includes(process.env.AWS_S3_BUCKET_NAME)) {
      // Extraer Key
      const urlObj = new URL(oldUrl);
      let key = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
      
      // Si usa forcePathStyle, remover el bucketName del inicio del pathname
      if (key.startsWith(process.env.AWS_S3_BUCKET_NAME + '/')) {
        key = key.replace(process.env.AWS_S3_BUCKET_NAME + '/', '');
      }

      if (key.startsWith('avatars/')) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key
        });
        await s3Client.send(command);
      }
    } else if (!hasAwsCredentials && oldUrl.includes('/uploads/avatars/')) {
      // Eliminar archivo local
      const fileName = oldUrl.split('/').pop();
      if (fileName) {
        const filePath = path.join(PUBLIC_LOCAL_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error eliminando avatar antiguo:', error);
  }
}

const PUBLIC_DOC_DIR = path.join(__dirname, '../storage/public/documentos');

// Asegurar que exista el directorio local de documentos
if (!fs.existsSync(PUBLIC_DOC_DIR)) {
  fs.mkdirSync(PUBLIC_DOC_DIR, { recursive: true });
}

/**
 * Sube un documento (PDF, imagen, etc.) a S3 o al almacenamiento local público.
 * @param {number|string} registroId  - ID del registro pendiente
 * @param {string}        categoria   - Categoría del documento (ej. 'certificado_medico')
 * @param {Buffer}        buffer      - Contenido del archivo en memoria
 * @param {string}        mimeType    - MIME type del archivo
 * @param {string}        originalname- Nombre original del archivo
 * @returns {Promise<string>}          URL pública del documento
 */
async function uploadDocumentoPendiente(registroId, categoria, buffer, mimeType, originalname) {
  const ext = path.extname(originalname || '') || '.bin';
  const safeCat = String(categoria).replace(/[^a-z0-9_]/gi, '_');
  const fileName = `${safeCat}_${Date.now()}${ext}`;
  const s3Key = `documentos/pending/${registroId}/${fileName}`;

  if (hasAwsCredentials) {
    // ☁️ Subir a AWS S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: mimeType,
    });
    await s3Client.send(command);

    // Construir URL pública S3
    if (process.env.AWS_S3_ENDPOINT) {
      const endpoint = process.env.AWS_S3_ENDPOINT.replace(/\/$/, '');
      return `${endpoint}/${process.env.AWS_S3_BUCKET_NAME}/${s3Key}`;
    }
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${s3Key}`;
  } else {
    // 📂 Fallback: guardar en carpeta pública local
    const localDir = path.join(PUBLIC_DOC_DIR, 'pending', String(registroId));
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

    const filePath = path.join(localDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/uploads/documentos/pending/${registroId}/${fileName}`;
  }
}

/**
 * Elimina un documento de S3 o del almacenamiento local público.
 * @param {string} url - URL pública del documento a eliminar
 */
async function deleteDocumentoPendiente(url) {
  if (!url) return;
  try {
    if (hasAwsCredentials && url.includes(process.env.AWS_S3_BUCKET_NAME)) {
      const urlObj = new URL(url);
      let key = urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
      if (key.startsWith(process.env.AWS_S3_BUCKET_NAME + '/')) {
        key = key.replace(process.env.AWS_S3_BUCKET_NAME + '/', '');
      }
      if (key.startsWith('documentos/')) {
        await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }));
      }
    } else if (url.includes('/uploads/documentos/')) {
      // Eliminar del almacenamiento local
      const relPath = url.split('/uploads/')[1];
      if (relPath) {
        const filePath = path.join(__dirname, '../storage/public', relPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error('[s3Service] Error eliminando documento:', err.message);
  }
}

module.exports = {
  uploadAvatar,
  deleteOldAvatar,
  uploadDocumentoPendiente,
  deleteDocumentoPendiente,
};
