/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      os: false,
      tls: false,
      fs: false,
      path: false,
      buffer: require.resolve('buffer/'),
    };

    // Add rule for .wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
  // Ensure images from these domains are allowed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.iconify.design',
      },
      {
        protocol: 'https',
        hostname: 'ton.org',
      },
      {
        protocol: 'https',
        hostname: 'telegram.org',
      },
    ],
  },
};

module.exports = nextConfig;