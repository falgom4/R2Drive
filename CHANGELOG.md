# Changelog

Todos los cambios notables de R2Drive se documentarán en este archivo.

## [0.1.0] - 2024-12-06

### ✨ Características Iniciales

#### 🎯 Gestión de Archivos
- **Explorador de bucket completo** con vista de lista y cuadrícula
- **Subida de archivos** individual y por lotes con drag & drop
- **Subida de carpetas completas** manteniendo estructura
- **Navegación intuitiva** con breadcrumbs
- **Eliminación de archivos y carpetas** con confirmación
- **Renombrado de carpetas** integrado

#### 🔧 Configuración
- **Configuración via interfaz web** para credenciales R2
- **Verificación automática de conexión** al bucket
- **Soporte para URLs públicas personalizadas**
- **Persistencia de configuración** local

#### 🎨 Interfaz de Usuario
- **Tema claro y oscuro** con persistencia
- **Interfaz responsive** adaptable a diferentes tamaños
- **Indicadores de progreso** en tiempo real para uploads
- **Internacionalización** (Español/Inglés)
- **Iconografía moderna** con Lucide React

#### 🏗️ Arquitectura Técnica
- **Next.js 15** con App Router y React 19
- **Arquitectura server-side** para seguridad de credenciales
- **AWS SDK v3** para compatibilidad S3 con Cloudflare R2
- **TypeScript** para type safety
- **Tailwind CSS v4** para styling moderno

#### 📱 Aplicación Desktop
- **Aplicación nativa** con Tauri 2.5
- **Soporte multiplataforma** (macOS, Windows, Linux)
- **Builds automáticos** con GitHub Actions
- **Instaladores nativos** (.dmg, .msi, .AppImage)

### 🛠️ Configuración Requerida

#### Variables de Entorno
```env
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key_id
R2_SECRET_ACCESS_KEY=tu_secret_access_key
R2_BUCKET_NAME=nombre_bucket
R2_PUBLIC_URL=url_publica_opcional
```

#### Comandos de Desarrollo
```bash
npm run dev          # Desarrollo web
npm run tauri:dev    # Desarrollo desktop
npm run build        # Build web
npm run tauri:build  # Build desktop
```

### 📦 Distribución
- **Instaladores automáticos** para todas las plataformas
- **GitHub Releases** con assets adjuntos
- **Versionado semántico** automático
- **CI/CD** con tests multiplataforma