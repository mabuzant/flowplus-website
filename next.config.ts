import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/proposal",
        destination: "https://propflow-production-170a.up.railway.app/proposal",
      },
      {
        source: "/proposal/:path*",
        destination: "https://propflow-production-170a.up.railway.app/proposal/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://propflow-production-170a.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
