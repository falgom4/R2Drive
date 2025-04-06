import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { r2Client, BUCKET_NAME } from '@/app/lib/r2-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const command = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      MaxKeys: 1,
    });
    
    await r2Client.send(command);
    return NextResponse.json({ success: true, connected: true });
  } catch (error) {
    console.error('Error al verificar la conexión al bucket:', error);
    return NextResponse.json(
      { success: false, error: 'Error al conectar con R2', details: error },
      { status: 500 }
    );
  }
} 