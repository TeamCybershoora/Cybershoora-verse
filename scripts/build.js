const { execSync } = require('child_process');

console.log('🚀 Starting optimized build...');

// Set environment variables for memory optimization
process.env.NODE_OPTIONS = '--max-old-space-size=1024';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_STATIC_GENERATION = 'true';

try {
  // Run the build with optimized settings
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=1024',
      NEXT_TELEMETRY_DISABLED: '1',
      SKIP_STATIC_GENERATION: 'true'
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 