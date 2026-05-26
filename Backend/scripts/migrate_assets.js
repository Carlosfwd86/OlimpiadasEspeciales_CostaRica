require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function getS3Client() {
  const region = process.env.AWS_REGION || 'us-east-2';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY no están configuradas en el .env');
  }

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

function getBucketName() {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error('AWS_S3_BUCKET_NAME no está configurada en el .env');
  }
  return bucket;
}

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.mp4': return 'video/mp4';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
};

async function uploadDirectory(dirPath, s3Prefix) {
  const s3 = await getS3Client();
  const bucket = getBucketName();

  async function walkDir(currentPath, baseDir) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        await walkDir(fullPath, baseDir);
      } else {
        const relativePath = path.relative(baseDir, fullPath);
        // Replace windows backslashes with forward slashes for S3 key
        const s3Key = path.posix.join(s3Prefix, relativePath.split(path.sep).join(path.posix.sep));
        const mimeType = getMimeType(fullPath);
        const fileContent = fs.readFileSync(fullPath);

        console.log(`Uploading ${fullPath} to s3://${bucket}/${s3Key} (${mimeType})...`);
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: fileContent,
          ContentType: mimeType,
        });

        try {
          await s3.send(command);
          console.log(`Successfully uploaded ${s3Key}`);
        } catch (err) {
          console.error(`Failed to upload ${s3Key}:`, err);
        }
      }
    }
  }

  if (fs.existsSync(dirPath)) {
    await walkDir(dirPath, dirPath);
  } else {
    console.log(`Directory ${dirPath} does not exist. Skipping.`);
  }
}

async function uploadSpecificFiles(filesArray, s3Prefix) {
  const s3 = await getS3Client();
  const bucket = getBucketName();
  
  for (const fullPath of filesArray) {
    if (fs.existsSync(fullPath)) {
      const fileName = path.basename(fullPath);
      const s3Key = `${s3Prefix}/${fileName}`;
      const mimeType = getMimeType(fullPath);
      const fileContent = fs.readFileSync(fullPath);

      console.log(`Uploading ${fullPath} to s3://${bucket}/${s3Key} (${mimeType})...`);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileContent,
        ContentType: mimeType,
      });

      try {
        await s3.send(command);
        console.log(`Successfully uploaded ${s3Key}`);
      } catch (err) {
        console.error(`Failed to upload ${s3Key}:`, err);
      }
    }
  }
}


async function main() {
  const imgDirPath = path.join(__dirname, '../../Olimpiadas_Especiales/public/img');
  
  // Upload all files in public/img to "img" prefix in S3
  console.log("Starting upload of public/img directory...");
  await uploadDirectory(imgDirPath, 'img');
  
  // Upload favicons from public root to "img" prefix (or root)
  console.log("Starting upload of favicons from public root...");
  const publicDirPath = path.join(__dirname, '../../Olimpiadas_Especiales/public');
  const specificFiles = [
    path.join(publicDirPath, 'favicon.svg'),
    path.join(publicDirPath, 'favicon_old.svg'),
    path.join(publicDirPath, 'icons.svg')
  ];
  await uploadSpecificFiles(specificFiles, 'img');

  console.log("Migration script finished.");
}

main().catch(console.error);
