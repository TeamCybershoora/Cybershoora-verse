const { execSync } = require('child_process');

console.log('🚀 Starting optimized build...');

// Set environment variables for build optimization
const buildEnv = {
  ...process.env,
  NODE_OPTIONS: '--max-old-space-size=512',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_FORCE_SERVER_SIDE_RENDERING: 'true',
  NEXT_DISABLE_STATIC_GENERATION: 'true',
  NEXT_DISABLE_STATIC_OPTIMIZATION: 'true',
  RENDER_CACHE_DIR: '/opt/render/.cache',
  NEXT_CACHE_DIR: '/opt/render/.cache/next',
};

try {
  // Clean up any previous build artifacts
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Create cache directories
  execSync('mkdir -p /opt/render/.cache/next', { stdio: 'inherit' });
  
  console.log('📦 Building with server-side rendering...');
  
  // Run the build with optimized settings
  execSync('next build', { 
    stdio: 'inherit',
    env: buildEnv
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 