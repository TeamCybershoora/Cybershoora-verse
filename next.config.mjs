/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude face-api.js from server-side builds to prevent memory issues
      config.externals = config.externals || [];
      config.externals.push('face-api.js');
    }
    return config;
  },
};

export default nextConfig;
