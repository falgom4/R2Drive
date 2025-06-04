import { NextResponse } from 'next/server';
import { access } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    
    try {
      await access(envPath);
      return NextResponse.json({ hasConfig: true });
    } catch {
      return NextResponse.json({ hasConfig: false });
    }
  } catch (error) {
    console.error('Error al verificar la configuración:', error);
    return NextResponse.json(
      { error: 'Error al verificar la configuración' },
      { status: 500 }
    );
  }
} 