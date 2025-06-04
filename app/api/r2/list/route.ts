import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getR2Client, getBucketName, hasR2Config } from '@/app/lib/r2-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
    
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get('prefix') || '';
    const delimiter = '/'; // Usar delimitador para simular navegación por carpetas
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      Delimiter: delimiter,
      MaxKeys: 1000,
    });
    
    const response = await r2Client.send(command);
    
    // Procesamos los resultados para tener una estructura más amigable
    const result = {
      success: true,
      prefix: prefix,
      files: [] as Array<{
        key: string;
        name: string;
        size: number;
        lastModified: Date | undefined;
        isFolder: boolean;
      }>,
      folders: [] as Array<{
        prefix: string;
        name: string;
      }>,
      parentFolder: prefix.includes('/') 
        ? prefix.split('/').slice(0, -1).join('/') 
        : '',
    };

    // Procesar archivos
    if (response.Contents) {
      for (const item of response.Contents) {
        // Ignorar el archivo que representa al directorio actual
        if (item.Key === prefix) continue;
        
        const name = item.Key?.substring(prefix.length) || '';
        // Solo incluir archivos directos (no los que están en subcarpetas)
        if (!name.includes('/')) {
          result.files.push({
            key: item.Key || '',
            name,
            size: item.Size || 0,
            lastModified: item.LastModified,
            isFolder: false,
          });
        }
      }
    }

    // Procesar carpetas (CommonPrefixes)
    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        const folderPrefix = prefix.Prefix || '';
        const folderName = folderPrefix.split('/').filter(Boolean).pop() || '';
        
        result.folders.push({
          prefix: folderPrefix,
          name: folderName,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al listar objetos del bucket:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al listar objetos del bucket', 
        details: error 
      },
      { status: 500 }
    );
  }
} 