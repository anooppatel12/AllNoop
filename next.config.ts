import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // This is the correct configuration to handle pdf-parse in the browser.
    // It replaces the server-side version with a browser-compatible one.
    config.resolve.alias['pdf-parse'] = require.resolve('pdf-parse/lib/pdf-parse.js');
    
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        process: false,
      };
    }

    return config;
  }
};

export default nextConfig;
