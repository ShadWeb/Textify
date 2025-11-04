import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
   output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ❗ مهم
  },
  typescript: {
    ignoreBuildErrors: true,  // ❗ مهم
  },

  
};

export default nextConfig;