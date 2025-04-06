import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, BUCKET_NAME } from '@/app/lib/r2-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    let path = formData.get('path') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un archivo' },
        { status: 400 }
      );
    }
    
    // Normalizar el path para que no tenga doble barra
    if (!path) path = "";
    
    // Asegurar que el path termina con una barra si no está vacío
    if (path && !path.endsWith('/') && path !== '') {
      path = `${path}/`;
    }
    
    // Eliminar barras iniciales para evitar una ruta incorrecta
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    
    // Construir la clave final
    const key = path ? `${path}${file.name}` : file.name;
    
    console.log(`Subiendo archivo a: ${key}`); // Depuración
    
    const fileBuffer = await file.arrayBuffer();
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
    });

    await r2Client.send(command);
    
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir archivo', details: error },
      { status: 500 }
    );
  }
} 