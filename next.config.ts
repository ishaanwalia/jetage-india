import type { NextConfig } from "next";

const nextConfig = {
  images: {
    unoptimized: true, // Required for static export
  },
  output: 'export',
  distDir: 'dist',
};

export default nextConfig;
