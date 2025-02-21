import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React's strict mode
  swcMinify: true, // Enables SWC compiler for better performance

  // Ensures environment variables are exposed correctly
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Redirect `/get-started` to `/` (if needed)
  async redirects() {
    return [
      {
        source: "/get-started",
        destination: "/",
        permanent: true,
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true, // Prevents ESLint warnings from breaking Vercel builds
  },

  images: {
    domains: ["your-image-host.com"], // Allow external images if needed
  },
};

export default nextConfig;
