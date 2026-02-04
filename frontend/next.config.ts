import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Explicitly disable Turbopack for production to avoid module factory errors
  experimental: {
  },
  transpilePackages: ["@stacks/connect", "@stacks/transactions", "@stacks/auth", "@stacks/network", "@stacks/common"],
};

export default nextConfig;
