/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      '@tremor/react',
      '@nivo/core',
      'recharts',
      'framer-motion'
    ],
  },
  
  // Bundle analyzer for development
  webpack: (config, { dev, isServer }) => {
    // Bundle optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        
        // TensorFlow.js - separate chunk
        tensorflow: {
          test: /[\\/]node_modules[\\/]@tensorflow[\\/]/,
          name: 'tensorflow',
          priority: 30,
          chunks: 'all',
        },
        
        // Charts - separate chunk
        charts: {
          test: /[\\/]node_modules[\\/](@nivo|recharts|@tremor)[\\/]/,
          name: 'charts',
          priority: 25,
          chunks: 'all',
        },
        
        // UI Libraries
        ui: {
          test: /[\\/]node_modules[\\/](@headlessui|@heroicons|framer-motion)[\\/]/,
          name: 'ui',
          priority: 20,
          chunks: 'all',
        },
        
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          chunks: 'all',
        },
      };
    }

    // Performance optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    return config;
  },
  
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Images optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;