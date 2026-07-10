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
    // Allow WP images from localhost in development
    dangerouslyAllowLocalIP: true,
    // Ensure Next.js Image optimization works with external WP images
    minimumCacheTTL: 3600,
    // 根据实际布局断点优化响应式图片尺寸
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
  },

  // Fix turbopack root warning caused by parent package-lock.json
  turbopack: {
    root: __dirname,
  },

  // Gzip compression
  compress: true,

  // 隐藏 Next.js 版本信息（安全）
  poweredByHeader: false,

  // 生产环境不暴露源码映射
  productionBrowserSourceMaps: false,

  // 生产环境移除 console（保留 error/warn）
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  // Tree-shaking 优化大包
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // 旧 /services 路由永久重定向到新的 /solutions（SEO + 书签兼容）
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/services/faq", destination: "/solutions/faq", permanent: true },
    ];
  },
};

export default nextConfig;
