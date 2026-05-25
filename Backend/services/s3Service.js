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

module.exports = {
  uploadAvatar,
  deleteOldAvatar
};
