import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["picsum.photos"],
    unoptimized: true,
  },
};

export default nextConfig;
