/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable checks
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Basic settings
  reactStrictMode: false,
  swcMinify: false,

  // Webpack config
  webpack: (config) => {
    // Disable logging
    config.infrastructureLogging = { level: 'none' };
    config.stats = 'none';

    // Add ignore-loader for specific files
    config.module.rules.push({
      test: /page\.client\.tsx$/,
      use: 'ignore-loader'
    });

    // Safe watchOptions setup
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/client-page.tsx']
    };

    return config;
  },

  // Experimental features
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig;