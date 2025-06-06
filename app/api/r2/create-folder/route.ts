import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Client, getBucketName, hasR2Config } from '../../../lib/r2-server';

export async function POST(request: NextRequest) {
  try {
    if (!hasR2Config()) {
      return NextResponse.json(
        { error: 'R2 credentials not configured' },
        { status: 400 }
      );
    }

    const { folderName, prefix } = await request.json();

    if (!folderName || typeof folderName !== 'string') {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Sanitizar el nombre de la carpeta
    const sanitizedFolderName = folderName.trim().replace(/[^a-zA-Z0-9\-_.]/g, '_');
    
    if (sanitizedFolderName.length === 0) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Construir la ruta completa de la carpeta
    const currentPrefix = typeof prefix === 'string' ? prefix : '';
    const folderPath = currentPrefix + sanitizedFolderName + '/';

    const r2Client = getR2Client();
    const bucketName = getBucketName();

    // Crear un objeto vacío para simular la carpeta
    // En S3/R2, las carpetas no existen realmente, se crean cuando hay objetos dentro
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: folderPath + '.folder_placeholder',
        Body: '',
        ContentType: 'text/plain',
      })
    );

    return NextResponse.json({
      success: true,
      folderPath,
      message: 'Folder created successfully'
    });

  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    );
  }
}