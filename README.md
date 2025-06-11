# R2Drive - File Manager for Cloudflare R2

[English](#english) | [Español](#español)

---

## Español

R2Drive es una aplicación web moderna que te permite gestionar archivos en Cloudflare R2 de manera fácil e intuitiva. Con una interfaz inspirada en MEGA, ofrece funcionalidades como:

- 📂 Exploración completa del bucket con vista de lista o cuadrícula
- 📤 Subida de archivos individuales o carpetas completas mediante arrastrar y soltar
- 🗂️ Organización en carpetas y subcarpetas
- ✏️ Renombrar carpetas
- 🗑️ Eliminación de archivos y carpetas
- 🔄 Actualizaciones de contenido en tiempo real

![Captura de R2Drive](https://ejemplo.com/screenshot.png)

### Requisitos

- Node.js 18 o superior
- Cuenta de Cloudflare con acceso a R2
- Bucket R2 creado en Cloudflare
- Git (para clonar el repositorio)

### Instalación

#### Para Windows (Instalación Completa desde Cero)

**Paso 1: Instalar Node.js**
1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Abre **Símbolo del sistema** o **PowerShell** y verifica la instalación:
   ```cmd
   node --version
   npm --version
   ```

**Paso 2: Instalar Git**
1. Ve a [git-scm.com](https://git-scm.com/download/win)
2. Descarga Git para Windows
3. Ejecuta el instalador con las opciones predeterminadas
4. Verifica la instalación:
   ```cmd
   git --version
   ```

**Paso 3: Clonar e Instalar R2Drive**
1. Abre **Símbolo del sistema** o **PowerShell**
2. Navega a la carpeta donde quieres instalar el proyecto:
   ```cmd
   cd C:\Users\TuUsuario\Desktop
   ```
3. Clona el repositorio:
   ```cmd
   git clone https://github.com/falgom4/R2Drive.git
   cd R2Drive
   ```
4. Instala las dependencias:
   ```cmd
   npm install
   ```
5. Inicia la aplicación:
   ```cmd
   npm run dev
   ```
6. Abre tu navegador y ve a http://localhost:3000

#### Para macOS/Linux

1. Clona este repositorio:
   ```bash
   git clone https://github.com/falgom4/R2Drive.git
   cd R2Drive
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura tus credenciales de Cloudflare R2:
   
   **Opción 1: Vía Interfaz Web (Recomendado)**
   - Inicia la aplicación con `npm run dev`
   - Abre http://localhost:3000
   - El modal de configuración aparecerá automáticamente
   - Ingresa tus credenciales R2 en el formulario
   
   **Opción 2: Vía archivo .env.local**
   ```
   R2_ACCOUNT_ID=tu_account_id
   R2_ACCESS_KEY_ID=tu_access_key_id
   R2_SECRET_ACCESS_KEY=tu_secret_access_key
   R2_BUCKET_NAME=nombre_de_tu_bucket
   R2_PUBLIC_URL=url_publica_de_tu_bucket (opcional)
   ```

4. Abre http://localhost:3000 en tu navegador y configura tus credenciales a través de la interfaz

### Configuración de Credenciales de Cloudflare R2

Para configurar correctamente R2Drive con tu cuenta de Cloudflare R2, sigue estos pasos:

#### 1. Obtener Credenciales R2

1. Inicia sesión en el [Panel de Cloudflare](https://dash.cloudflare.com)
2. Selecciona tu cuenta
3. En el menú lateral, ve a **R2**
4. Si no tienes un bucket aún, crea uno con el botón **Create bucket**
5. Para obtener credenciales, ve a la pestaña **Manage R2 API Tokens**
6. Haz clic en **Create new token** y selecciona **R2 API Key Token**
7. Asigna un nombre al token (por ejemplo, "R2Drive Access")
8. Selecciona los permisos necesarios (recomendado: lectura y escritura)
9. Haz clic en **Create API token**
10. Guarda el **Access Key ID** y **Secret Access Key** mostrados (esta será la única vez que puedas ver la Secret Key)

#### 2. Configurar Credenciales en R2Drive

**Método 1: Interfaz Web (Recomendado)**
1. Inicia la aplicación con `npm run dev`
2. Abre http://localhost:3000 en tu navegador
3. El modal de configuración aparecerá automáticamente si no se detectan credenciales
4. O haz clic en el **botón de configuración (⚙️)** en la esquina superior derecha y selecciona **"Configure credentials"**
5. Completa el formulario con tus credenciales R2:
   - **Account ID**: Tu ID de cuenta de Cloudflare (visible en la URL del panel)
   - **Access Key ID**: El Access Key ID generado en el paso anterior
   - **Secret Access Key**: El Secret Access Key generado en el paso anterior
   - **Bucket Name**: El nombre del bucket R2 que quieres gestionar
   - **Public URL**: (Opcional) Si has configurado un dominio personalizado para tu bucket
6. Haz clic en **Guardar** - la conexión se verificará automáticamente

**Método 2: Archivo .env.local**
Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key_id
R2_SECRET_ACCESS_KEY=tu_secret_access_key
R2_BUCKET_NAME=nombre_de_tu_bucket
R2_PUBLIC_URL=url_publica_de_tu_bucket (opcional)
```

**Nota**: Las variables de entorno usan el prefijo `R2_`, no `CLOUDFLARE_` como se muestra en versiones anteriores.

### Uso de la Aplicación

#### Configuración Inicial
1. Configura tus credenciales R2 usando la interfaz web (ver sección de configuración arriba)
2. El estado de conexión se mostrará con una insignia verde "Connected to bucket"

#### Gestión de Archivos
1. **Ver Archivos**: Haz clic en **Show bucket explorer** para ver el contenido actual
2. **Navegar**: Haz clic en las carpetas para entrar en ellas, usa la navegación de migas de pan para retroceder
3. **Subir Archivos**:
   - Arrastra archivos o carpetas completas al área de soltar designada
   - O haz clic en **Browse files** para seleccionar archivos manualmente
   - Los archivos se subirán a la carpeta actualmente seleccionada
   - Se muestra el seguimiento del progreso en tiempo real
4. **Renombrar Carpetas**:
   - Haz clic en el botón de edición (✏️) junto al nombre de la carpeta
   - Ingresa el nuevo nombre en el modal que aparece
   - Confirma el cambio
5. **Eliminar Archivos**:
   - Selecciona elementos haciendo clic en el icono junto a cada uno
   - Haz clic en el botón **Delete** que aparece en la barra superior
   - Confirma la eliminación en el diálogo

#### Configuraciones
- **Cambio de Tema**: Alterna entre modos claro y oscuro
- **Actualizar Conexión**: Verifica manualmente la conexión del bucket
- **Reconfigurar Credenciales**: Actualiza tu configuración R2 en cualquier momento

### Características Avanzadas

- **Vista Lista/Cuadrícula**: Alterna entre diferentes modos de visualización con los botones en la esquina superior derecha
- **Navegación de Rutas**: La barra de navegación muestra la ruta actual y te permite volver rápidamente a cualquier nivel
- **Selección Múltiple**: Puedes seleccionar múltiples archivos y carpetas para eliminarlos de una vez
- **Información Detallada**: En vista de lista, se muestra información como tamaño y fecha de modificación

### Desarrollo

Si quieres contribuir al proyecto o personalizarlo:

```bash
# Modo de desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar versión de producción
npm start

# Ejecutar linter
npm run lint
```

### Despliegue

Esta aplicación puede ser desplegada en cualquier plataforma que soporte Next.js, como Vercel, Netlify, o tu propio servidor.

```bash
npm run build
npm start
```

### Soporte

Si encuentras algún problema o tienes alguna pregunta, por favor crea un issue en el repositorio de GitHub.

### Licencia

Este proyecto está licenciado bajo la licencia MIT - consulta el archivo LICENSE para más detalles.

---

## English

R2Drive is a modern web application that allows you to easily and intuitively manage files in Cloudflare R2. With an interface inspired by MEGA, it offers functionalities such as:

- 📂 Complete bucket exploration with list or grid view
- 📤 Upload individual files or entire folders via drag & drop
- 🗂️ Organization in folders and subfolders
- ✏️ Rename folders
- 🗑️ Deletion of files and folders
- 🔄 Real-time content updates

![R2Drive Screenshot](https://ejemplo.com/screenshot.png)

## Requirements

- Node.js 18 or higher
- Cloudflare account with R2 access
- R2 bucket created in Cloudflare

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/falgom4/R2Drive.git
   cd R2Drive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Cloudflare R2 credentials:
   
   **Option 1: Via Web Interface (Recommended)**
   - Start the application with `npm run dev`
   - Open http://localhost:3000
   - The configuration modal will appear automatically
   - Enter your R2 credentials in the form
   
   **Option 2: Via .env.local file**
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=your_bucket_public_url (optional)
   ```

4. Open http://localhost:3000 in your browser and configure your credentials through the interface

## Cloudflare R2 Credentials Configuration

To correctly configure R2Drive with your Cloudflare R2 account, follow these steps:

### 1. Obtain R2 Credentials

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. In the sidebar menu, go to **R2**
4. If you don't have a bucket yet, create one with the **Create bucket** button
5. To get credentials, go to the **Manage R2 API Tokens** tab
6. Click on **Create new token** and select **R2 API Key Token**
7. Assign a name to the token (for example, "R2Drive Access")
8. Select the necessary permissions (recommended: read and write)
9. Click on **Create API token**
10. Save the **Access Key ID** and **Secret Access Key** shown (this will be the only time you can see the Secret Key)

### 2. Configure Credentials in R2Drive

**Method 1: Web Interface (Recommended)**
1. Start the application with `npm run dev`
2. Open http://localhost:3000 in your browser
3. The configuration modal will appear automatically if no credentials are detected
4. Or click the **Settings button (⚙️)** in the top right corner and select **"Configure credentials"**
5. Fill in the form with your R2 credentials:
   - **Account ID**: Your Cloudflare account ID (visible in the dashboard URL)
   - **Access Key ID**: The Access Key ID generated in the previous step
   - **Secret Access Key**: The Secret Access Key generated in the previous step
   - **Bucket Name**: The name of the R2 bucket you want to manage
   - **Public URL**: (Optional) If you've configured a custom domain for your bucket
6. Click **Save** - the connection will be verified automatically

**Method 2: .env.local file**
Create a `.env.local` file in the project root with the following content:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_bucket_public_url (optional)
```

**Note**: The environment variables use `R2_` prefix, not `CLOUDFLARE_` as shown in older versions.

## Using the Application

### Initial Setup
1. Configure your R2 credentials using the web interface (see configuration section above)
2. The connection status will be shown with a green "Connected to bucket" badge

### File Management
1. **View Files**: Click on **Show bucket explorer** to see the current contents
2. **Navigate**: Click on folders to enter them, use the breadcrumb navigation to go back
3. **Upload Files**:
   - Drag files or entire folders to the designated drop area
   - Or click **Browse files** to select files manually
   - Files will be uploaded to the currently selected folder
   - Real-time progress tracking is displayed
4. **Delete Files**:
   - Select items by clicking on the icon next to each one
   - Click on the **Delete** button that appears in the top bar
   - Confirm deletion in the dialog

### Settings
- **Theme Toggle**: Switch between light and dark modes
- **Refresh Connection**: Manually verify bucket connection
- **Reconfigure Credentials**: Update your R2 settings anytime

## Advanced Features

- **List/Grid View**: Switch between different viewing modes with the buttons in the top right corner
- **Path Navigation**: The navigation bar shows the current path and allows you to quickly return to any level
- **Multiple Selection**: You can select multiple files and folders to delete them at once
- **Detailed Information**: In list view, information such as size and modification date is displayed

## Development

If you want to contribute to the project or customize it:

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production version
npm start

# Run linter
npm run lint
```

## Deployment

This application can be deployed on any platform that supports Next.js, such as Vercel, Netlify, or your own server.

```bash
npm run build
npm start
```

## Support

If you find any issues or have any questions, please create an issue in the GitHub repository.

## License

This project is licensed under the MIT license - see the LICENSE file for more details.

---

