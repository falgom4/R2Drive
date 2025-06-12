#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 R2Drive - Modern File Manager for Cloudflare R2');
console.log('================================================\n');

const platform = os.platform();
const arch = os.arch();

function detectPlatform() {
  if (platform === 'darwin') {
    return arch === 'arm64' ? 'macos-aarch64' : 'macos-x64';
  } else if (platform === 'win32') {
    return 'windows-x64';
  } else if (platform === 'linux') {
    return 'linux-x64';
  } else {
    throw new Error(`Unsupported platform: ${platform}-${arch}`);
  }
}

function getDownloadUrl(version = '0.1.0') {
  const platformKey = detectPlatform();
  const baseUrl = 'https://github.com/falgom4/R2Drive/releases/download';
  
  const urls = {
    'macos-aarch64': `${baseUrl}/v${version}/R2Drive_${version}_aarch64.dmg`,
    'macos-x64': `${baseUrl}/v${version}/R2Drive_${version}_x86_64.dmg`,
    'windows-x64': `${baseUrl}/v${version}/R2Drive_${version}_x64_en-US.msi`,
    'linux-x64': `${baseUrl}/v${version}/r2drive_${version}_amd64.AppImage`
  };
  
  return urls[platformKey];
}

function openBrowser(url) {
  const command = platform === 'darwin' ? 'open' : 
                 platform === 'win32' ? 'start' : 'xdg-open';
  
  try {
    execSync(`${command} "${url}"`, { stdio: 'ignore' });
  } catch (error) {
    console.log(`Please open this URL manually: ${url}`);
  }
}

async function main() {
  try {
    const platformKey = detectPlatform();
    console.log(`✅ Platform detected: ${platformKey}`);
    
    // Check if running in development mode
    if (process.argv.includes('--dev')) {
      console.log('🔧 Starting development server...');
      const devProcess = spawn('npm', ['run', 'dev'], { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      
      devProcess.on('exit', (code) => {
        process.exit(code);
      });
      return;
    }
    
    // Check if running as web server
    if (process.argv.includes('--web')) {
      console.log('🌐 Starting web server...');
      const webProcess = spawn('npm', ['run', 'start'], { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      
      webProcess.on('exit', (code) => {
        process.exit(code);
      });
      return;
    }
    
    console.log('📦 R2Drive needs to be downloaded for your platform.');
    console.log('This is a one-time setup process.\n');
    
    const downloadUrl = getDownloadUrl();
    console.log(`🔗 Download URL: ${downloadUrl}`);
    console.log('\n📱 Opening download page in your browser...');
    
    // Open GitHub releases page
    const releasesUrl = 'https://github.com/falgom4/R2Drive/releases/latest';
    openBrowser(releasesUrl);
    
    console.log('\n📋 Installation Instructions:');
    console.log('===============================');
    
    if (platformKey.startsWith('macos')) {
      console.log('🍎 macOS:');
      console.log('1. Download the .dmg file');
      console.log('2. Open the .dmg file');
      console.log('3. Drag R2Drive to Applications folder');
      console.log('4. Run R2Drive from Applications');
    } else if (platformKey.startsWith('windows')) {
      console.log('🪟 Windows:');
      console.log('1. Download the .msi file');
      console.log('2. Run the installer');
      console.log('3. Follow installation wizard');
      console.log('4. Launch R2Drive from Start Menu');
    } else if (platformKey.startsWith('linux')) {
      console.log('🐧 Linux:');
      console.log('1. Download the .AppImage file');
      console.log('2. Make it executable: chmod +x r2drive_*.AppImage');
      console.log('3. Run: ./r2drive_*.AppImage');
    }
    
    console.log('\n💡 Alternative: Run as web app');
    console.log('===============================');
    console.log('If you prefer to run R2Drive as a web application:');
    console.log('• npx r2drive --web    (production)');
    console.log('• npx r2drive --dev    (development)');
    console.log('\n🔗 Then open: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🆘 Need help? Visit: https://github.com/falgom4/R2Drive/issues');
    process.exit(1);
  }
}

main();