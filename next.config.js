/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  optimizeFonts: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;