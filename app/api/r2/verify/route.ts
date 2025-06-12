import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { getR2Client, getBucketName, hasR2Config } from '@/app/lib/r2-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verificar que hay configuración antes de intentar conectar
    if (!hasR2Config()) {
      return NextResponse.json({ success: false, connected: false, error: 'No R2 configuration found' });
    }

    const r2Client = getR2Client();
    const bucketName = getBucketName();
    
    const command = new ListObjectsCommand({
      Bucket: bucketName,
      MaxKeys: 1,
    });
    
    await r2Client.send(command);
    return NextResponse.json({ success: true, connected: true });
  } catch (error) {
    console.error('Error al verificar la conexión al bucket:', error);
    return NextResponse.json(
      { success: false, connected: false, error: 'Error al conectar con R2', details: error },
      { status: 500 }
    );
  }
} 