/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-typescript', { allowNamespaces: true }],
            ['next/babel']
          ],
          plugins: [
            ['@babel/plugin-transform-typescript', { allowNamespaces: true }]
          ]
        }
      }]
    });

    // Ignore all build errors
    config.infrastructureLogging = { level: 'none' };
    config.stats = 'none';

    return config;
  },
  images: { unoptimized: true },
  optimizeFonts: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },

};

module.exports = nextConfig;