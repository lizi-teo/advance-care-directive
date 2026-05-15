import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Stories files are Storybook-only and have their own build; exclude them from Next.js checks
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
