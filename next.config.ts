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
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    
    // This is required to make `pdf-parse` work correctly.
    config.module.rules.push({
      test: /pdf-parse/,
      use: ['null-loader'],
    });
    
    config.externals.push('pdf-parse');

    return config;
  }
};

export default nextConfig;
