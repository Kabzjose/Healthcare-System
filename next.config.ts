import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allows images from external domains if you add doctor avatars later
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
    ],
  },
};

export default nextConfig;