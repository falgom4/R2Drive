import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl } = await request.json();

    // Crear el contenido del archivo .env.local
    const envContent = `R2_ACCOUNT_ID=${accountId}
R2_ACCESS_KEY_ID=${accessKeyId}
R2_SECRET_ACCESS_KEY=${secretAccessKey}
R2_BUCKET_NAME=${bucketName}
${publicUrl ? `R2_PUBLIC_URL=${publicUrl}` : ''}`;

    // Escribir el archivo .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    await writeFile(envPath, envContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 }
    );
  }
} 