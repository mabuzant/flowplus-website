import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/proposal",
        destination: "https://propflow-production-170a.up.railway.app/",
      },
      {
        source: "/proposal/:path*",
        destination: "https://propflow-production-170a.up.railway.app/:path*",
      },
    ];
  },
};

export default nextConfig;
