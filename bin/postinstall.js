#!/usr/bin/env node

const os = require('os');

console.log('\n🎉 R2Drive installed successfully!');
console.log('===================================\n');

console.log('📱 How to use R2Drive:');
console.log('======================');

console.log('\n🖥️  Desktop App (Recommended):');
console.log('   r2drive');
console.log('   → Opens download page for native app\n');

console.log('🌐 Web App:');
console.log('   r2drive --web');
console.log('   → Starts web server at http://localhost:3000\n');

console.log('🔧 Development:');
console.log('   r2drive --dev');
console.log('   → Starts development server\n');

const platform = os.platform();
if (platform === 'win32') {
  console.log('💡 Windows Tip: You may need to restart your terminal');
  console.log('   for the r2drive command to be available.\n');
}

console.log('📚 Documentation: https://github.com/falgom4/R2Drive');
console.log('🐛 Issues: https://github.com/falgom4/R2Drive/issues');
console.log('⭐ Like it? Give us a star on GitHub!\n');

console.log('🚀 Ready to manage your Cloudflare R2 storage!');