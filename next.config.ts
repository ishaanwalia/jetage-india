import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "jetageindia.in",
          },
        ],
        destination: "https://www.jetageindia.in/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
