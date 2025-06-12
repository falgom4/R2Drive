# R2Drive - NPM Installation

[![npm version](https://badge.fury.io/js/r2drive.svg)](https://badge.fury.io/js/r2drive)
[![Downloads](https://img.shields.io/npm/dt/r2drive.svg)](https://npmjs.org/package/r2drive)

## Quick Install

```bash
# Install globally
npm install -g r2drive

# Run R2Drive
r2drive
```

## Usage Options

### 🖥️ Desktop App (Recommended)
```bash
r2drive
```
Opens the download page for the native desktop application. This provides the best performance and user experience.

### 🌐 Web App
```bash
r2drive --web
```
Starts R2Drive as a web application at `http://localhost:3000`. Perfect for remote access or if you prefer browser-based usage.

### 🔧 Development Mode
```bash
r2drive --dev
```
Starts the development server with hot reload for contributors.

## Platform Support

| Platform | Command | Download |
|----------|---------|----------|
| 🍎 **macOS** | `r2drive` | Downloads .dmg installer |
| 🪟 **Windows** | `r2drive` | Downloads .msi installer |
| 🐧 **Linux** | `r2drive` | Downloads .AppImage |
| 🌐 **Any** | `r2drive --web` | Runs in browser |

## Features

- 📂 **Complete R2 bucket management** with intuitive interface
- 📤 **Drag & drop file uploads** (individual files and entire folders)
- 🗂️ **Folder organization** with create, rename, and delete operations
- 🔄 **Real-time progress tracking** for uploads and operations
- 🌓 **Dark/Light theme** with preference persistence
- 🔒 **Secure credential management** via web interface
- 🌍 **Internationalization** (English/Spanish)
- 📱 **Responsive design** that works on any screen size

## Configuration

R2Drive connects to your Cloudflare R2 storage. You'll need:

- **Account ID**: Your Cloudflare account identifier
- **Access Key ID**: R2 API token access key
- **Secret Access Key**: R2 API token secret
- **Bucket Name**: The R2 bucket you want to manage
- **Public URL** (optional): Custom domain for your bucket

### Getting R2 Credentials

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **R2** section
3. Navigate to **Manage R2 API Tokens**
4. Create a new **R2 API Key Token**
5. Save the Access Key ID and Secret Access Key

## First Run

After installation, R2Drive will guide you through:

1. **Platform Detection**: Automatically detects your OS
2. **Download**: Opens the appropriate installer for your platform
3. **Configuration**: Setup wizard for R2 credentials
4. **Ready**: Start managing your R2 storage!

## Web App Mode

If you prefer running R2Drive in your browser:

```bash
# Start web server
r2drive --web

# Open http://localhost:3000
# Configure your R2 credentials
# Start managing files!
```

## Troubleshooting

### Command not found
If `r2drive` command is not recognized:

```bash
# Reinstall globally
npm uninstall -g r2drive
npm install -g r2drive

# On Windows, restart your terminal
```

### Web app won't start
```bash
# Check if port 3000 is available
npx kill-port 3000

# Start again
r2drive --web
```

### Need different port
```bash
# Set custom port
PORT=8080 r2drive --web
```

## Links

- 📚 **Documentation**: [GitHub Repository](https://github.com/falgom4/R2Drive)
- 🐛 **Issues**: [Report bugs](https://github.com/falgom4/R2Drive/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/falgom4/R2Drive/discussions)
- ⭐ **Star us**: Help others discover R2Drive!

## Requirements

- **Node.js**: 18.0.0 or higher
- **Cloudflare R2**: Account with API access
- **Modern browser**: For web app mode

## License

MIT License - see [LICENSE](https://github.com/falgom4/R2Drive/blob/main/LICENSE) file.

---

**Made with ❤️ by [falgom4](https://github.com/falgom4)**