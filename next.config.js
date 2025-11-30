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
  // Don't set output to standalone when deploying to Vercel
  // Vercel handles this automatically
};

module.exports = nextConfig;
