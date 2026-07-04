import Link from "next/link";
import type { PostSummary } from "@/lib/types";

/**
 * PostCard 组件的 Props。
 */
interface PostCardProps {
  /** 博客文章摘要数据，包括 slug、title、excerpt、featuredImage、categories、date 和 author */
  post: PostSummary;
}

/**
 * 新闻列表网格的博客文章卡片组件（服务端组件）。
 *
 * 整个卡片是一个可点击链接，导航到文章详情页。
 * 渲染：
 * - 特色图片，16:10 比例、悬停缩放和懒加载
 * - 无特色图片时显示文档图标占位
 * - 分类徽章覆盖层（仅第一个分类）
 * - 文章标题（2 行截断）带悬停颜色过渡
 * - 摘要文本（2 行截断）
 * - 元数据页脚：发布日期 · 作者名称
 * - 悬停效果：上移（-translate-y-1）+ 阴影 + 图片轻微缩放
 */
export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group block bg-white rounded-2xl border border-gray-200/70 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
    >
      {/* ====================== 图片区域 ====================== */}
      {/* 16:10 比例，灰色占位背景 */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {post.featuredImage ? (
          // 特色图片，带懒加载和 group 悬停缩放
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          // 回退：无特色图片时显示文档图标
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
        )}

        {/* 分类徽章 — 仅当文章至少有一个分类时显示 */}
        {post.categories.length > 0 && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm border border-gray-200/50">
            {post.categories[0].name}
          </span>
        )}
      </div>

      {/* ====================== 内容区域 ====================== */}
      <div className="p-5">
        {/* 文章标题 — 限制 2 行，悬停时颜色变化 */}
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-gray-600 transition-colors">
          {post.title}
        </h3>

        {/* 文章摘要 — 限制 2 行 */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
          {post.excerpt}
        </p>

        {/* 元数据：发布日期 · 作者名称，用小圆点分隔 */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{post.date}</span>
          {/* 视觉分隔圆点 */}
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{post.author}</span>
        </div>
      </div>
    </Link>
  );
}
