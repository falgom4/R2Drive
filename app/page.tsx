'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Folder, Check, AlertCircle, Wifi, WifiOff, FileText, Cloud, Shield, Settings } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';
import { uploadDirectory, verifyBucketConnection, UploadProgress, uploadFile } from './lib/upload';
import BucketExplorer from './components/BucketExplorer';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isBucketConnected, setIsBucketConnected] = useState<boolean | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadProgress | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showExplorer, setShowExplorer] = useState(false);
  const [currentUploadPath, setCurrentUploadPath] = useState('');
  
  // Verificar la conexión al bucket cuando se carga la página
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await verifyBucketConnection();
        setIsBucketConnected(isConnected);
      } catch (err) {
        setIsBucketConnected(false);
        setError('Error al verificar la conexión con el bucket R2');
      }
    };

    checkConnection();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Verificar si está conectado al bucket antes de continuar
    if (!isBucketConnected) {
      setError('No hay conexión con el bucket R2. Verifica tus credenciales.');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);
    setUploadStatus(null);
    setUploadedFiles([]);

    const items = e.dataTransfer.items;
    if (!items) return;

    const allUploadedFiles: string[] = [];

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        
        if (!item) continue;
        
        if (item.isDirectory) {
          // Subir directorio completo
          const files = await uploadDirectory(
            item as FileSystemDirectoryEntry,
            currentUploadPath,
            (progress) => {
              setUploadStatus(progress);
              setProgress(progress.percentComplete);
            }
          );
          allUploadedFiles.push(...files);
          console.log(`Subidos ${files.length} archivos desde directorio ${item.name}`);
        } else if (item.isFile) {
          // Subir archivo individual
          const fileEntry = item as FileSystemFileEntry;
          
          const file: File = await new Promise((resolve, reject) => {
            fileEntry.file(resolve, reject);
          });
          
          setUploadStatus({
            totalFiles: items.length,
            uploadedFiles: i,
            currentFile: file.name,
            percentComplete: 0
          });
          
          const key = await uploadFile(
            file, 
            currentUploadPath || '',
            (progress) => {
              setProgress(progress);
              setUploadStatus(prev => prev ? {
                ...prev,
                percentComplete: progress
              } : null);
            }
          );
          
          allUploadedFiles.push(key);
          console.log(`Subido archivo individual: ${key}`);
        }
      }
      
      console.log(`Total de archivos subidos: ${allUploadedFiles.length}`);
      setUploadedFiles(allUploadedFiles);
      setSuccess(true);
    } catch (err) {
      console.error('Error en la subida:', err);
      setError(err instanceof Error ? err.message : 'Error al subir los archivos');
    } finally {
      setUploading(false);
    }
  }, [isBucketConnected, currentUploadPath]);

  // Manejar selección de carpeta para subir
  const handleSelectFolder = (prefix: string) => {
    setCurrentUploadPath(prefix);
  };

  return (
    <div className="min-h-screen">
      {/* Header estilo MEGA */}
      <header className="mega-header">
        <div className="mega-container flex justify-between items-center">
          <div className="mega-logo">
            <Cloud className="mega-logo-icon w-6 h-6" />
            <span>Cloudflare R2</span>
          </div>
          <div className="flex gap-6">
            <button className="p-3 rounded-full hover:bg-[var(--mega-surface-hover)]">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="mega-container py-14">
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="w-28 h-28 rounded-full bg-[var(--mega-secondary)] inline-flex items-center justify-center mb-6">
              <Shield className="w-14 h-14 text-[var(--mega-primary)]" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Almacenamiento R2 Seguro
            </h1>
            <p className="text-[var(--mega-text-secondary)] max-w-lg mx-auto px-4">
              Arrastra y suelta archivos o carpetas para subirlos a Cloudflare R2. Rápido, seguro y sencillo.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-10">
            {isBucketConnected === true && (
              <div className="mega-badge mega-badge-success flex items-center gap-3">
                <Wifi className="w-4 h-4" />
                <span>Conectado al bucket</span>
              </div>
            )}
            {isBucketConnected === false && (
              <div className="mega-badge mega-badge-error flex items-center gap-3">
                <WifiOff className="w-4 h-4" />
                <span>Sin conexión al bucket</span>
              </div>
            )}
            {isBucketConnected === null && (
              <div className="mega-badge mega-badge-warning flex items-center gap-3 animate-pulse">
                <span>Verificando conexión...</span>
              </div>
            )}
          </div>
          
          {/* Toggle para mostrar/ocultar el explorador de bucket */}
          <div className="text-center mt-6">
            <button
              className={showExplorer ? "mega-button-secondary" : "mega-button"}
              onClick={() => setShowExplorer(!showExplorer)}
            >
              {showExplorer ? 'Ocultar explorador' : 'Mostrar explorador de bucket'}
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
          {/* Explorador de bucket */}
          {showExplorer && (
            <div className="space-y-4">
              <BucketExplorer onSelectFolder={handleSelectFolder} />
              {currentUploadPath && (
                <div className="mega-card bg-[var(--mega-secondary)] p-4 text-center text-sm flex items-center gap-3 justify-center">
                  <Folder className="w-5 h-5 text-[var(--mega-primary)]" />
                  <span>Destino de subida: <strong className="text-[var(--mega-text-primary)]">{currentUploadPath || 'Raíz'}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Zona de arrastrar y soltar */}
          <div
            className={`drop-zone p-12 ${isDragging ? 'border-[var(--mega-primary)]' : ''} ${
              uploading ? 'opacity-80' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-8">
              {!uploading && !success && (
                <>
                  <div className="p-6 rounded-full bg-[var(--mega-secondary)]">
                    <Folder className="w-20 h-20 text-[var(--mega-primary)]" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-medium mb-4">
                      Arrastra tus archivos o carpetas aquí
                    </p>
                    {currentUploadPath && (
                      <p className="text-sm text-[var(--mega-text-secondary)]">
                        Se subirán a: <span className="text-[var(--mega-primary)]">{currentUploadPath}</span>
                      </p>
                    )}
                  </div>
                </>
              )}
              {uploading && (
                <div className="w-full space-y-8 max-w-md mx-auto">
                  <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-[var(--mega-secondary)]">
                      <Upload className="w-16 h-16 text-[var(--mega-primary)] animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-indicator"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {uploadStatus && (
                    <div className="bg-[var(--mega-surface)] rounded-lg p-6 text-sm">
                      <p className="text-center mb-4 text-lg font-medium">
                        Subiendo... {progress}%
                      </p>
                      <p className="text-[var(--mega-text-secondary)] text-center mb-4">
                        {uploadStatus.uploadedFiles} de {uploadStatus.totalFiles} archivos
                      </p>
                      {uploadStatus.currentFile && (
                        <div className="flex items-center gap-3 text-[var(--mega-text-secondary)] justify-center border-t border-[var(--mega-border)] pt-4">
                          <FileText className="w-5 h-5 flex-shrink-0" />
                          <p className="truncate max-w-xs">{uploadStatus.currentFile}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {success && !uploading && (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="w-20 h-20 rounded-full bg-[rgba(0,183,74,0.1)] flex items-center justify-center">
                    <Check className="w-12 h-12 text-[#00b74a]" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-medium text-[#00b74a] mb-3">
                      ¡Subida completada!
                    </h3>
                    <p className="text-[var(--mega-text-secondary)]">
                      Se subieron {uploadedFiles.length} archivos al bucket
                    </p>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <button 
                      className="mega-button-secondary mt-4"
                      onClick={() => {
                        const filesToShow = uploadedFiles.slice(0, 5);
                        const additionalFilesCount = uploadedFiles.length - 5;
                        
                        alert(`Archivos subidos:\n${filesToShow.join('\n')}${
                          additionalFilesCount > 0 ? `\n...y ${additionalFilesCount} más` : ''
                        }`);
                      }}
                    >
                      Ver archivos subidos
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="text-center text-[var(--mega-text-secondary)] text-sm mt-20">
          <p>Diseñado para Cloudflare R2</p>
        </div>
      </div>

      {/* Diálogo de error */}
      {error && (
        <Dialog.Root open={!!error} onOpenChange={() => setError(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content 
              className="fixed p-0 rounded-xl shadow-2xl w-full max-w-md mega-card" 
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="px-6 py-5 border-b border-[var(--mega-border)] bg-[rgba(217,0,7,0.1)]">
                <Dialog.Title className="text-lg font-semibold text-[var(--mega-primary)] flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  Error
                </Dialog.Title>
              </div>
              <div className="p-8">
                <Dialog.Description className="text-[var(--mega-text-primary)] mb-8">
                  {error}
                </Dialog.Description>
                <div className="flex justify-end">
                  <button
                    className="mega-button"
                    onClick={() => setError(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
