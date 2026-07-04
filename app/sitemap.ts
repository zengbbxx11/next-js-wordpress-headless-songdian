import type { MetadataRoute } from "next";
import { getAllPostSlugs, getAllProductSlugs } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 静态页面
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/services/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // 动态产品路由（从 WooCommerce 获取）
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productSlugs = await getAllProductSlugs();
    productRoutes = productSlugs.map((slug) => ({
      url: `${siteUrl}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // WooCommerce 不可用时静默跳过
  }

  // 动态文章路由（从 WordPress 获取）
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const postSlugs = await getAllPostSlugs();
    postRoutes = postSlugs.map((slug) => ({
      url: `${siteUrl}/news/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // WordPress 不可用时静默跳过
  }

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
