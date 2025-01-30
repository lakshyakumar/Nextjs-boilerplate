import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
