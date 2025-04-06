import { S3Client } from '@aws-sdk/client-s3';

// Usar las variables de entorno del servidor (no expuestas al cliente)
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCESS_KEY_ID) throw new Error('R2_ACCESS_KEY_ID is required');
if (!R2_SECRET_ACCESS_KEY) throw new Error('R2_SECRET_ACCESS_KEY is required');
if (!R2_ACCOUNT_ID) throw new Error('R2_ACCOUNT_ID is required');
if (!R2_BUCKET_NAME) throw new Error('R2_BUCKET_NAME is required');

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = R2_BUCKET_NAME; 