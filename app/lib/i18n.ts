// Internationalization system for R2Drive
export type Language = 'en' | 'es';

export interface Translations {
  // Header
  appName: string;
  settings: string;
  
  // Theme
  lightMode: string;
  darkMode: string;
  
  // Language
  language: string;
  english: string;
  spanish: string;
  
  // Connection Status
  connecting: string;
  connected: string;
  disconnected: string;
  
  // Settings Menu
  configureCredentials: string;
  refreshConnection: string;
  logout: string;
  
  // Main Content
  welcomeTitle: string;
  welcomeSubtitle: string;
  showBucketExplorer: string;
  uploadFiles: string;
  browseFiles: string;
  
  // Upload
  dropZoneTitle: string;
  dropZoneSubtitle: string;
  dragDropText: string;
  orText: string;
  uploadProgress: string;
  uploadComplete: string;
  uploadError: string;
  uploadingFiles: string;
  
  // Bucket Explorer
  bucketExplorer: string;
  newFolder: string;
  delete: string;
  rename: string;
  refresh: string;
  root: string;
  back: string;
  listView: string;
  gridView: string;
  openFolder: string;
  downloadFile: string;
  noContent: string;
  noContentDescription: string;
  useFolderForUploads: string;
  
  // Dialogs
  confirmDeletion: string;
  confirmDeletionDescription: string;
  cancel: string;
  deleting: string;
  createNewFolder: string;
  folderName: string;
  enterFolderName: string;
  creating: string;
  create: string;
  renameFolder: string;
  renamingFolder: string;
  newFolderName: string;
  enterNewFolderName: string;
  renaming: string;
  
  // Configuration
  configureR2Credentials: string;
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
  publicUrlOptional: string;
  save: string;
  saving: string;
  testConnection: string;
  testing: string;
  
  // Errors
  error: string;
  tryAgain: string;
  connectionError: string;
  configurationError: string;
  uploadFailed: string;
  deleteFailed: string;
  renameFailed: string;
  
  // Footer
  designedWith: string;
  
  // File types and sizes
  bytes: string;
  kb: string;
  mb: string;
  gb: string;
  tb: string;
  
  // Actions
  open: string;
  close: string;
  yes: string;
  no: string;
  loading: string;
  success: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appName: 'R2Drive',
    settings: 'Settings',
    
    // Theme
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    
    // Language
    language: 'Language',
    english: 'English',
    spanish: 'Español',
    
    // Connection Status
    connecting: 'Connecting...',
    connected: 'Connected to bucket',
    disconnected: 'Not connected',
    
    // Settings Menu
    configureCredentials: 'Configure credentials',
    refreshConnection: 'Refresh connection',
    logout: 'Clear credentials',
    
    // Main Content
    welcomeTitle: 'Welcome to R2Drive',
    welcomeSubtitle: 'Your modern file manager for Cloudflare R2',
    showBucketExplorer: 'Show bucket explorer',
    uploadFiles: 'Upload files',
    browseFiles: 'Browse files',
    
    // Upload
    dropZoneTitle: 'Drop files here',
    dropZoneSubtitle: 'or click to browse',
    dragDropText: 'Drag and drop files or folders here',
    orText: 'or',
    uploadProgress: 'Upload progress',
    uploadComplete: 'Upload complete',
    uploadError: 'Upload error',
    uploadingFiles: 'Uploading files...',
    
    // Bucket Explorer
    bucketExplorer: 'R2Drive Explorer',
    newFolder: 'New Folder',
    delete: 'Delete',
    rename: 'Rename',
    refresh: 'Refresh',
    root: 'Root',
    back: 'Back',
    listView: 'List view',
    gridView: 'Grid view',
    openFolder: 'Open folder',
    downloadFile: 'Download file',
    noContent: 'No files or folders in this location',
    noContentDescription: 'This folder is empty',
    useFolderForUploads: 'Use this folder for uploads',
    
    // Dialogs
    confirmDeletion: 'Confirm Deletion',
    confirmDeletionDescription: 'Are you sure you want to delete this item? This action cannot be undone.',
    cancel: 'Cancel',
    deleting: 'Deleting...',
    createNewFolder: 'Create New Folder',
    folderName: 'Folder name',
    enterFolderName: 'Enter folder name',
    creating: 'Creating...',
    create: 'Create',
    renameFolder: 'Rename Folder',
    renamingFolder: 'Renaming folder',
    newFolderName: 'New folder name',
    enterNewFolderName: 'Enter new folder name',
    renaming: 'Renaming...',
    
    // Configuration
    configureR2Credentials: 'Configure R2 Credentials',
    accountId: 'Account ID',
    accessKeyId: 'Access Key ID',
    secretAccessKey: 'Secret Access Key',
    bucketName: 'Bucket Name',
    publicUrl: 'Public URL',
    publicUrlOptional: 'Public URL (optional)',
    save: 'Save',
    saving: 'Saving...',
    testConnection: 'Test connection',
    testing: 'Testing...',
    
