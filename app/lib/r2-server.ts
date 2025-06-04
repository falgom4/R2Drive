import { S3Client } from '@aws-sdk/client-s3';

// Función para obtener las credenciales R2
function getR2Config() {
  const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
  const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

  if (!R2_ACCESS_KEY_ID) throw new Error('R2_ACCESS_KEY_ID is required');
  if (!R2_SECRET_ACCESS_KEY) throw new Error('R2_SECRET_ACCESS_KEY is required');
  if (!R2_ACCOUNT_ID) throw new Error('R2_ACCOUNT_ID is required');
  if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is required');

  return {
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_ACCOUNT_ID,
    R2_BUCKET_NAME
  };
}

// Función para verificar si las credenciales están configuradas
export function hasR2Config(): boolean {
  try {
    getR2Config();
    return true;
  } catch {
    return false;
  }
}

// Crear cliente R2
export function getR2Client(): S3Client {
  const config = getR2Config();
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    },
  });
}

export function getBucketName(): string {
  const config = getR2Config();
  return config.R2_BUCKET_NAME;
}

// Para compatibilidad hacia atrás - NO USAR, usar las funciones directamente
export const r2Client = null;
export const BUCKET_NAME = null;