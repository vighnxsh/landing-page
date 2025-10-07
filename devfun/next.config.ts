import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dev.fun',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pump.mypinata.cloud',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
