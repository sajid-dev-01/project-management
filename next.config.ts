import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    after: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "utfs.io" }],
  },
};

export default nextConfig;
