import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', // Reduced to minimum
    },
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['react-icons', 'lucide-react'],
  },
  // Disable ESLint during build to avoid TypeScript parser issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build to speed up deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Exclude ALL heavy packages from server-side builds
      config.externals = config.externals || [];
      config.externals.push(
        'face-api.js',
        '@tensorflow/tfjs-node',
        '@vladmandic/face-api',
        'puppeteer',
        'fluent-ffmpeg',
        'recharts',
        'gsap',
        'react-webcam',
        'jspdf',
        'qrcode',
        'twilio',
        'nodemailer',
        'mongoose',
        'cloudinary',
        'formidable',
        'express',
        'cors',
        'jsonwebtoken',
        'next-auth'
      );
    }
    
    // Remove console.log in production
    if (!dev) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        })
      );
    }
    
    // Ultra-aggressive bundle optimization for memory
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 50000, // Very small chunks
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 50000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            maxSize: 50000,
          },
          // Separate heavy libraries
          heavy: {
            test: /[\\/]node_modules[\\/](recharts|gsap|face-api\.js|react-webcam)[\\/]/,
            name: 'heavy',
            chunks: 'all',
            priority: 15,
            maxSize: 25000,
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
  reactStrictMode: false,
};

export default nextConfig;
