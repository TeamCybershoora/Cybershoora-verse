/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    memoryBasedWorkers: true,
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['react-icons', 'lucide-react'],
    staticPageGenerationTimeout: 120,
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Exclude heavy packages from server-side builds to prevent memory issues
      config.externals = config.externals || [];
      config.externals.push(
        'face-api.js',
        '@tensorflow/tfjs-node',
        '@vladmandic/face-api',
        'whatsapp-web.js',
        'puppeteer',
        'fluent-ffmpeg'
      );
    }
    
    // Optimize bundle size and memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 244000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            maxSize: 244000,
          },
        },
      },
    };

    // Add fallbacks for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    // Handle face-api.js specifically - exclude from server builds
    if (isServer) {
      config.module.rules.push({
        test: /node_modules\/face-api\.js/,
        use: 'null-loader'
      });
    }
    
    return config;
  },
  // Add Vercel-specific optimizations
  output: 'standalone',
  poweredByHeader: false,
  // Reduce memory usage during build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable static optimization for heavy pages
  trailingSlash: false,
  compress: true,
  // Reduce memory usage
  swcMinify: true,
  reactStrictMode: false,
  // Optimize static generation
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
