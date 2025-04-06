// Interfaz para el objeto de retorno de la API de listado
export interface BucketListResponse {
  success: boolean;
  prefix: string;
  files: Array<{
    key: string;
    name: string;
    size: number;
    lastModified: Date;
    isFolder: boolean;
  }>;
  folders: Array<{
    prefix: string;
    name: string;
  }>;
  parentFolder: string;
}

// Interfaz para el seguimiento del progreso
export interface UploadProgress {
  totalFiles: number;
  uploadedFiles: number;
  currentFile: string;
  percentComplete: number;
}

// Función para verificar la conexión al bucket usando la API
export async function verifyBucketConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/r2/verify');
    const data = await response.json();
    return data.success && data.connected;
  } catch (error) {
    console.error('Error al verificar la conexión al bucket:', error);
    return false;
  }
}

// Función para listar objetos del bucket
export async function listBucketObjects(prefix: string = ''): Promise<BucketListResponse> {
  try {
    const response = await fetch(`/api/r2/list?prefix=${encodeURIComponent(prefix)}`);
    if (!response.ok) {
      throw new Error('Error al listar objetos del bucket');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al listar objetos del bucket:', error);
    throw error;
  }
}

// Función para subir un archivo usando la API
export async function uploadFile(
  file: File, 
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', path);

      // Usar XMLHttpRequest para poder monitorear el progreso
      const xhr = new XMLHttpRequest();
      
      // Manejar el evento de progreso
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
      
      // Manejar la finalización de la solicitud
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (onProgress) onProgress(100);
            resolve(response.key);
          } catch (error) {
            reject(new Error('Error al analizar la respuesta del servidor'));
          }
        } else {
          let errorMessage = 'Error al subir el archivo';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // Si no se puede analizar el error, usar el mensaje predeterminado
          }
          reject(new Error(errorMessage));
        }
      });
      
      // Manejar errores de red
      xhr.addEventListener('error', () => {
        reject(new Error('Error de red al subir el archivo'));
      });
      
      // Manejar tiempo de espera agotado
      xhr.addEventListener('timeout', () => {
        reject(new Error('Tiempo de espera agotado al subir el archivo'));
      });
      
      // Abrir y enviar la solicitud
      xhr.open('POST', '/api/r2/upload');
      xhr.send(formData);
    } catch (error) {
      console.error('Error al subir archivo:', error);
      reject(error);
    }
  });
}

