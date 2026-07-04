/**
 * 产品列表页面
 *
 * @file       app/products/page.tsx
 * @page       /products
 * @dataSource WooCommerce，通过 WP REST API（getProducts, getProductCategories）。
 *              从 WooCommerce 商店获取产品，支持分页和可选的分类筛选。
 * @strategy   ISR（增量静态再生），revalidate: 60。
 *              每次重新生成周期中，通过 Promise.all() 并行获取
 *              产品和分类。分类筛选失败时回退到空数组 ——
 *              网格仍然渲染所有产品。
 * @pagination 支持查询参数 `?page=N` 和 `?category=ID`。
 *              默认值: page=1，无分类筛选（显示全部）。
 * @seo        - 静态 Metadata，包含 title/description/canonical。
 *              - 通过 generateBreadcrumbs() 生成 BreadcrumbList 结构化数据。
 *
 * 布局：
 * - 浅色头部区域，包含面包屑、标题和描述
 * - 分类筛选标签页（水平药丸按钮，激活状态为红色）
 * - 响应式产品网格（断点处分别为 2/3/4 列），
 *   带有交错淡入动画
 * - "上一页 / 下一页" 分页控件
 * - 当 WooCommerce 为空时的空状态回退（"暂无产品"）
 */

import Link from "next/link";
import { superMeta } from "next-super-meta";
import { getProducts, getProductCategories } from "@/lib/wordpress";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateBreadcrumbs } from "@/lib/seo";

// ---------------------------------------------------------------------------
// SEO 元数据 —— 使用 next-super-meta 生成
// ---------------------------------------------------------------------------
export const metadata = await superMeta({
  title: "Camera Products",
  description: "Explore our full range of OEM / ODM digital cameras — action cameras, mirrorless cameras, point-and-shoot cameras, and more.",
  url: "/products",
});

// ISR: 最多每 60 秒重新验证一次产品列表。
// 动态渲染 —— WordPress 中的新产品会自动出现。
export const revalidate = 60;

/**
 * ProductsPage 组件的 Props。
 * searchParams 在 Next.js App Router（Next.js 15+）中是一个 Promise。
 */
interface ProductsPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

/**
 * ProductsPage —— /products 路由的默认导出异步页面组件。
 *
 * 获取 WooCommerce 产品，支持分类筛选和分页。
 * 渲染分类标签页、响应式产品网格和分页控件。
 * 当商店没有产品时回退到空状态。
 *
 * @param   {ProductsPageProps} props - 包含 searchParams，其中包含可选的 page 和 category。
 * @returns {Promise<JSX.Element>}     渲染后的产品列表页面。
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const categoryFilter = params.category ? Number(params.category) : undefined;

  // 并行获取产品和分类以提高性能。
  // 分类获取包装在 catch 中 —— 如果失败，我们仍然显示所有产品。
  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({ page: currentPage, perPage: 12, category: categoryFilter }),
    getProductCategories().catch(() => []),
  ]);

  const breadcrumbs = generateBreadcrumbs([{ label: "Products" }]);

  return (
    <>
      {/* ================================================================
          头部区域 —— 浅色背景，面包屑，标题，描述
          ================================================================ */}
      <section className="bg-gray-50 py-12 md:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-4">
            Our Camera Products
          </h1>
          <p className="text-gray-500 mt-3 max-w-xl">
            Professional OEM / ODM digital cameras — built to your specifications, delivered on time.
          </p>
        </div>
      </section>

      {/* ================================================================
          产品网格 + 分类筛选标签页
          ================================================================ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          {/* ----------------------------------------------------------
              分类筛选标签页 —— 水平药丸样式按钮。
              每个标签链接到 /products?category=<id>。激活标签
              获得红色背景；非激活标签为灰色，悬停变色。
              没有"全部"标签 —— 用户导航到 /products 即可查看全部。
              ---------------------------------------------------------- */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => {
                const isActive = categoryFilter === cat.id;
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 min-w-[120px] ${
                      isActive
                        ? "bg-red-600 text-white shadow-sm hover:bg-red-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          )}

          {products.length > 0 ? (
            <>
              {/* ----------------------------------------------------------
                  产品网格 —— 响应式 2/3/4 列。
                  每张卡片使用交错淡入动画，
                  延迟递增（产品索引 * 60ms）。
                  ---------------------------------------------------------- */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* ----------------------------------------------------------
                  分页 —— 上一页/下一页，显示当前页码。
                  分页链接中保留激活的分类筛选。
                  仅在结果超过 1 页时渲染。
                  ---------------------------------------------------------- */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {currentPage > 1 && (
                    <Link
                      href={`/products?page=${currentPage - 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="px-4 py-2.5 text-sm text-gray-500">
                    Page {currentPage} / {pagination.totalPages}
                  </span>
                  {currentPage < pagination.totalPages && (
                    <Link
                      href={`/products?page=${currentPage + 1}${categoryFilter ? `&category=${categoryFilter}` : ""}`}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ----------------------------------------------------------
                空状态 —— 当 WooCommerce 没有产品时显示。
                提示管理员通过 WooCommerce 添加产品。
                ---------------------------------------------------------- */
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Add products in WooCommerce — they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
