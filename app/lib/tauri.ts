// Detectar si estamos en entorno Tauri
export const isTauri = () => {
  if (typeof window === 'undefined') return false;
  return (window as unknown as { __TAURI__?: boolean }).__TAURI__ !== undefined;
};

// Configuración específica para Tauri
export const getTauriConfig = () => {
  if (!isTauri()) return null;
  
  return {
    // Configuraciones específicas para desktop
    isDesktop: true,
    canAccessFileSystem: true,
    hasNativeMenus: true
  };
};

// API para interactuar con el sistema de archivos en Tauri
export const tauriFS = {
  async selectDirectory(): Promise<string | null> {
    if (!isTauri()) return null;
    
    try {
      // Placeholder for Tauri file dialog functionality
      console.log('Tauri file dialog not implemented yet');
      return null;
    } catch (error) {
      console.error('Error selecting directory:', error);
      return null;
    }
  },

  async selectFiles(): Promise<string[] | null> {
    if (!isTauri()) return null;
    
    try {
      // Placeholder for Tauri file dialog functionality  
      console.log('Tauri file dialog not implemented yet');
      return null;
    } catch (error) {
      console.error('Error selecting files:', error);
      return null;
    }
  },

  async readFile(path: string): Promise<Uint8Array | null> {
    if (!isTauri()) return null;
    
    try {
      // Placeholder for Tauri fs functionality
      console.log('Tauri file system not implemented yet', path);
      return null;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }
};