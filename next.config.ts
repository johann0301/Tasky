import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Disable ESLint during build to avoid circular structure errors
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (if needed)
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true, // Uncomment if needed
  },
};

export default nextConfig;
