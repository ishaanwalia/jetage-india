import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `unoptimized` was a leftover from the old static-export build (Next's
    // optimizer needs a server, which static export doesn't have). Now that
    // the site runs on Vercel, this stays off so next/image resizes and
    // serves AVIF/WebP automatically. remotePatterns is required for that:
    // CMS-uploaded product/blog images live on Vercel Blob storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // No longer a static export — /api/lead needs a real server function to
  // send email. Pages that were static before (generateStaticParams etc.)
  // still prerender the same way under normal Vercel hosting.
  trailingSlash: true,
};

export default nextConfig;