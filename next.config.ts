import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Required for static export
  },
  output: 'export',
  distDir: 'dist',
  trailingSlash: true, // ✅ ADD THIS
};

export default nextConfig;