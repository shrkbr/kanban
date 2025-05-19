/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desabilitar geração estática
  output: 'standalone',
  // Desabilitar otimizações que podem causar problemas
  optimizeFonts: false,
  webpack: (config) => {
    // Evitar problemas com 'self' durante o build
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback.fs = false;
    return config;
  },
}

module.exports = nextConfig
