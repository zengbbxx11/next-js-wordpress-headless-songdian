import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "10004",
        pathname: "/**",
      },
      // Production: add your domain
      // { protocol: "https", hostname: "your-domain.com" },
    ],
    // Ensure Next.js Image optimization works with external WP images
    minimumCacheTTL: 3600,
  },

  // Fix turbopack root warning caused by parent package-lock.json
  turbopack: {
    root: __dirname,
  },

  // Gzip compression
  compress: true,
};

export default nextConfig;
