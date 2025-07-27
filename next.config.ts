import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'noxmetals-image-uploads.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
