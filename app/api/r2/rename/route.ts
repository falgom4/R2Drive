import { renameFolder, hasR2Config } from '@/app/lib/r2-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verificar que hay configuración antes de intentar conectar
    if (!hasR2Config()) {
      return NextResponse.json(
        { success: false, error: 'No R2 configuration found' },
        { status: 500 }
      );
    }

    const { oldPrefix, newPrefix } = await request.json();

    if (!oldPrefix || !newPrefix) {
      return NextResponse.json(
        { success: false, error: 'oldPrefix y newPrefix son requeridos' },
        { status: 400 }
      );
    }

    if (oldPrefix === newPrefix) {
      return NextResponse.json(
        { success: false, error: 'El nuevo nombre debe ser diferente al actual' },
        { status: 400 }
      );
    }

    await renameFolder(oldPrefix, newPrefix);

    return NextResponse.json({
      success: true,
      message: 'Carpeta renombrada exitosamente'
    });

  } catch (error) {
    console.error('Error al renombrar carpeta:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al renombrar carpeta',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}