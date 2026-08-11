import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // No longer a static export — /api/lead needs a real server function to
  // send email. Pages that were static before (generateStaticParams etc.)
  // still prerender the same way under normal Vercel hosting.
  trailingSlash: true,
};

export default nextConfig;