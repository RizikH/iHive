import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React's strict mode

  eslint: {
    ignoreDuringBuilds: false, // ESLint will run locally, but won't fail deployments
  },

  images: {
    domains: ["your-image-host.com"], // Replace with actual image domains if needed
  },
};

export default nextConfig;
