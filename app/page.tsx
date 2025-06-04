'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Check, AlertCircle, Wifi, WifiOff, Cloud, Shield, Settings, XCircle, ArrowUp, Loader2, Sun, Moon, LogOut, RefreshCw } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { uploadDirectory, verifyBucketConnection, UploadProgress, uploadFile } from './lib/upload';
import BucketExplorer from './components/BucketExplorer';
import ConfigurationModal from './components/ConfigurationModal';

interface FileWithPath {
  file: File;
  path: string;
  relativePath: string;
}

// Interfaz para el progreso de carga
interface CustomUploadProgress {
  percent: number;
  completed: number;
  total: number;
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isBucketConnected, setIsBucketConnected] = useState<boolean | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [currentUploadPath, setCurrentUploadPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<CustomUploadProgress>({
    percent: 0,
    completed: 0,
    total: 0
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Verificar la conexión al bucket y la existencia de .env.local al cargar
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const response = await fetch('/api/config/check');
        const { hasConfig } = await response.json();
        
        if (!hasConfig) {
          setShowConfigModal(true);
          return;
        }

        const result = await verifyBucketConnection();
        setIsBucketConnected(result);
        
        // Si no hay conexión, mostrar modal de configuración
        if (!result) {
          setShowConfigModal(true);
        }
      } catch (err) {
        setIsBucketConnected(false);
        setShowConfigModal(true);
        console.error('Error al verificar la configuración:', err);
      }
    };
    
    checkConfiguration();
  }, []);

  // Manejar cuando se arrastra un archivo
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Manejar cuando se deja de arrastrar
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Manejar selección de carpeta desde el explorador
  const handleSelectFolder = useCallback((prefix: string) => {
    setCurrentUploadPath(prefix);
  }, []);

  // Función para manejar la subida de archivos
  const uploadFiles = async (
    items: FileList | DataTransferItemList | FileWithPath[], 
    prefix: string,
    progressCallback: (progress: CustomUploadProgress) => void
  ): Promise<string[]> => {
    const uploadedFiles: string[] = [];
    let totalFiles = 0;
    let completedFiles = 0;
    
    // Función auxiliar para actualizar el progreso
    const updateProgress = () => {
      progressCallback({
        percent: totalFiles ? Math.round((completedFiles / totalFiles) * 100) : 0,
        completed: completedFiles,
        total: totalFiles
      });
    };
    
    // Procesar la lista de elementos
    if (items instanceof DataTransferItemList) {
      // Es un drop de archivos/carpetas
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        
        if (!item) continue;
        
        if (item.isDirectory) {
          // Subir directorio completo
          const files = await uploadDirectory(
            item as FileSystemDirectoryEntry,
            prefix,
            (progress: UploadProgress) => {
              // Actualizar solo el progreso parcial
              completedFiles = progress.uploadedFiles;
              totalFiles = progress.totalFiles;
              updateProgress();
            }
          );
          uploadedFiles.push(...files);
        } else if (item.isFile) {
          // Subir archivo individual
          const fileEntry = item as FileSystemFileEntry;
          
          const file: File = await new Promise((resolve, reject) => {
            fileEntry.file(resolve, reject);
          });
          
          totalFiles++;
          updateProgress();
          
          const key = await uploadFile(
            file, 
            prefix,
            (progressPercent: number) => {
              // No actualizamos completedFiles hasta que termine
              progressCallback({
                ...uploadProgress,
                percent: progressPercent
              });
            }
          );
          
          completedFiles++;
          updateProgress();
          uploadedFiles.push(key);
        }
      }
    } else if (items instanceof FileList || Array.isArray(items)) {
      // Es una selección de archivos o un array de FileWithPath
      const fileArray = Array.isArray(items) 
        ? items 
        : Array.from(items).map(file => ({
            file,
            path: file.name,
            relativePath: file.name
          }));
      
      totalFiles = fileArray.length;
      updateProgress();
      
      for (const fileItem of fileArray) {
        const file = 'file' in fileItem ? fileItem.file : fileItem;
        
        const key = await uploadFile(
          file, 
          prefix,
          (progressPercent: number) => {
            progressCallback({
              ...uploadProgress,
              percent: progressPercent
            });
          }
        );
        
        completedFiles++;
        updateProgress();
        uploadedFiles.push(key);
      }
    }
    
    return uploadedFiles;
  };

  // Manejar cuando se sueltan archivos
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      // Verificar la conexión al bucket
      if (isBucketConnected !== true) {
        setError('No connection to bucket. Please check your configuration.');
        return;
      }

      // Obtener archivos
      const items = e.dataTransfer.items;
      if (!items) return;

      // Iniciar estado de carga
      setUploading(true);
      setSuccess(false);
      setError(null);
      setUploadedFiles([]);
      setUploadProgress({
        percent: 0,
        completed: 0,
        total: 0
      });

      try {
        // Cargar archivos
        const results = await uploadFiles(items, currentUploadPath || '', (progress) => {
          setUploadProgress(progress);
        });

        // Actualizar estado
        setUploadedFiles(results);
        setSuccess(true);
      } catch (err: unknown) {
        console.error('Error during upload:', err);
        setError(err instanceof Error ? err.message : 'Error uploading files');
      } finally {
        setUploading(false);
      }
    },
    [isBucketConnected, currentUploadPath]
  );

  // Manejar cambio de archivos por input
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Verificar la conexión al bucket
      if (isBucketConnected !== true) {
        setError('No connection to bucket. Please check your configuration.');
        return;
      }

      // Iniciar estado de carga
      setUploading(true);
      setSuccess(false);
      setError(null);
      setUploadedFiles([]);
      setUploadProgress({
        percent: 0,
        completed: 0,
        total: 0
      });

      try {
        // Convertir FileList a un array de Files
        const fileArray = Array.from(files).map(file => ({
          file,
          path: file.name,
          relativePath: file.name
        })) as FileWithPath[];

        // Cargar archivos
        const results = await uploadFiles(fileArray, currentUploadPath || '', (progress) => {
          setUploadProgress(progress);
        });

        // Actualizar estado
        setUploadedFiles(results);
        setSuccess(true);
      } catch (err: unknown) {
        console.error('Error during upload:', err);
        setError(err instanceof Error ? err.message : 'Error uploading files');
      } finally {
        setUploading(false);
      }
    },
    [isBucketConnected, currentUploadPath]
  );

  // Toggle theme between light and dark mode
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Apply the class to the document body
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);
  
  // Initialize theme
  useEffect(() => {
    // Check if user has a preference
    const savedTheme = localStorage.getItem('r2drive-theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.body.classList.add('light-mode');
    }
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem('r2drive-theme', theme);
  }, [theme]);
  
  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Force reconnect to bucket
  const refreshConnection = useCallback(async () => {
    setIsBucketConnected(null);
    try {
      const result = await verifyBucketConnection();
      setIsBucketConnected(result);
    } catch (err) {
      setIsBucketConnected(false);
      console.error('Error al verificar la conexión:', err);
    }
    
    // Close settings menu
    setShowSettingsMenu(false);
  }, []);

  const handleSaveConfig = async (config: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl?: string;
  }) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      setShowConfigModal(false);
      
      // Verificar la nueva conexión automáticamente
      setIsBucketConnected(null); // Mostrar estado de verificando
      const result = await verifyBucketConnection();
      setIsBucketConnected(result);
      
      if (result) {
        setError(null); // Limpiar cualquier error previo
      } else {
        setError('No se pudo conectar con las nuevas credenciales');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al guardar la configuración');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="app-header">
        <div className="app-container flex justify-between items-center">
          <div className="app-logo">
            <Cloud className="app-logo-icon w-6 h-6" aria-hidden="true" />
            <span>R2Drive</span>
          </div>
          <div className="flex gap-6 relative" ref={settingsMenuRef}>
            <button 
              className="settings-button p-2.5 rounded-full bg-[var(--app-bg-light)] border border-[var(--app-border)] hover:bg-[var(--app-surface-hover)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Configuración"
              aria-expanded={showSettingsMenu}
              aria-haspopup="true"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <Settings className="w-5 h-5 text-[var(--app-text-primary)]" aria-hidden="true" />
            </button>
            
            {/* Menú desplegable de configuración */}
            {showSettingsMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-64 rounded-lg app-card p-2 shadow-lg z-50 border border-[var(--app-border)]"
                style={{
                  right: 0,
                  maxWidth: 'calc(100vw - 32px)',
                  transform: 'translateX(0)'
                }}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="settings-menu"
              >
                <div className="py-1.5 px-2 text-xs font-medium text-[var(--app-text-secondary)] border-b border-[var(--app-border)] mb-1">
                  CONFIGURACIÓN
                </div>
                
                <button 
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-md hover:bg-[var(--app-surface-hover)] text-[var(--app-text-primary)]"
                  onClick={toggleTheme}
                  role="menuitem"
                >
                  {theme === 'dark' 
                    ? <Sun className="w-4 h-4 text-[var(--secondary)]" aria-hidden="true" /> 
                    : <Moon className="w-4 h-4 text-[var(--secondary)]" aria-hidden="true" />
                  }
                  <span>{theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}</span>
                </button>
                
                <button 
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-md hover:bg-[var(--app-surface-hover)] text-[var(--app-text-primary)]"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setShowConfigModal(true);
                  }}
                  role="menuitem"
                >
                  <Settings className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                  <span>Configurar credenciales</span>
                </button>
                
                <button 
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-md hover:bg-[var(--app-surface-hover)] text-[var(--app-text-primary)]"
                  onClick={refreshConnection}
                  role="menuitem"
                >
                  <RefreshCw className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                  <span>Actualizar conexión</span>
                </button>
                
                <div className="border-t border-[var(--app-border)] my-1"></div>
                
                <button 
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-md hover:bg-[rgba(239,68,68,0.1)] text-[var(--error)]"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setError('Esta función no está implementada todavía');
                  }}
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="app-container py-14">
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="w-24 h-24 rounded-full bg-[var(--app-bg-light)] inline-flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-[var(--primary)]" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              R2Drive
            </h1>
            <p className="text-[var(--app-text-secondary)] max-w-lg mx-auto px-4">
              Secure file management for Cloudflare R2. Fast, reliable, and intuitive.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-10">
            {isBucketConnected === true && (
              <div className="app-badge app-badge-success flex items-center gap-3">
                <Wifi className="w-4 h-4" aria-hidden="true" />
                <span>Connected to bucket</span>
              </div>
            )}
            {isBucketConnected === false && (
              <button 
                className="app-badge app-badge-error flex items-center gap-3 cursor-pointer hover:bg-[rgba(239,68,68,0.2)] transition-colors duration-200"
                onClick={() => setShowConfigModal(true)}
                aria-label="Configure bucket connection"
              >
                <WifiOff className="w-4 h-4" aria-hidden="true" />
                <span>No bucket connection - Click to configure</span>
              </button>
            )}
            {isBucketConnected === null && (
              <div className="app-badge app-badge-warning flex items-center gap-3 animate-pulse" aria-live="polite">
                <span>Verifying connection...</span>
              </div>
            )}
          </div>
          
          {/* Toggle para mostrar/ocultar el explorador de bucket */}
          <div className="text-center mt-8">
            <button
              className={showExplorer ? "app-button-secondary" : "app-button-primary"}
              onClick={() => setShowExplorer(!showExplorer)}
              aria-expanded={showExplorer}
              aria-controls="bucket-explorer"
            >
              {showExplorer ? 'Hide explorer' : 'Show bucket explorer'}
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
          {/* Explorador de bucket */}
          {showExplorer && (
            <div className="space-y-4" id="bucket-explorer">
              <BucketExplorer onSelectFolder={handleSelectFolder} />
              {currentUploadPath && (
                <div className="app-card bg-[var(--app-bg-light)] p-4 text-center text-sm flex items-center gap-3 justify-center">
                  <Upload className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                  <span>Upload destination: <strong className="text-[var(--app-text-primary)]">{currentUploadPath || 'Root'}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Zona de arrastrar y soltar */}
          <div
            className={`drop-zone p-12 ${isDragging ? 'border-[var(--primary)]' : ''} ${
              uploading ? 'opacity-80' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-live="polite"
            role="region"
            aria-label="Área para subir archivos"
          >
            <div className="flex flex-col items-center gap-6">
              {!uploading && !success && (
                <>
                  <div className="w-20 h-20 rounded-full user-avatar flex items-center justify-center">
                    <ArrowUp className="w-10 h-10 text-[var(--app-text-secondary)]" aria-hidden="true" />
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-medium mb-2">Upload files to R2</h2>
                    <p className="text-[var(--app-text-secondary)] mb-6">
                      Drag and drop files here, or click to browse
                    </p>
                    
                    <label className="app-button-primary cursor-pointer">
                      <span>Browse files</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        onChange={handleFileChange} 
                        multiple 
                        aria-label="Seleccionar archivos para subir"
                      />
                    </label>
                  </div>
                </>
              )}
              
              {uploading && (
                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                  <div className="w-20 h-20 rounded-full user-avatar flex items-center justify-center bg-[rgba(37,99,235,0.1)]">
                    <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" aria-hidden="true" />
                  </div>
                  
                  <div className="text-center w-full">
                    <h3 className="text-xl font-medium mb-2">
                      Uploading files...
                    </h3>
                    <p className="text-[var(--app-text-secondary)] mb-4">
                      {uploadProgress.completed} of {uploadProgress.total} files completed
                    </p>
                    
                    <div className="progress-bar" role="progressbar" aria-valuenow={uploadProgress.percent} aria-valuemin={0} aria-valuemax={100}>
                      <div 
                        className="progress-indicator" 
                        style={{ width: `${uploadProgress.percent}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-[var(--app-text-secondary)] text-sm">
                      {uploadProgress.percent}% complete
                    </p>
                  </div>
                </div>
              )}
              
              {success && !uploading && (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="w-20 h-20 rounded-full user-avatar flex items-center justify-center bg-[rgba(16,185,129,0.1)]">
                    <Check className="w-12 h-12 text-[var(--success)]" aria-hidden="true" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-medium text-[var(--success)] mb-3">
                      Upload completed!
                    </h3>
                    <p className="text-[var(--app-text-secondary)]">
                      {uploadedFiles.length} files uploaded to bucket
                    </p>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <button 
                      className="app-button-secondary mt-4"
                      onClick={() => {
                        const filesToShow = uploadedFiles.slice(0, 5);
                        const additionalFilesCount = uploadedFiles.length - 5;
                        
                        alert(`Uploaded files:\n${filesToShow.join('\n')}${
                          additionalFilesCount > 0 ? `\n...and ${additionalFilesCount} more` : ''
                        }`);
                      }}
                      aria-label="Ver archivos subidos"
                    >
                      View uploaded files
                    </button>
                  )}
                </div>
              )}
              
              {error && (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="w-20 h-20 rounded-full user-avatar flex items-center justify-center bg-[rgba(239,68,68,0.1)]">
                    <XCircle className="w-12 h-12 text-[var(--error)]" aria-hidden="true" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-medium text-[var(--error)] mb-3">
                      Upload failed
                    </h3>
                    <p className="text-[var(--app-text-secondary)]">
                      {error}
                    </p>
                  </div>
                  
                  <button 
                    className="app-button-primary mt-4"
                    onClick={() => setError(null)}
                    aria-label="Intentar de nuevo"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="text-center text-[var(--app-text-secondary)] text-sm mt-20">
          <p>Designed for Cloudflare R2</p>
        </div>
      </main>

      {/* Diálogo de error */}
      {error && (
        <Dialog.Root open={!!error} onOpenChange={() => setError(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content 
              className="fixed p-0 rounded-xl shadow-2xl w-full max-w-md app-card" 
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              aria-labelledby="error-dialog-title"
              aria-describedby="error-dialog-description"
            >
              <div className="px-6 py-5 border-b border-[var(--app-border)] bg-[rgba(239,68,68,0.1)]">
                <Dialog.Title id="error-dialog-title" className="text-lg font-semibold text-[var(--error)] flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  Error
                </Dialog.Title>
              </div>
              <div className="p-8">
                <Dialog.Description id="error-dialog-description" className="text-[var(--app-text-primary)] mb-8">
                  {error}
                </Dialog.Description>
                <div className="flex justify-end">
                  <button
                    className="app-button-primary"
                    onClick={() => setError(null)}
                    aria-label="Cerrar mensaje de error"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      <ConfigurationModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
