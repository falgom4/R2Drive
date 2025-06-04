# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Setup

The application requires a `.env.local` file with Cloudflare R2 credentials:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_bucket_public_url (optional)
```

Note: Environment variables use `R2_` prefix, not `CLOUDFLARE_` as shown in README.

## Architecture Overview

**Tech Stack:**
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS v4
- AWS SDK v3 for S3-compatible operations with Cloudflare R2
- Radix UI for accessible components

**Key Patterns:**

1. **Server-Only R2 Operations**: All R2 credentials and SDK operations are handled server-side in `/app/lib/r2-server.ts`. Client-side `/app/lib/r2.ts` is deprecated.

2. **API Route Structure**: 
   - `/api/r2/*` - R2 bucket operations (list, upload, delete, verify)
   - `/api/config/*` - Configuration management and validation

3. **Client-Server Communication**: Frontend uses fetch to communicate with API routes, never directly with R2. This ensures credentials stay server-side.

4. **File Upload Architecture**: 
   - `uploadFile()` - Single file upload with progress tracking
   - `uploadDirectory()` - Recursive directory upload via FileSystem API
   - All uploads go through `/api/r2/upload` endpoint

5. **State Management**: React state with hooks, no external state library. Theme persistence in localStorage.

## Key Components

- `app/page.tsx` - Main application with drag & drop, upload progress, and theme switching
- `app/components/BucketExplorer.tsx` - File/folder navigation with list/grid views
- `app/components/ConfigurationModal.tsx` - R2 credentials configuration UI
- `app/lib/upload.ts` - Client-side upload utilities and API communication
- `app/lib/r2-server.ts` - Server-side R2 client configuration

## Development Notes

- The app uses CSS custom properties for theming (dark/light mode)
- File uploads support both individual files and entire directory structures
- All R2 operations use S3-compatible API through AWS SDK v3
- Spanish language is used in some UI text and error messages
- Git commits show the project uses Spanish commit messages