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
      {/* Header estilo Cloudflare */}
      <header className="cf-header">
        <div className="cf-container flex justify-between items-center">
          <div className="cf-logo">
            <Cloud className="cf-logo-icon w-6 h-6" />
            <span>R2Drive</span>
          </div>
          <div className="flex gap-6">
            <button className="p-3 rounded-full hover:bg-[var(--cf-surface-hover)]">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="cf-container py-14">
        <div className="mb-20">
          <div className="text-center mb-10">
            <div className="w-24 h-24 rounded-full bg-[var(--cf-bg-dark)] inline-flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-[var(--cf-orange)]" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              R2Drive
            </h1>
            <p className="text-[var(--cf-text-secondary)] max-w-lg mx-auto px-4">
              Secure file management for Cloudflare R2. Fast, reliable, and intuitive.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-10">
            {isBucketConnected === true && (
              <div className="cf-badge cf-badge-success flex items-center gap-3">
                <Wifi className="w-4 h-4" />
                <span>Connected to bucket</span>
              </div>
            )}
            {isBucketConnected === false && (
              <div className="cf-badge cf-badge-error flex items-center gap-3">
                <WifiOff className="w-4 h-4" />
                <span>No bucket connection</span>
              </div>
            )}
            {isBucketConnected === null && (
              <div className="cf-badge cf-badge-warning flex items-center gap-3 animate-pulse">
                <span>Verifying connection...</span>
              </div>
            )}
          </div>
          
          {/* Toggle para mostrar/ocultar el explorador de bucket */}
          <div className="text-center mt-6">
            <button
              className={showExplorer ? "cf-button-secondary" : "cf-button-primary"}
              onClick={() => setShowExplorer(!showExplorer)}
            >
              {showExplorer ? 'Hide explorer' : 'Show bucket explorer'}
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
                <div className="cf-card bg-[var(--cf-bg-dark)] p-4 text-center text-sm flex items-center gap-3 justify-center">
                  <Folder className="w-5 h-5 text-[var(--cf-orange)]" />
                  <span>Upload destination: <strong className="text-[var(--cf-text-primary)]">{currentUploadPath || 'Root'}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Zona de arrastrar y soltar */}
          <div
            className={`drop-zone p-12 ${isDragging ? 'border-[var(--cf-orange)]' : ''} ${
              uploading ? 'opacity-80' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-8">
              {!uploading && !success && (
                <>
                  <div className="p-6 rounded-full bg-[var(--cf-bg-dark)]">
                    <Folder className="w-20 h-20 text-[var(--cf-orange)]" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-medium mb-4">
                      Drop your files or folders here
                    </p>
                    {currentUploadPath && (
                      <p className="text-sm text-[var(--cf-text-secondary)]">
                        Will be uploaded to: <span className="text-[var(--cf-orange)]">{currentUploadPath}</span>
                      </p>
                    )}
                  </div>
                </>
              )}
              {uploading && (
                <div className="w-full space-y-8 max-w-md mx-auto">
                  <div className="flex justify-center">
                    <div className="p-6 rounded-full bg-[var(--cf-bg-dark)]">
                      <Upload className="w-16 h-16 text-[var(--cf-blue)] animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-indicator"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  {uploadStatus && (
                    <div className="bg-[var(--cf-surface)] rounded-lg p-6 text-sm">
                      <p className="text-center mb-4 text-lg font-medium">
                        Uploading... {progress}%
                      </p>
                      <p className="text-[var(--cf-text-secondary)] text-center mb-4">
                        {uploadStatus.uploadedFiles} of {uploadStatus.totalFiles} files
                      </p>
                      {uploadStatus.currentFile && (
                        <div className="flex items-center gap-3 text-[var(--cf-text-secondary)] justify-center border-t border-[var(--cf-border)] pt-4">
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
                      Upload completed!
                    </h3>
                    <p className="text-[var(--cf-text-secondary)]">
                      {uploadedFiles.length} files uploaded to bucket
                    </p>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <button 
                      className="cf-button-secondary mt-4"
                      onClick={() => {
                        const filesToShow = uploadedFiles.slice(0, 5);
                        const additionalFilesCount = uploadedFiles.length - 5;
                        
                        alert(`Uploaded files:\n${filesToShow.join('\n')}${
                          additionalFilesCount > 0 ? `\n...and ${additionalFilesCount} more` : ''
                        }`);
                      }}
                    >
                      View uploaded files
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pie de página */}
        <div className="text-center text-[var(--cf-text-secondary)] text-sm mt-20">
          <p>Designed for Cloudflare R2</p>
        </div>
      </div>

      {/* Diálogo de error */}
      {error && (
        <Dialog.Root open={!!error} onOpenChange={() => setError(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content 
              className="fixed p-0 rounded-xl shadow-2xl w-full max-w-md cf-card" 
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="px-6 py-5 border-b border-[var(--cf-border)] bg-[rgba(246,130,31,0.1)]">
                <Dialog.Title className="text-lg font-semibold text-[var(--cf-orange)] flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  Error
                </Dialog.Title>
              </div>
              <div className="p-8">
                <Dialog.Description className="text-[var(--cf-text-primary)] mb-8">
                  {error}
                </Dialog.Description>
                <div className="flex justify-end">
                  <button
                    className="cf-button-primary"
                    onClick={() => setError(null)}
                  >
                    Close
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
