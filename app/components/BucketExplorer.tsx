'use client';

import { useState, useEffect } from 'react';
import { Folder, File, ChevronLeft, RefreshCw, Loader2, FolderOpen, Home, Trash2, MoreHorizontal, Check, X, Cloud, Download } from 'lucide-react';
import { listBucketObjects, BucketListResponse, deleteObject } from '../lib/upload';
import * as Dialog from '@radix-ui/react-dialog';

// Función para formatear el tamaño de archivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para formatear la fecha
const formatDate = (date: Date | undefined): string => {
  if (!date) return '-';
  
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

interface BucketExplorerProps {
  onSelectFolder?: (prefix: string) => void;
}

export default function BucketExplorer({ onSelectFolder }: BucketExplorerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [bucketContents, setBucketContents] = useState<BucketListResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{isOpen: boolean, items: Array<{key: string, name: string, isFolder: boolean}>}>({
    isOpen: false,
    items: []
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const loadBucketContents = async (prefix: string = '') => {
    setLoading(true);
    setError(null);
    setSelectedItems(new Set());
    
    try {
      const result = await listBucketObjects(prefix);
      setBucketContents(result);
      setCurrentPrefix(prefix);
    } catch (err) {
      setError('Error al cargar el contenido del bucket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar contenido inicial al montar el componente
  useEffect(() => {
    loadBucketContents();
  }, []);

  // Navegar a una carpeta
  const navigateToFolder = (prefix: string) => {
    loadBucketContents(prefix);
    if (onSelectFolder) {
      onSelectFolder(prefix);
    }
  };

  // Volver a la carpeta padre
  const navigateToParent = () => {
    if (bucketContents && bucketContents.parentFolder !== undefined) {
      navigateToFolder(bucketContents.parentFolder);
    }
  };

  // Refrescar el contenido actual
  const refreshContents = () => {
    loadBucketContents(currentPrefix);
  };

  // Ir a la raíz
  const navigateToRoot = () => {
    loadBucketContents('');
    if (onSelectFolder) {
      onSelectFolder('');
    }
  };
  
  // Seleccionar o deseleccionar un item
  const toggleItemSelection = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = new Set(selectedItems);
    
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    
    setSelectedItems(newSelection);
  };
  
  // Mostrar diálogo de confirmación de eliminación
  const handleDeleteClick = () => {
    if (selectedItems.size === 0) return;
    
    const itemsToDelete: Array<{key: string, name: string, isFolder: boolean}> = [];
    
    // Agregar carpetas seleccionadas
    if (bucketContents?.folders) {
      bucketContents.folders.forEach(folder => {
        if (selectedItems.has(folder.prefix)) {
          itemsToDelete.push({
            key: folder.prefix,
            name: folder.name,
            isFolder: true
          });
        }
      });
    }
    
    // Agregar archivos seleccionados
    if (bucketContents?.files) {
      bucketContents.files.forEach(file => {
        if (selectedItems.has(file.key)) {
          itemsToDelete.push({
            key: file.key,
            name: file.name,
            isFolder: false
          });
        }
      });
    }
    
    setConfirmDelete({
      isOpen: true,
      items: itemsToDelete
    });
  };
  
  // Eliminar los elementos seleccionados
  const deleteSelectedItems = async () => {
    if (confirmDelete.items.length === 0) return;
    
    setIsDeleting(true);
    let hasErrors = false;
    
    try {
      // Eliminar cada elemento de forma secuencial
      for (const item of confirmDelete.items) {
        try {
          await deleteObject(item.key, item.isFolder);
        } catch (err) {
          console.error(`Error al eliminar ${item.isFolder ? 'carpeta' : 'archivo'} ${item.name}:`, err);
          hasErrors = true;
        }
      }
      
      // Cerrar diálogo y refrescar
      setConfirmDelete({ isOpen: false, items: [] });
      setSelectedItems(new Set());
      refreshContents();
    } catch (err) {
      console.error('Error al eliminar elementos:', err);
      hasErrors = true;
    } finally {
      setIsDeleting(false);
      if (hasErrors) {
        setError('Hubo errores al eliminar algunos elementos. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="app-card">
      {/* Header del explorador */}
      <div className="p-5 border-b border-solid border-[var(--app-border)] flex items-center justify-between bg-[var(--app-bg-light)]">
        <div className="flex items-center gap-3">
          <Cloud className="text-[var(--primary)] w-6 h-6" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-[var(--app-text-primary)]">
            R2Drive Explorer
          </h2>
          {loading && <Loader2 className="w-5 h-5 animate-spin ml-3" aria-hidden="true" />}
        </div>
        <div className="flex items-center gap-4">
          {selectedItems.size > 0 && (
            <button 
              className="app-button-danger flex items-center gap-2 py-2 px-4 text-sm"
              onClick={handleDeleteClick}
              title="Delete selected items"
              aria-label={`Eliminar ${selectedItems.size} elementos seleccionados`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Delete ({selectedItems.size})</span>
            </button>
          )}
          
          <button 
            className="navigation-button p-3 rounded-full"
            onClick={refreshContents}
            title="Refresh"
            aria-label="Actualizar contenido"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          </button>
          
          <button
            onClick={navigateToRoot}
            className="navigation-button flex items-center gap-2 py-2 px-3"
            aria-label="Navegar a la raíz"
          >
            <Home className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
            <span>Root</span>
          </button>
          
          <div className="flex border border-[var(--app-border)] rounded-md overflow-hidden ml-2" role="group" aria-label="Cambiar vista">
            <button 
              className={`p-3 ${viewMode === 'list' ? 'bg-[var(--app-surface-hover)]' : 'bg-transparent'} transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
              onClick={() => setViewMode('list')}
              title="List view"
              aria-label="Vista de lista"
              aria-pressed={viewMode === 'list'}
            >
              <i className="flex flex-col gap-1" aria-hidden="true">
                <span className="h-[2px] w-5 bg-current rounded-full"></span>
                <span className="h-[2px] w-5 bg-current rounded-full"></span>
                <span className="h-[2px] w-5 bg-current rounded-full"></span>
              </i>
            </button>
            <button 
              className={`p-3 ${viewMode === 'grid' ? 'bg-[var(--app-surface-hover)]' : 'bg-transparent'} transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
              aria-label="Vista de cuadrícula"
              aria-pressed={viewMode === 'grid'}
            >
              <i className="grid grid-cols-2 gap-1" aria-hidden="true">
                <span className="h-[7px] w-[7px] bg-current rounded-sm"></span>
                <span className="h-[7px] w-[7px] bg-current rounded-sm"></span>
                <span className="h-[7px] w-[7px] bg-current rounded-sm"></span>
                <span className="h-[7px] w-[7px] bg-current rounded-sm"></span>
              </i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Barra de navegación */}
      <div className="app-navigation px-5 py-4 bg-[var(--app-surface)] border-b border-solid border-[var(--app-border)]">
        <div className="app-navigation-path">
          {currentPrefix ? (
            <>
              <button
                onClick={navigateToRoot}
                className="navigation-button flex items-center gap-2 py-2 px-3"
                aria-label="Navegar a la raíz"
              >
                <Home className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
                <span>Root</span>
              </button>
              
              {currentPrefix.split('/').filter(Boolean).map((segment, index, array) => (
                <div key={index} className="flex items-center">
                  <span className="mx-2 text-[var(--app-text-disabled)]" aria-hidden="true">/</span>
                  <button
                    onClick={() => navigateToFolder(
                      array.slice(0, index + 1).join('/') + '/'
                    )}
                    className="navigation-button py-2 px-3"
                    aria-label={`Navegar a la carpeta ${segment}`}
                  >
                    {segment}
                  </button>
                </div>
              ))}
            </>
          ) : (
            <button className="navigation-button flex items-center gap-2 py-2 px-3" aria-current="location">
              <Home className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="text-[var(--primary)] font-medium">Root</span>
            </button>
          )}
        </div>
        
        <div className="ml-auto">
          {currentPrefix && (
            <button 
              className="navigation-button flex items-center gap-2 py-2 px-4 text-sm"
              onClick={navigateToParent}
              title="Go back to parent folder"
              aria-label="Volver a la carpeta superior"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div role="alert" className="mx-5 my-4 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[var(--error)] rounded-md">
          {error}
        </div>
      )}
      
      {loading && !bucketContents ? (
        <div className="p-16 flex justify-center">
          <div className="text-center">
            <Loader2 className="w-14 h-14 animate-spin text-[var(--primary)] mx-auto mb-6" aria-hidden="true" />
            <p className="text-lg text-[var(--app-text-secondary)]" aria-live="polite">Loading content...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Vista de lista */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="app-table" role="grid" aria-label="Contenido del bucket">
                <thead className="app-table-header">
                  <tr>
                    <th style={{ width: '50px' }} scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Size</th>
                    <th scope="col">Modified</th>
                    <th style={{ width: '70px' }} scope="col"></th>
                  </tr>
                </thead>
                <tbody className="app-table-body">
                  {/* Carpetas */}
                  {bucketContents?.folders && bucketContents.folders.map((folder) => (
                    <tr 
                      key={folder.prefix}
                      className={selectedItems.has(folder.prefix) ? 'bg-[rgba(37,99,235,0.05)]' : ''}
                    >
                      <td>
                        <button
                          className={`user-avatar p-2 rounded-full w-8 h-8 ${
                            selectedItems.has(folder.prefix) 
                              ? 'text-[var(--primary)]' 
                              : 'text-[var(--app-text-secondary)]'
                          } focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                          onClick={(e) => toggleItemSelection(folder.prefix, e)}
                          aria-label={selectedItems.has(folder.prefix) ? 'Deseleccionar carpeta' : 'Seleccionar carpeta'}
                          aria-pressed={selectedItems.has(folder.prefix)}
                        >
                          {selectedItems.has(folder.prefix) 
                            ? <Check className="w-4 h-4" aria-hidden="true" /> 
                            : <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                          }
                        </button>
                      </td>
                      <td>
                        <div 
                          className="app-table-file-name cursor-pointer"
                          onClick={() => navigateToFolder(folder.prefix)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Abrir carpeta ${folder.name}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigateToFolder(folder.prefix);
                            }
                          }}
                        >
                          <FolderOpen className="w-6 h-6 text-[var(--primary)] app-file-icon" aria-hidden="true" />
                          <span>{folder.name}/</span>
                        </div>
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <button 
                          className="navigation-button p-2 rounded-full w-8 h-8"
                          onClick={() => navigateToFolder(folder.prefix)}
                          title="Open folder"
                          aria-label={`Abrir carpeta ${folder.name}`}
                        >
                          <ChevronLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Archivos */}
                  {bucketContents?.files && bucketContents.files.map((file) => (
                    <tr 
                      key={file.key}
                      className={selectedItems.has(file.key) ? 'bg-[rgba(37,99,235,0.05)]' : ''}
                    >
                      <td>
                        <button
                          className={`user-avatar p-2 rounded-full w-8 h-8 ${
                            selectedItems.has(file.key) 
                              ? 'text-[var(--primary)]' 
                              : 'text-[var(--app-text-secondary)]'
                          } focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                          onClick={(e) => toggleItemSelection(file.key, e)}
                          aria-label={selectedItems.has(file.key) ? 'Deseleccionar archivo' : 'Seleccionar archivo'}
                          aria-pressed={selectedItems.has(file.key)}
                        >
                          {selectedItems.has(file.key) 
                            ? <Check className="w-4 h-4" aria-hidden="true" /> 
                            : <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                          }
                        </button>
                      </td>
                      <td>
                        <div className="app-table-file-name">
                          <File className="w-6 h-6 text-[var(--app-text-secondary)] app-file-icon" aria-hidden="true" />
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td>{formatFileSize(file.size)}</td>
                      <td>{formatDate(file.lastModified)}</td>
                      <td>
                        <button 
                          className="navigation-button p-2 rounded-full w-8 h-8"
                          title="Download file"
                          aria-label={`Descargar archivo ${file.name}`}
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Mensaje cuando no hay contenido */}
                  {(!bucketContents?.folders || bucketContents.folders.length === 0) && 
                   (!bucketContents?.files || bucketContents.files.length === 0) && (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="inline-block p-6 rounded-full bg-[var(--app-surface-hover)] mb-6">
                          <FolderOpen className="w-12 h-12 text-[var(--app-text-secondary)]" aria-hidden="true" />
                        </div>
                        <p className="text-lg text-[var(--app-text-secondary)] mb-4">No files or folders in this location</p>
                        {currentPrefix && (
                          <button 
                            className="app-button-primary mt-6"
                            onClick={() => onSelectFolder && onSelectFolder(currentPrefix)}
                            aria-label={`Usar esta carpeta para subidas (${currentPrefix})`}
                          >
                            Use this folder for uploads
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Vista de cuadrícula */}
          {viewMode === 'grid' && (
            <div className="p-5">
              <div className="app-grid" role="grid" aria-label="Contenido del bucket">
                {/* Carpetas */}
                {bucketContents?.folders && bucketContents.folders.map((folder) => (
                  <div 
                    key={folder.prefix}
                    className={`app-grid-item ${selectedItems.has(folder.prefix) ? 'ring-2 ring-[var(--primary)]' : ''}`}
                    role="gridcell"
                  >
                    <div 
                      className="p-4 flex flex-col items-center"
                      onClick={() => navigateToFolder(folder.prefix)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Abrir carpeta ${folder.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigateToFolder(folder.prefix);
                        }
                      }}
                    >
                      <div className="relative">
                        <FolderOpen className="w-20 h-20 text-[var(--primary)]" aria-hidden="true" />
                        <button
                          className={`absolute -top-2 -right-2 p-2 rounded-full shadow-sm user-avatar ${
                            selectedItems.has(folder.prefix) 
                              ? 'text-white' 
                              : 'text-[var(--app-text-secondary)]'
                          } transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItemSelection(folder.prefix, e);
                          }}
                          aria-label={selectedItems.has(folder.prefix) ? 'Deseleccionar carpeta' : 'Seleccionar carpeta'}
                          aria-pressed={selectedItems.has(folder.prefix)}
                        >
                          {selectedItems.has(folder.prefix) 
                            ? <Check className="w-4 h-4" aria-hidden="true" /> 
                            : <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                          }
                        </button>
                      </div>
                      <span className="mt-4 text-center truncate w-full">
                        {folder.name}/
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Archivos */}
                {bucketContents?.files && bucketContents.files.map((file) => (
                  <div 
                    key={file.key}
                    className={`app-grid-item ${selectedItems.has(file.key) ? 'ring-2 ring-[var(--primary)]' : ''}`}
                    role="gridcell"
                  >
                    <div className="p-4 flex flex-col items-center">
                      <div className="relative">
                        <File className="w-20 h-20 text-[var(--app-text-secondary)]" aria-hidden="true" />
                        <button
                          className={`absolute -top-2 -right-2 p-2 rounded-full shadow-sm user-avatar ${
                            selectedItems.has(file.key) 
                              ? 'text-white' 
                              : 'text-[var(--app-text-secondary)]'
                          } transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                          onClick={(e) => toggleItemSelection(file.key, e)}
                          aria-label={selectedItems.has(file.key) ? 'Deseleccionar archivo' : 'Seleccionar archivo'}
                          aria-pressed={selectedItems.has(file.key)}
                        >
                          {selectedItems.has(file.key) 
                            ? <Check className="w-4 h-4" aria-hidden="true" /> 
                            : <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                          }
                        </button>
                      </div>
                      <span className="mt-4 text-center truncate w-full">{file.name}</span>
                      <span className="text-xs text-[var(--app-text-secondary)] mt-2">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                ))}
                
                {/* Mensaje cuando no hay contenido */}
                {(!bucketContents?.folders || bucketContents.folders.length === 0) && 
                 (!bucketContents?.files || bucketContents.files.length === 0) && (
                  <div className="col-span-full p-16 text-center">
                    <div className="inline-block p-6 rounded-full bg-[var(--app-surface-hover)] mb-6">
                      <FolderOpen className="w-14 h-14 text-[var(--app-text-secondary)]" aria-hidden="true" />
                    </div>
                    <p className="text-lg text-[var(--app-text-secondary)] mb-4">No files or folders in this location</p>
                    {currentPrefix && (
                      <button 
                        className="app-button-primary mt-6"
                        onClick={() => onSelectFolder && onSelectFolder(currentPrefix)}
                        aria-label={`Usar esta carpeta para subidas (${currentPrefix})`}
                      >
                        Use this folder for uploads
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Diálogo de confirmación de eliminación */}
      <Dialog.Root 
        open={confirmDelete.isOpen} 
        onOpenChange={(open) => {
          if (!open) setConfirmDelete({ isOpen: false, items: [] });
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content 
            className="fixed p-0 rounded-xl shadow-2xl w-full max-w-md app-card" 
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="px-6 py-5 border-b border-[var(--app-border)] bg-[rgba(239,68,68,0.1)]">
              <Dialog.Title id="delete-dialog-title" className="text-lg font-semibold text-[var(--error)] flex items-center gap-3">
                <Trash2 className="w-5 h-5" aria-hidden="true" />
                Confirm Deletion
              </Dialog.Title>
            </div>
            <div className="p-8">
              <Dialog.Description id="delete-dialog-description" className="text-[var(--app-text-primary)] mb-8">
                Are you sure you want to delete {confirmDelete.items.length} item(s)? This action cannot be undone.
                
                <div className="mt-6 bg-[var(--app-surface)] rounded-lg p-5 max-h-48 overflow-y-auto">
                  <ul className="list-disc pl-6 space-y-2">
                    {confirmDelete.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        <span className={item.isFolder ? 'text-[var(--primary)]' : 'text-[var(--app-text-primary)]'}>
                          {item.name}{item.isFolder ? '/' : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Description>
              <div className="flex justify-end gap-4">
                <button
                  className="app-button-secondary flex items-center gap-3"
                  onClick={() => setConfirmDelete({ isOpen: false, items: [] })}
                  disabled={isDeleting}
                  aria-label="Cancelar eliminación"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
                <button
                  className="app-button-danger flex items-center gap-3"
                  onClick={deleteSelectedItems}
                  disabled={isDeleting}
                  aria-label={`Confirmar eliminación de ${confirmDelete.items.length} elementos`}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
} 