const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

/**
 * Crea el cliente S3 leyendo las variables de entorno en tiempo de ejecución.
 * Esto garantiza que las credenciales del .env ya estén cargadas cuando se llame.
 */
function getS3Client() {
  const region = process.env.AWS_REGION || 'us-east-2';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      '[s3Service] AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY no están configuradas en el .env'
    );
  }

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    // Los buckets con punto en el nombre requieren path-style para evitar errores SSL
    forcePathStyle: true,
  });
}

function getBucketName() {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error('[s3Service] AWS_S3_BUCKET_NAME no está configurada en el .env');
  }
  return bucket;
}

function getRegion() {
  return process.env.AWS_REGION || 'us-east-2';
}

/**
 * Sube un avatar en base64 a S3.
 * @param {string|number} userId
 * @param {string} base64String  - formato: "data:image/jpeg;base64,..."
 * @returns {Promise<string>} URL pública del avatar en S3
 */
async function uploadAvatar(userId, base64String) {
  if (!base64String || !base64String.startsWith('data:image/')) {
    throw new Error('Formato de imagen inválido. Se esperaba un string base64 con prefijo data:image/');
  }

  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Base64 string malformado.');
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  let extension = mimeType.split('/')[1] || 'jpg';
  if (extension === 'jpeg') extension = 'jpg';

  const fileName = `avatars/avatar_${userId}_${Date.now()}.${extension}`;
  const bucket = getBucketName();
  const region = getRegion();
  const s3 = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  // URL pública usando path-style (necesario para buckets con punto en el nombre)
  return `https://s3.${region}.amazonaws.com/${bucket}/${fileName}`;
}

/**
 * Elimina el avatar anterior de S3 si existe.
 * @param {string} oldUrl
 */
async function deleteOldAvatar(oldUrl) {
  if (!oldUrl) return;

  try {
    const bucket = getBucketName();
    const region = getRegion();

    // Verificar que la URL pertenece a nuestro bucket
    if (!oldUrl.includes(bucket)) return;

    // Extraer el Key del archivo desde la URL
    // Soporta tanto path-style como virtual-hosted-style
    let key;
    const pathStylePrefix = `https://s3.${region}.amazonaws.com/${bucket}/`;
    const vHostPrefix = `https://${bucket}.s3.${region}.amazonaws.com/`;

    if (oldUrl.startsWith(pathStylePrefix)) {
      key = oldUrl.replace(pathStylePrefix, '');
    } else if (oldUrl.startsWith(vHostPrefix)) {
      key = oldUrl.replace(vHostPrefix, '');
    } else {
      // Fallback: extraer key del pathname
      const urlObj = new URL(oldUrl);
      key = urlObj.pathname.replace(/^\//, '').replace(`${bucket}/`, '');
    }

    if (!key || !key.startsWith('avatars/')) return;

    const s3 = getS3Client();
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    await s3.send(command);
  } catch (error) {
    // No detener el flujo si falla la eliminación del avatar antiguo
    console.error('[s3Service] Error eliminando avatar antiguo:', error.message);
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
