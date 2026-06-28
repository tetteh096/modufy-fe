import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/services", destination: "/modules", permanent: true },
      { source: "/services/:slug", destination: "/modules", permanent: true },
    ];
  },
};

export default nextConfig;
