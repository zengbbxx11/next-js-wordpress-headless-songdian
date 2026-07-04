/**
 * @fileoverview 站点全局配置模块
 *
 * 导航链接、页脚链接组以及共享常量的中央配置入口。
 * 此模块充当布局组件（Header、Footer）使用的单一数据源，
 * 并与 {@link content-data.ts} 保持同步，共享产品分类和公司信息。
 *
 * @module site-config
 * @package Songdian Technology — Next.js WordPress Headless B2B Website
 */

import { COMPANY, PRODUCT_CATEGORIES } from "@/lib/content-data";

/**
 * 从 content-data 重新导出共享的 COMPANY 常量。
 *
 * 集中在此处，使布局组件只需从 `site-config` 导入，
 * 而无需了解内部模块结构。
 */
export { COMPANY };

/**
 * 站点头部渲染的主要导航链接。
 * 顺序很重要 — 定义了桌面导航栏从左到右的顺序。
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
] as const;

/**
 * 按列组织的页脚链接组。
 * 每个组有一个用于列标题的语义键和一个链接对象（label + href）数组。
 *
 * `products` 列从 {@link PRODUCT_CATEGORIES} 的前 4 个条目自动填充，
 * 并附加一个"查看全部产品"链接。
 */
export const FOOTER_LINKS = {
  /** 产品分类链接 — 派生自 {@link PRODUCT_CATEGORIES} */
  products: [
    ...PRODUCT_CATEGORIES.slice(0, 4).map((c) => ({
      label: c.name,
      href: "/products",
    })),
    { label: "View All Products", href: "/products" },
  ],
  /** 服务相关链接 */
  services: [
    { label: "OEM / ODM", href: "/services" },
    { label: "FAQ", href: "/services/faq" },
  ],
  /** 公司信息链接 */
  company: [
    { label: "About Us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  /** 客户支持链接 */
  support: [
    { label: "FAQ", href: "/services/faq" },
    { label: "Request Quote", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
} as const;
