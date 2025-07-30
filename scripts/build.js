const { execSync } = require('child_process');

console.log('🚀 Starting optimized build...');

// Set environment variables for build optimization
const buildEnv = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=4096 --gc-interval=100',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_OPTIMIZE_FONTS: 'false',
  NEXT_OPTIMIZE_IMAGES: 'false',
  NEXT_OPTIMIZE_CSS: 'false',
  RENDER_CACHE_DIR: '/opt/render/.cache',
  NEXT_CACHE_DIR: '/opt/render/.cache/next',
};

try {
  // Clean up any previous build artifacts
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Create cache directories
  execSync('mkdir -p /opt/render/.cache/next', { stdio: 'inherit' });
  
  console.log('📦 Building Next.js application with optimizations...');
  
  // Run garbage collection before build
  global.gc && global.gc();
  
  // Run the build with optimized settings
  execSync('next build', { 
    stdio: 'inherit',
    env: buildEnv,
    maxBuffer: 1024 * 1024 * 100 // 100MB buffer
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 