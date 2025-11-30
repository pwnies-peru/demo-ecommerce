/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Ensure proper middleware handling in production
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Optimize for Vercel deployment
  typescript: {
    // Optionally ignore build errors in production (not recommended)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Optionally ignore eslint errors during build
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
