import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'],
    minimumCacheTTL: 60,
    disableStaticImages: true,
  },
  // Optimize for production
  output: 'standalone',
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  keepAlive: false,
  // Minimal experimental features
  experimental: {
    serverActions: false,
    optimizePackageImports: ['react-icons'],
    optimizeCss: true,
    legacyBrowsers: false,
  },
  // Disable all development features
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Production optimizations only
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: true,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
          }),
        ],
        splitChunks: {
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
      };
    }

    // Reduce bundle size
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
      };
    }

    return config;
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
    
    // Handle face-api.js in client builds too - make it optional
    if (!isServer) {
      config.module.rules.push({
        test: /node_modules\/face-api\.js/,
        use: 'null-loader'
      });
    }
    
    return config;
  },
  // Add Vercel-specific optimizations
  poweredByHeader: false,
  // Reduce memory usage during build
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
