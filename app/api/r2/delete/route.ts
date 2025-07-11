import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getR2Client, getBucketName, hasR2Config } from '@/app/lib/r2-server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
  try {
    // Verificar que hay configuración antes de intentar conectar
    if (!hasR2Config()) {
      return NextResponse.json(
        { success: false, error: 'No R2 configuration found' },
        { status: 500 }
      );
    }

    const r2Client = getR2Client();
    const bucketName = getBucketName();
    
    const { key, isFolder } = await request.json();
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Se requiere una clave válida para eliminar' },
        { status: 400 }
      );
    }
    
    let deletedCount = 0;
    
    // Si es una carpeta, eliminar todos los archivos dentro de ella
    if (isFolder) {
      // Asegurarnos que la ruta de la carpeta termina con /
      const folderPath = key.endsWith('/') ? key : `${key}/`;
      
      // Listar todos los objetos dentro de la carpeta
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: folderPath,
      });
      
      const listedObjects = await r2Client.send(listCommand);
      
      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        // Eliminar cada objeto encontrado
        for (const object of listedObjects.Contents) {
          if (object.Key) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: bucketName,
              Key: object.Key,
            });
            
            await r2Client.send(deleteCommand);
            deletedCount++;
          }
        }
      }
      
      // También intentar eliminar el marcador de carpeta si existe
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: folderPath,
        });
        
        await r2Client.send(deleteCommand);
      } catch {
        // Si no existe el marcador de carpeta, es normal y continuamos
        console.log('Marcador de carpeta no encontrado o ya eliminado');
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Carpeta y ${deletedCount} elementos eliminados exitosamente` 
      });
    } else {
      // Es un archivo individual
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      
      await r2Client.send(deleteCommand);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Archivo eliminado exitosamente' 
      });
    }
  } catch (error) {
    console.error('Error al eliminar objeto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar el objeto', details: error },
      { status: 500 }
    );
  }
} 