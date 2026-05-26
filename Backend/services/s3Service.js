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

module.exports = { uploadAvatar, deleteOldAvatar };
