/**
 * 新闻文章详情页面（动态路由）
 *
 * @file       app/news/[slug]/page.tsx
 * @route      /news/:slug
 * @dataSource WordPress 无头 CMS，通过 WP REST API。
 *              - getPostBySlug(slug) —— 获取单篇文章内容、meta、标签。
 *              - getAllPostSlugs() —— 获取所有 slug 用于静态生成。
 *              - getPosts({ categoryId, perPage }) —— 获取相关文章。
 * @strategy   ISR（revalidate: 60），通过 generateStaticParams() 支持 SSG。
 *              - generateStaticParams(): 构建时从 WordPress 获取所有已知
 *                文章 slug 并预渲染为静态页面。
 *              - generateMetadata(): 为每篇文章生成动态 <title>、<meta desc>、
 *                Open Graph（article 类型）和 canonical URL。
 *              - ISR 回退: 任何未预构建的新文章 slug 在首次请求时
 *                服务端渲染，然后缓存并增量重新生成。
 * @seo        - 文章 JSON-LD schema 通过 articleSchema() 生成。
 *              - BreadcrumbList 用于导航层级。
 *              - Open Graph 元数据用于社交分享。
 *
 * 布局：
 * - 深色 hero，包含面包屑、分类徽章、标题、作者头像、日期
 * - 特色图片（如果有）在 hero 下方的容器卡片中
 * - 文章正文: 摘要引导段落、WordPress 内容、标签、返回链接
 * - 相关文章区域（最多 3 篇，按相同分类筛选）
 * - 404 回退，当 slug 不匹配任何文章时
 */

import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs, getPosts } from "@/lib/wordpress";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import { generateBreadcrumbs, articleSchema } from "@/lib/seo";
import { formatDate } from "@/lib/wordpress";

// ISR: 最多每 60 秒重新生成一次文章页面。
export const revalidate = 60;

/**
 * generateStaticParams —— 为所有已知 WordPress 文章预构建静态页面。
 *
 * 在构建时（next build）调用。从 WordPress 获取完整文章 slug
 * 列表并为每个返回参数。每个 slug 预渲染为静态 HTML 页面，
 * 确保快速的首次加载性能。构建后创建的新文章
 * 将在首次请求时服务端渲染（ISR 回退）。
 *
 * @returns {Promise<Array<{ slug: string }>>} slug 参数数组，用于静态生成。
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * generateMetadata —— 为每篇新闻文章生成动态 SEO 元数据。
 *
 * 在请求时（或构建时用于静态页面）调用。通过 slug 获取文章并构建:
 * - <title> 来自 post.title
 * - <meta description> 来自 post.excerpt（截断至 160 字符）
 * - Canonical URL 为 /news/:slug
 * - Open Graph: 标题、描述、特色图片、文章发布/修改日期、作者
 *
 * @param   {object}   props       - 路由 props。
 * @param   {Promise<{ slug: string }>} props.params - Promise，解析为路由参数。
 * @returns {Promise<Metadata>}    Next.js Metadata 对象，用于页面。
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt?.slice(0, 160),
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: post.title, description: post.excerpt?.slice(0, 160),
      images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [],
      type: "article", publishedTime: post.date, modifiedTime: post.modified, authors: [post.author],
    },
  };
}

/**
 * NewsDetailPage —— /news/:slug 路由的默认导出页面组件。
 *
 * 渲染完整的新闻文章页面，包括深色 hero、特色图片、
 * 文章正文内容（通过 dangerouslySetInnerHTML 渲染 WordPress 的 HTML）、
 * 标签药丸、相关文章和返回新闻的导航链接。
 * 当 slug 不匹配任何 WordPress 文章时显示 404 样式回退。
 *
 * @param   {object}   props       - 路由 props。
 * @param   {Promise<{ slug: string }>} props.params - Promise，解析为路由参数。
 * @returns {Promise<JSX.Element>} 渲染后的文章详情页面。
 */