    // Errors
    error: 'Error',
    tryAgain: 'Try again',
    connectionError: 'Connection error',
    configurationError: 'Configuration error',
    uploadFailed: 'Upload failed',
    deleteFailed: 'Delete failed',
    renameFailed: 'Rename failed',
    
    // Footer
    designedWith: 'Designed with',
    
    // File types and sizes
    bytes: 'Bytes',
    kb: 'KB',
    mb: 'MB',
    gb: 'GB',
    tb: 'TB',
    
    // Actions
    open: 'Open',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    success: 'Success',
  },
  es: {
    // Header
    appName: 'R2Drive',
    settings: 'Configuración',
    
    // Theme
    lightMode: 'Modo claro',
    darkMode: 'Modo oscuro',
    
    // Language
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
    
    // Connection Status
    connecting: 'Conectando...',
    connected: 'Conectado al bucket',
    disconnected: 'No conectado',
    
    // Settings Menu
    configureCredentials: 'Configurar credenciales',
    refreshConnection: 'Actualizar conexión',
    logout: 'Limpiar credenciales',
    
    // Main Content
    welcomeTitle: 'Bienvenido a R2Drive',
    welcomeSubtitle: 'Tu gestor de archivos moderno para Cloudflare R2',
    showBucketExplorer: 'Mostrar explorador de bucket',
    uploadFiles: 'Subir archivos',
    browseFiles: 'Explorar archivos',
    
    // Upload
    dropZoneTitle: 'Suelta archivos aquí',
    dropZoneSubtitle: 'o haz clic para explorar',
    dragDropText: 'Arrastra y suelta archivos o carpetas aquí',
    orText: 'o',
    uploadProgress: 'Progreso de subida',
    uploadComplete: 'Subida completa',
    uploadError: 'Error de subida',
    uploadingFiles: 'Subiendo archivos...',
    
    // Bucket Explorer
    bucketExplorer: 'Explorador R2Drive',
    newFolder: 'Nueva Carpeta',
    delete: 'Eliminar',
    rename: 'Renombrar',
    refresh: 'Actualizar',
    root: 'Raíz',
    back: 'Atrás',
    listView: 'Vista de lista',
    gridView: 'Vista de cuadrícula',
    openFolder: 'Abrir carpeta',
    downloadFile: 'Descargar archivo',
    noContent: 'No hay archivos o carpetas en esta ubicación',
    noContentDescription: 'Esta carpeta está vacía',
    useFolderForUploads: 'Usar esta carpeta para subidas',
    
    // Dialogs
    confirmDeletion: 'Confirmar Eliminación',
    confirmDeletionDescription: '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.',
    cancel: 'Cancelar',
    deleting: 'Eliminando...',
    createNewFolder: 'Crear Nueva Carpeta',
    folderName: 'Nombre de carpeta',
    enterFolderName: 'Ingresa el nombre de la carpeta',
    creating: 'Creando...',
    create: 'Crear',
    renameFolder: 'Renombrar Carpeta',
    renamingFolder: 'Renombrando carpeta',
    newFolderName: 'Nuevo nombre de carpeta',
    enterNewFolderName: 'Ingresa el nuevo nombre de carpeta',
    renaming: 'Renombrando...',
    
    // Configuration
    configureR2Credentials: 'Configurar Credenciales R2',
    accountId: 'ID de Cuenta',
    accessKeyId: 'ID de Clave de Acceso',
    secretAccessKey: 'Clave de Acceso Secreta',
    bucketName: 'Nombre del Bucket',
    publicUrl: 'URL Pública',
    publicUrlOptional: 'URL Pública (opcional)',
    save: 'Guardar',
    saving: 'Guardando...',
    testConnection: 'Probar conexión',
    testing: 'Probando...',
    
    // Errors
    error: 'Error',
    tryAgain: 'Intentar de nuevo',
    connectionError: 'Error de conexión',
    configurationError: 'Error de configuración',
    uploadFailed: 'Fallo en la subida',
    deleteFailed: 'Fallo en la eliminación',
    renameFailed: 'Fallo en el renombrado',
    
    // Footer
    designedWith: 'Diseñado con',
    
    // File types and sizes
    bytes: 'Bytes',
    kb: 'KB',
    mb: 'MB',
    gb: 'GB',
    tb: 'TB',
    
    // Actions
    open: 'Abrir',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No',
    loading: 'Cargando...',
    success: 'Éxito',
  },
};

export function getTranslation(language: Language, key: keyof Translations): string {
  return translations[language][key];
}

export function getTranslations(language: Language): Translations {
  return translations[language];
}