import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Comentamos output: 'export' para permitir API routes en desarrollo
  // Para build de producción con Tauri, usar: npm run build:static
  // output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