export default async function NewsDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 404 回退 —— WordPress 中未找到文章
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link href="/news" className="text-sm text-red-600 hover:underline">&larr; Back to News</Link>
      </div>
    );
  }

  // 面包屑: Home > News > Article Title（最后一项为当前页面）
  const breadcrumbs = generateBreadcrumbs([{ label: "News", href: "/news" }, { label: post.title }]);

  // JSON-LD Article 结构化数据，用于 Google 富媒体搜索结果
  const schema = articleSchema({
    title: post.title, description: post.excerpt?.slice(0, 160) || "",
    image: post.featuredImage, datePublished: post.date, dateModified: post.modified,
    author: post.author, url: `/news/${slug}`,
  });

  // 从同一主分类获取相关文章（最多 4 篇，然后筛选至 3 篇）
  let relatedPosts: Awaited<ReturnType<typeof getPosts>> = { posts: [], pagination: { total: 0, totalPages: 0 } };
  if (post.categories.length > 0) {
    try { relatedPosts = await getPosts({ categoryId: post.categories[0].id, perPage: 4 }); } catch { /* 静默忽略获取失败 —— 相关文章是可选的 */ }
  }

  // 从相关结果中排除当前文章，限制为 3 篇
  const related = relatedPosts.posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      {/* 文章 JSON-LD 结构化数据 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ================================================================
          深色 Hero —— 标题、meta、面包屑
          淡红色径向光晕营造品牌氛围。
          ================================================================ */}
      <section className="relative bg-gray-950 pt-10 pb-12 md:pt-14 md:pb-16 overflow-hidden">
        {/* 淡红色光晕 —— 装饰性背景 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,52,62,0.07)_0%,transparent_50%)]" />

        <div className="relative max-w-3xl mx-auto px-6">
          {/* 面包屑 */}
          <Breadcrumbs items={breadcrumbs} variant="dark" />

          {/* 分类徽章 —— 链接到筛选后的新闻列表 */}
          {post.categories.length > 0 && (
            <Link
              href={`/news?category=${post.categories[0].id}`}
              className="inline-block mt-6 px-3 py-1 bg-red-600/15 text-red-400 text-xs font-semibold rounded-full hover:bg-red-600/25 transition-colors"
            >
              {post.categories[0].name}
            </Link>
          )}

          {/* 文章标题 */}
          <h1 className="text-[1.625rem] md:text-[2.5rem] font-bold text-white tracking-tight leading-[1.15] mt-4 mb-5">
            {post.title}
          </h1>

          {/* Meta 行: 作者头像、名称、分隔符点、发布日期 */}
          <div className="flex items-center gap-4 text-sm">
            {post.authorAvatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full ring-1 ring-white/20" />
            )}
            <span className="text-gray-300 font-medium">{post.author}</span>
            <span className="text-gray-600">&middot;</span>
            <time dateTime={post.date} className="text-gray-400">{formatDate(post.date)}</time>
          </div>
        </div>
      </section>

      {/* ================================================================
          特色图片 —— 带阴影的容器卡片，与 hero 重叠
          负 margin-top 上拉以创建分层效果。
          ================================================================ */}
      {post.featuredImage && (
        <section className="bg-white">
          <div className="max-w-4xl mx-auto px-6 -mt-6 md:-mt-8 relative z-10">
            <div className="rounded-2xl overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          文章正文 —— 渲染 WordPress HTML 内容
          ================================================================ */}
      <article className="bg-white pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* 引导段落 / 摘要 —— 以引言样式显示，带底部分隔线 */}
          {post.excerpt && (
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-10 pb-10 border-b border-gray-100">
              {post.excerpt}
            </p>
          )}

          {/* 主要内容 —— WordPress 原始 HTML，通过 .wp-content CSS 样式化 */}
          <div className="wp-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* 标签 —— 水平药丸列表，如果文章有标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-14 pt-10 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span key={tag.id} className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 返回新闻的导航链接 */}
          <div className="mt-12">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors group"
            >
              <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </div>
        </div>
      </article>

      {/* ================================================================
          相关文章 —— 3 列网格，与当前文章同分类
          仅当有可用相关文章时显示。
          ================================================================ */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-8">
              More Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
