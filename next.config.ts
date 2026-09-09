import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack walks up looking for a lockfile, finds a stray package-lock.json
  // in the Windows home directory, and treats that as the workspace root —
  // which is what it warns about on every dev boot. Pinning the root is the
  // fix the warning asks for.
  turbopack: { root: __dirname },
  images: {
    // `unoptimized` was a leftover from the old static-export build (Next's
    // optimizer needs a server, which static export doesn't have). Now that
    // the site runs on Vercel it stays off, so next/image resizes and
    // re-encodes. remotePatterns is required for that: CMS-uploaded
    // product/blog images live on Vercel Blob storage.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // AVIF has to be asked for — the default is ["image/webp"] on its own.
    // Order matters: AVIF is preferred where the browser's Accept header takes
    // it, WebP is the fallback, and anything older gets the original format.
    // Worth having on a catalogue that is almost entirely product photography.
    formats: ["image/avif", "image/webp"],
  },
  // No longer a static export — /api/lead needs a real server function to
  // send email. Pages that were static before (generateStaticParams etc.)
  // still prerender the same way under normal Vercel hosting.
  trailingSlash: true,
};

export default nextConfig;
