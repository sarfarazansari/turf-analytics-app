import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
