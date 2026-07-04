import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/types";

/**
 * Breadcrumbs 组件的 Props。
 */
interface BreadcrumbsProps {
  /** 面包屑分段的有序列表（第一个 = 父级，最后一个 = 当前页面） */
  items: BreadcrumbItem[];
  /** 颜色变体："light" 用于浅色背景，"dark" 用于深色/页脚背景 */
  variant?: "light" | "dark";
}

/**
 * SEO 友好的面包屑导航组件（服务端组件）。
 *
 * 功能：
 * - 渲染语义化的 `<nav aria-label="Breadcrumb">` 以实现可访问性
 * - 注入 `BreadcrumbList` JSON-LD 结构化数据脚本供搜索引擎使用
 * - 支持两种颜色变体：`light`（默认）和 `dark`（适用于深色背景）
 * - 自动检测最后一项并将其渲染为纯文本（非链接）
 * - 分隔箭头仅在项目之间插入（不在第一个之前）
 * - 响应式 — 小屏幕上通过 `flex-wrap` 自动换行
 */
export default function Breadcrumbs({
  items,
  variant = "light",
}: BreadcrumbsProps) {
  /**
   * 构建 schema.org BreadcrumbList 用于 SEO。
   * 每个列表项包含位置索引和完整 URL。
   * 最后一项（当前页面）根据 schema.org 规范省略 `item` 属性。
   */
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${item.href}`
        : undefined,
    })),
  };

  // 变体感知的颜色令牌
  const textColor = variant === "dark" ? "text-gray-500" : "text-gray-400";
  const activeColor = variant === "dark" ? "text-gray-300" : "text-gray-600";
  const sepColor = variant === "dark" ? "text-gray-600" : "text-gray-300";
  const hoverColor =
    variant === "dark" ? "hover:text-gray-300" : "hover:text-gray-600";

  return (
    <>
      {/* 搜索引擎爬虫用的 JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm ${textColor} flex-wrap`}
      >
        {items.map((item, i) => (
          <span
            key={item.href || item.label}
            className="flex items-center gap-2"
          >
            {/* 箭头分隔符 — 仅在项目之间显示，不在第一个之前 */}
            {i > 0 && (
              <svg
                className={`w-3.5 h-3.5 ${sepColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {/* 可点击的面包屑项（父级项）或纯文本（当前页面） */}
            {item.href ? (
              <Link
                href={item.href}
                className={`${hoverColor} transition-colors`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-medium ${activeColor}`}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
