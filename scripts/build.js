const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized build...');

// Set environment variables for build optimization
const buildEnv = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=4096 --expose-gc',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_OPTIMIZE_FONTS: 'false',
  NEXT_OPTIMIZE_IMAGES: 'false',
  NEXT_OPTIMIZE_CSS: 'false',
};

try {
  // Clean up any previous build artifacts (cross-platform)
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    if (process.platform === 'win32') {
      execSync('rmdir /s /q .next', { stdio: 'inherit' });
    } else {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
  }
  
  console.log('📦 Building Next.js application with optimizations...');
  
  // Run garbage collection periodically during build
  if (global.gc) {
    setInterval(() => {
      try {
        global.gc();
      } catch (e) {
        // Ignore GC errors
      }
    }, 5000);
  }
  
  // Run the build with optimized settings
  execSync('npx next build', { 
    stdio: 'inherit',
    env: buildEnv,
    maxBuffer: 1024 * 1024 * 100 // 100MB buffer
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 