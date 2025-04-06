'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Folder, Check, AlertCircle, Wifi, WifiOff, FileText, Cloud, Shield, Settings, XCircle, ArrowUp } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Progress from '@radix-ui/react-progress';
import { uploadDirectory, verifyBucketConnection, UploadProgress, uploadFile, uploadFiles, FileWithPath } from './lib/upload';
import BucketExplorer from './components/BucketExplorer';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isBucketConnected, setIsBucketConnected] = useState<boolean | null>(null);
  const [showExplorer, setShowExplorer] = useState(false);
  const [currentUploadPath, setCurrentUploadPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState({
    percent: 0,
    completed: 0,
    total: 0
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Verificar la conexión al bucket al cargar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await verifyBucketConnection();
        setIsBucketConnected(result);
      } catch (err) {
        setIsBucketConnected(false);
        console.error('Error al verificar la conexión:', err);
      }
    };
    
    checkConnection();
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
      } catch (err: any) {
        console.error('Error during upload:', err);
        setError(err.message || 'Error uploading files');
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
      } catch (err: any) {
        console.error('Error during upload:', err);
        setError(err.message || 'Error uploading files');
      } finally {
        setUploading(false);
      }
    },
    [isBucketConnected, currentUploadPath]
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="app-header">
        <div className="app-container flex justify-between items-center">
          <div className="app-logo">
            <Cloud className="app-logo-icon w-6 h-6" aria-hidden="true" />
            <span>R2Drive</span>
          </div>
          <div className="flex gap-6">
            <button 
              className="p-3 rounded-full hover:bg-[var(--app-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
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
              <div className="app-badge app-badge-error flex items-center gap-3">
                <WifiOff className="w-4 h-4" aria-hidden="true" />
                <span>No bucket connection</span>
              </div>
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
                  <div className="w-20 h-20 rounded-full bg-[var(--app-surface-hover)] flex items-center justify-center">
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
                  <div className="w-20 h-20 rounded-full bg-[rgba(37,99,235,0.1)] flex items-center justify-center">
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
                  <div className="w-20 h-20 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
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
                  <div className="w-20 h-20 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
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
