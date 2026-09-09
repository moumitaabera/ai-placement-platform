import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination:
          "https://ai-placement-platform-production.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;