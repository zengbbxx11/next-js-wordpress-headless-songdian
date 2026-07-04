import Link from "next/link";
import type { ProductSummary } from "@/lib/types";

/**
 * ProductCard 组件的 Props。
 */
interface ProductCardProps {
  /** 产品数据，包括 slug、name、image、shortDescription 和 categories */
  product: ProductSummary;
}

/**
 * 去除字符串中的 HTML 标签，并将 `<br>` 转换为项目符号分隔符。
 * 用于从 WordPress 简短描述中生成干净的纯文本摘要。
 *
 * @param html - 原始 HTML 字符串（例如来自 WordPress 产品 shortDescription）
 * @returns 截断为 100 个字符的清理后纯文本字符串
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " · ") // 将换行符转换为项目符号分隔符
    .replace(/<[^>]*>/g, "") // 去除所有剩余 HTML 标签
    .trim()
    .slice(0, 100); // 截断以阻止溢出
}

/**
 * 产品列表/网格的产品卡片组件（服务端组件）。
 *
 * 以卡片布局渲染单个产品：
 * - 正方形图片，带悬停缩放效果和可选的分类徽章
 * - 无图片时显示相机图标占位
 * - 产品名称和清理后的简短描述（截断）
 * - "查看详情" CTA 按钮通过 flex grow 固定在卡片底部
 * - 整个卡片包裹在 group 中用于协调悬停效果
 */
export default function ProductCard({ product }: ProductCardProps) {
  const shortDesc = cleanHtml(product.shortDescription);
  const category = product.categories[0]?.name || "";

  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl border border-gray-200/70 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
      {/* ====================== 图片区域 ====================== */}
      {/* 固定正方形比例的容器，overflow hidden 用于缩放效果 */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square shrink-0 bg-gray-50 overflow-hidden"
      >
        {product.image ? (
          // 产品图片，带懒加载和悬停缩放（scale-105）
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          // 回退：无图片时显示相机图标占位
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg
              className="w-14 h-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* 分类徽章 — 仅在产品属于某个分类时渲染 */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold rounded-lg shadow-sm border border-gray-200/50">
            {category}
          </span>
        )}
      </Link>

      {/* ====================== 信息区域 ====================== */}
      {/* flex 列布局，flex-1 使 CTA 始终固定在卡片底部 */}
      <div className="flex flex-col flex-1 p-4">
        {/* 产品名称 + 简短描述 — 可点击区域，链接到产品详情页 */}
        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          {/* 清理后的描述摘要 — 仅在不为空时渲染 */}
          {shortDesc && (
            <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed mt-1.5">
              {shortDesc}
            </p>
          )}
        </Link>

        {/* ====================== CTA ====================== */}
        {/* 全宽"查看详情"按钮，通过 mt-auto（来自上方 flex-1）固定在底部 */}
        <Link
          href={`/products/${product.slug}`}
          className="flex items-center justify-center w-full mt-3 py-2.5 text-xs font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
