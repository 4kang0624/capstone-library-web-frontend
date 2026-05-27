import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['122.46.190.224'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: '**.naver.com',
      },
    ],
  },
};

export default nextConfig;
