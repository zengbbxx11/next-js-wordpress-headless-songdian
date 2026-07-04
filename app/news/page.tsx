/**
 * 新闻列表页面
 *
 * @file       app/news/page.tsx
 * @page       /news
 * @dataSource WordPress 无头 CMS，通过 WP REST API（getPosts）。
 *              获取已发布的文章，包含分类、日期、特色图片。
 * @strategy   ISR（增量静态再生），revalidate: 60。
 *              页面每分钟最多重新生成一次。所有文章在触发
 *              重新生成的每次请求中重新获取 —— 始终与
 *              WordPress 内容保持同步。
 * @pagination 通过 searchParams 支持查询参数 `?page=N`。默认 page=1。
 *              当 totalPages > 1 时显示"上一页 / 下一页"链接。
 * @seo        - 静态 Metadata title/description/canonical。
 *              - 通过 generateBreadcrumbs() 生成 BreadcrumbList JSON-LD。
 *
 * 布局：
 * - 深色 hero 区域，包含页面标题和副标题
 * - 特色文章卡片（第一篇文章，带图片的大型水平卡片）
 * - 次要文章网格（其余文章，2 列紧凑卡片）
 * - 底部分页控件
 * - 当 WordPress 没有文章时的空状态回退
 */

import Link from "next/link";
import { superMeta } from "next-super-meta";
import { getPosts } from "@/lib/wordpress";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY } from "@/lib/content-data";

// ---------------------------------------------------------------------------
// SEO 元数据 —— 使用 next-super-meta 生成
// ---------------------------------------------------------------------------
export const metadata = await superMeta({
  title: "News & Insights",
  description: `Industry insights, product announcements, and camera manufacturing expertise from ${COMPANY.name}. Stay informed on the latest from Songdian Technology.`,
  url: "/news",
});

// ISR: 最多每 60 秒重新验证一次页面数据。
export const revalidate = 60;

/**
 * NewsPage 组件的 Props。
 * searchParams 在 Next.js App Router（Next.js 15+）中是一个 Promise。
 */
interface NewsPageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * NewsPage —— /news 路由的默认导出异步页面组件。
 *
 * 通过 getPosts() 获取分页的 WordPress 文章，并以
 * 特色 + 网格布局渲染。通过 `page` 搜索参数支持分页。
 *
 * @param   {NewsPageProps} props - 包含 searchParams，其中包含可选的页码。
 * @returns {Promise<JSX.Element>} 渲染后的新闻列表页面。
 */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  // 解析 searchParams promise 并解析页码。
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // 从 WordPress 获取文章 —— 每页 9 篇用于网格布局。
  const { posts, pagination } = await getPosts({ page: currentPage, perPage: 9 });

  const breadcrumbs = generateBreadcrumbs([{ label: "News" }]);

  // 第一篇文章为特色文章（大型 hero 样式卡片），其余进入网格。
  const featured = posts[0];
  const remaining = posts.slice(1);

  return (
    <>
      {/* ================================================================
          Hero 区域 —— 深色背景，带淡红色径向渐变
          ================================================================ */}
      <section className="relative bg-gray-950 py-14 md:py-20 overflow-hidden">
        {/* 装饰性背景: 右上角淡红色光晕 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,52,62,0.08)_0%,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          {/* 面包屑导航 —— 深色变体 */}
          <Breadcrumbs items={breadcrumbs} variant="dark" />
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-6 mb-3">
            News &amp; Insights
          </h1>
          <p className="text-gray-400 max-w-lg text-sm md:text-base">
            Product launches, industry awards, and manufacturing expertise — straight from Songdian Technology.
          </p>
        </div>
      </section>

      {/* ================================================================
          文章区域 —— 特色卡片 + 次要网格 + 分页
          ================================================================ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {posts.length > 0 ? (
            <>
              {/* ----------------------------------------------------------
                  特色文章 —— 大型水平卡片
                  使用列表中的第一篇文章。全宽，左右分栏布局，
                  左侧图片，右侧文字内容。
                  ---------------------------------------------------------- */}
              {featured && (
                <Link
                  href={`/news/${featured.slug}`}
                  className="group block relative rounded-3xl overflow-hidden bg-gray-900 mb-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 min-h-[360px]">
                    {/* 特色图片 —— 带悬停缩放效果 */}
                    <div className="relative aspect-[4/3] md:aspect-auto bg-gray-800 overflow-hidden">
                      {featured.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.featuredImage}
                          alt={featured.featuredImageAlt}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="eager"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        </div>
                      )}
                      {/* 渐变覆盖层 —— 提高右侧文字可读性 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-900/80 md:to-gray-900" />
                    </div>
                    {/* 特色内容: 分类徽章、日期、标题、摘要、CTA */}
                    <div className="flex flex-col justify-center p-8 md:p-10 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        {featured.categories.length > 0 && (
                          <span className="px-2.5 py-0.5 bg-red-600/20 text-red-300 text-xs font-semibold rounded-full">
                            {featured.categories[0].name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{featured.date}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3 group-hover:text-red-400 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-5">{featured.excerpt}</p>
                      <span className="inline-flex items-center text-sm font-medium text-red-400 group-hover:text-red-300 transition-colors">
                        Read Article
                        <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ----------------------------------------------------------
                  次要文章 —— 2 列紧凑卡片网格
                  每张卡片: 缩略图、分类、日期、标题、摘要
                  ---------------------------------------------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remaining.map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-gray-200/70 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300"
                  >
                    {/* 缩略图列 */}
                    <div className="relative sm:w-48 shrink-0 aspect-[4/3] sm:aspect-auto bg-gray-100 overflow-hidden">
                      {post.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.featuredImage} alt={post.featuredImageAlt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg></div>
                      )}
                    </div>
                    {/* 文字内容列 */}
                    <div className="flex flex-col justify-center p-4 sm:py-4 sm:pr-5 sm:pl-0 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.categories.length > 0 && <span className="text-[11px] font-medium text-red-600">{post.categories[0].name}</span>}
                        <span className="text-[11px] text-gray-400">{post.date}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-1.5">{post.title}</h3>
                      <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ----------------------------------------------------------
                  分页 —— 上一页/下一页链接，显示当前页码
                  仅当超过 1 页结果时显示。
                  ---------------------------------------------------------- */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {currentPage > 1 && (
                    <Link href={`/news?page=${currentPage - 1}`} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200">Previous</Link>
                  )}
                  <span className="px-4 py-2.5 text-sm text-gray-500">Page {currentPage} / {pagination.totalPages}</span>
                  {currentPage < pagination.totalPages && (
                    <Link href={`/news?page=${currentPage + 1}`} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200">Next</Link>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ----------------------------------------------------------
                空状态 —— 当 WordPress 没有文章时显示
                提供友好的提示信息，而不是空白页面。
                ---------------------------------------------------------- */
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Yet</h3>
              <p className="text-sm text-gray-500">News articles will appear here once published in WordPress.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
