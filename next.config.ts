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
    // This is to prevent the "Module not found: Can't resolve 'fs'" error
    // when using libraries that have server-side dependencies.
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
        };
    }
    
    // This is to handle the pdf.js worker file.
    config.resolve.alias['pdfjs-dist/build/pdf.worker.min.mjs'] = 'pdfjs-dist/build/pdf.worker.min.mjs';


    return config;
  },
};

export default nextConfig;
