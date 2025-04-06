# R2DToo - Gestor de Archivos para Cloudflare R2

R2DToo es una aplicación web moderna que permite gestionar archivos en Cloudflare R2 de manera fácil e intuitiva. Con una interfaz inspirada en MEGA, ofrece funcionalidades como:

- 📂 Exploración completa del bucket con vista de lista o cuadrícula
- 📤 Subida de archivos individuales o carpetas completas mediante drag & drop
- 🗂️ Organización en carpetas y subcarpetas
- 🗑️ Eliminación de archivos y carpetas
- 🔄 Actualización en tiempo real del contenido

![R2DToo Screenshot](https://ejemplo.com/screenshot.png)

## Requisitos

- Node.js 18 o superior
- Cuenta en Cloudflare con acceso a R2
- Bucket R2 creado en Cloudflare

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/falgom4/R2DToo.git
   cd R2DToo
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` con tus credenciales de Cloudflare R2:
   ```
   CLOUDFLARE_ACCOUNT_ID=tu_account_id
   CLOUDFLARE_ACCESS_KEY_ID=tu_access_key_id
   CLOUDFLARE_SECRET_ACCESS_KEY=tu_secret_access_key
   CLOUDFLARE_R2_BUCKET=nombre_de_tu_bucket
   CLOUDFLARE_R2_PUBLIC_URL=url_publica_de_tu_bucket (opcional)
   ```

4. Inicia la aplicación:
   ```bash
   npm run dev
   ```

5. Abre http://localhost:3000 en tu navegador

## Configuración de Credenciales de Cloudflare R2

Para configurar correctamente R2DToo con tu cuenta de Cloudflare R2, sigue estos pasos:

### 1. Obtener las Credenciales de R2

1. Inicia sesión en el [Dashboard de Cloudflare](https://dash.cloudflare.com)
2. Selecciona tu cuenta (falgom4)
3. En el menú lateral, ve a **R2**
4. Si aún no tienes un bucket, crea uno con el botón **Create bucket**
5. Para obtener las credenciales, ve a la pestaña **Administrar R2 API Tokens**
6. Haz clic en **Crear nuevo token** y selecciona **Token de clave de API de R2**
7. Asigna un nombre al token (por ejemplo, "R2DToo Access")
8. Selecciona los permisos necesarios (recomendado: lectura y escritura)
9. Haz clic en **Crear token de API**
10. Guarda el **Access Key ID** y **Secret Access Key** mostrados (esta será la única vez que puedas ver la Secret Key)

### 2. Configurar el archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
CLOUDFLARE_ACCOUNT_ID=tu_account_id
CLOUDFLARE_ACCESS_KEY_ID=tu_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=tu_secret_access_key
CLOUDFLARE_R2_BUCKET=nombre_de_tu_bucket
CLOUDFLARE_R2_PUBLIC_URL=url_publica_de_tu_bucket (opcional)
```

Donde:
- `CLOUDFLARE_ACCOUNT_ID`: Tu ID de cuenta de Cloudflare (visible en la URL del dashboard)
- `CLOUDFLARE_ACCESS_KEY_ID`: El Access Key ID generado en el paso anterior
- `CLOUDFLARE_SECRET_ACCESS_KEY`: El Secret Access Key generado en el paso anterior
- `CLOUDFLARE_R2_BUCKET`: El nombre del bucket R2 que deseas gestionar
- `CLOUDFLARE_R2_PUBLIC_URL`: (Opcional) Si has configurado un dominio personalizado para tu bucket

## Uso de la Aplicación

1. Al iniciar la aplicación, verás la pantalla principal con un área de "drag & drop"
2. Haz clic en **Mostrar explorador de bucket** para ver los contenidos actuales
3. Puedes navegar por las carpetas haciendo clic en ellas
4. Para subir archivos:
   - Arrastra archivos o carpetas al área designada
   - Los archivos se subirán a la carpeta actualmente seleccionada
   - Verás el progreso en tiempo real
5. Para eliminar archivos o carpetas:
   - Selecciona los elementos haciendo clic en el icono al lado de cada uno
   - Haz clic en el botón **Eliminar** que aparece en la barra superior
   - Confirma la eliminación en el diálogo

## Características Avanzadas

- **Vista de Lista/Cuadrícula**: Cambia entre diferentes modos de visualización con los botones en la esquina superior derecha
- **Navegación por Rutas**: La barra de navegación muestra la ruta actual y permite volver rápidamente a cualquier nivel
- **Selección Múltiple**: Puedes seleccionar varios archivos y carpetas para eliminarlos a la vez
- **Información Detallada**: En la vista de lista se muestra información como tamaño y fecha de modificación

## Desarrollo

Si deseas contribuir al proyecto o personalizarlo:

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar versión de producción
npm start

# Ejecutar linter
npm run lint
```

## Despliegue

Esta aplicación puede desplegarse en cualquier plataforma que soporte Next.js, como Vercel, Netlify o tu propio servidor.

```bash
npm run build
npm start
```

## Soporte

Si encuentras algún problema o tienes alguna pregunta, por favor crea un issue en el repositorio de GitHub.

## Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo LICENSE para más detalles.

---

Desarrollado por falgom4