export async function uploadDirectory(
  entry: FileSystemDirectoryEntry,
  currentPath: string = '',
  onProgress?: (progress: UploadProgress) => void
): Promise<string[]> {
  const uploadedFiles: string[] = [];
  let totalFilesCount = 0;
  let processedFilesCount = 0;
  
  // Primera pasada para contar archivos
  async function countFiles(entry: FileSystemDirectoryEntry): Promise<number> {
    const reader = entry.createReader();
    
    const readEntries = (): Promise<FileSystemEntry[]> => {
      return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
    };
    
    let count = 0;
    let entries: FileSystemEntry[] = [];
    do {
      const batch = await readEntries();
      if (batch.length === 0) break;
      entries = entries.concat(batch);
    } while (true);
    
    for (const entry of entries) {
      if (entry.isFile) {
        count++;
      } else if (entry.isDirectory) {
        count += await countFiles(entry as FileSystemDirectoryEntry);
      }
    }
    
    return count;
  }
  
  // Contar archivos primero
  totalFilesCount = await countFiles(entry);
  
  if (onProgress) {
    onProgress({
      totalFiles: totalFilesCount,
      uploadedFiles: 0,
      currentFile: '',
      percentComplete: 0
    });
  }
  
  // Normalizar el path para que siempre termine con / si no está vacío
  let uploadPath = currentPath || '';
  if (uploadPath && !uploadPath.endsWith('/') && uploadPath !== '') {
    uploadPath = `${uploadPath}/`;
  }
  
  // Verificar si la ruta ya termina con el nombre del directorio
  // Esto evita la duplicación de carpetas como "Cueva/Cueva"
  const dirName = entry.name;
  const pathSegments = uploadPath.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  // Construir el path base para los archivos
  let basePath;
  if (lastSegment === dirName) {
    // Si la última parte de la ruta ya coincide con el nombre del directorio,
    // no añadir el nombre de nuevo
    basePath = uploadPath;
    console.log(`La carpeta ${dirName} ya está incluida en la ruta ${uploadPath}. Evitando duplicación.`);
  } else {
    // Caso normal: añadir el nombre del directorio a la ruta
    basePath = uploadPath ? `${uploadPath}${dirName}` : dirName;
  }
  
  console.log(`Subiendo directorio ${entry.name} a la ruta: ${basePath}`);
  
  const processEntry = async (entry: FileSystemEntry, path: string) => {
    if (entry.isFile) {
      const fileEntry = entry as FileSystemFileEntry;
      const file: File = await new Promise((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });
      
      if (onProgress) {
        onProgress({
          totalFiles: totalFilesCount,
          uploadedFiles: processedFilesCount,
          currentFile: file.name,
          percentComplete: Math.floor((processedFilesCount / totalFilesCount) * 100)
        });
      }
      
      const key = await uploadFile(file, path);
      uploadedFiles.push(key);
      
      processedFilesCount++;
      
      if (onProgress) {
        onProgress({
          totalFiles: totalFilesCount,
          uploadedFiles: processedFilesCount,
          currentFile: file.name,
          percentComplete: Math.floor((processedFilesCount / totalFilesCount) * 100)
        });
      }
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      
      // Aplicar la misma lógica de no duplicación para subdirectorios
      const dirName = entry.name;
      const pathSegments = path.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      let subDirPath;
      if (lastSegment === dirName) {
        // Si la ruta ya termina con el nombre del directorio, no duplicar
        subDirPath = path;
      } else {
        subDirPath = `${path}/${dirName}`;
      }
      
      const subDirectoryFiles = await uploadDirectoryContents(dirEntry, subDirPath);
      uploadedFiles.push(...subDirectoryFiles);
    }
  };

  const uploadDirectoryContents = async (dirEntry: FileSystemDirectoryEntry, path: string): Promise<string[]> => {
    const subDirFiles: string[] = [];
    let entries: FileSystemEntry[] = [];
    
    // Crear un nuevo reader específico para este directorio
    const reader = dirEntry.createReader();
    
    const readEntries = (): Promise<FileSystemEntry[]> => {
      return new Promise((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
    };
    
    do {
      const batch = await readEntries();
      if (batch.length === 0) break;
      entries = entries.concat(batch);
    } while (true);

    for (const entry of entries) {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        const file: File = await new Promise((resolve, reject) => {
          fileEntry.file(resolve, reject);
        });
        
        if (onProgress) {
          onProgress({
            totalFiles: totalFilesCount,
            uploadedFiles: processedFilesCount,
            currentFile: file.name,
            percentComplete: Math.floor((processedFilesCount / totalFilesCount) * 100)
          });
        }
        
        const key = await uploadFile(file, path);
        subDirFiles.push(key);
        console.log(`Subido archivo ${file.name} a ${path}`);
        
        processedFilesCount++;
        
        if (onProgress) {
          onProgress({
            totalFiles: totalFilesCount,
            uploadedFiles: processedFilesCount,
            currentFile: file.name,
            percentComplete: Math.floor((processedFilesCount / totalFilesCount) * 100)
          });
        }
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        
        // Aplicar la misma lógica de no duplicación para subdirectorios
        const dirName = entry.name;
        const pathSegments = path.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        let subDirPath;
        if (lastSegment === dirName) {
          // Si la ruta ya termina con el nombre del directorio, no duplicar
          subDirPath = path;
        } else {
          subDirPath = `${path}/${dirName}`;
        }
        
        const subDirResult = await uploadDirectoryContents(dirEntry, subDirPath);
        subDirFiles.push(...subDirResult);
      }
    }
    
    return subDirFiles;
  };

  await processEntry(entry, basePath);
  
  return uploadedFiles;
}

// Función para eliminar un objeto del bucket (archivo o carpeta)
export async function deleteObject(key: string, isFolder: boolean): Promise<boolean> {
  try {
    const response = await fetch('/api/r2/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, isFolder }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al eliminar objeto');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error al eliminar objeto:', error);
    throw error;
  }
} 