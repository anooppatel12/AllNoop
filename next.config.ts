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
    // This is required to make `pdf-parse` work correctly in a server context.
    config.module.rules.push({
        test: /pdf-parse\/lib\/pdf.js\/v1.10.100\/build\/pdf.js$/,
        loader: 'string-replace-loader',
        options: {
            search: 'require(\'fs\')',
            replace: '{}',
        }
    });

    return config;
  }
};

export default nextConfig;
