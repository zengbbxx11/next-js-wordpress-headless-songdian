/**
 * 产品详情页面（动态路由）
 *
 * @file       app/products/[slug]/page.tsx
 * @route      /products/:slug
 * @dataSource WooCommerce，通过 WP REST API。
 *              - getProductBySlug(slug) —— 获取单个产品，包含图片、
 *                属性、分类、标签、描述、SKU。
 *              - getAllProductSlugs() —— 获取所有产品 slug 用于 SSG。
 *              - getProducts({ category, perPage }) —— 从同一 WooCommerce
 *                分类获取相关产品。
 * @strategy   ISR（revalidate: 60），通过 generateStaticParams() 支持 SSG。
 *              - generateStaticParams(): 构建时获取所有产品 slug 并
 *                预渲染为静态页面。
 *              - generateMetadata(): 为每个产品生成动态 meta —— 标题来自
 *                product.name，描述来自简短描述，Open Graph 包含产品图片。
 *              - ISR 回退: 构建后添加的新产品在首次请求时服务端渲染，
 *                然后缓存。
 * @helpers    - extractFeatures(html): 解析 HTML 简短描述为要点列表字符串，
 *                用于功能列表。
 *              - extractSpecs(html): 从简短描述中提取键值对规格
 *                或自由文本行，用于规格表。
 * @seo        - 产品 JSON-LD schema 通过 productSchema() 生成，包含 name、description、
 *                image、SKU。
 *              - BreadcrumbList: Home > Products > Product Name。
 *
 * 布局：
 * - 面包屑栏（浅色）
 * - 产品概览: 左侧图片（主图 + 图库缩略图）/ 右侧信息
 *   （品牌、名称、功能、SKU、CTA["发送询价"、"所有产品"]、
 *    OEM/ODM 可定制通知）
 * - 规格表（当存在属性或解析的规格时）
 * - 产品标签（药丸样式）
 * - 完整产品描述 / 亮点（当描述 HTML 存在时）
 * - 相关产品网格（最多 4 个，按相同分类筛选）
 * - 404 回退，当 slug 不匹配任何产品时
 */

import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getAllProductSlugs, getProducts } from "@/lib/wordpress";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { generateBreadcrumbs, productSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/content-data";

// ISR: 最多每 60 秒重新生成一次产品页面。
export const revalidate = 60;

/**
 * generateStaticParams —— 为所有 WooCommerce 产品预构建静态页面。
 *
 * 在构建时调用。从 WooCommerce 获取完整的产品 slug 列表
 * 并返回路由参数。预渲染的页面确保所有产品的
 * 首次加载快速。构建后添加的新产品由 ISR 回退处理
 * （首次请求时服务端渲染，然后缓存）。
 *
 * @returns {Promise<Array<{ slug: string }>>} slug 参数数组，用于静态生成。
 */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * generateMetadata —— 为每个产品页面生成动态 SEO 元数据。
 *
 * 通过 slug 获取产品并生成:
 * - <title> 来自 product.name
 * - <meta description> 来自简短描述（截断至 160 字符）
 *   或使用公司名称作为回退
 * - Canonical URL 为 /products/:slug
 * - Open Graph: title, description, 产品图片 (800x800), type "article"
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
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription?.slice(0, 160) || `OEM/ODM ${product.name} — ${COMPANY.name}`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription?.slice(0, 160),
      images: product.images?.[0]?.src ? [{ url: product.images[0].src, width: 800, height: 800 }] : [],
      type: "article",
    },
  };
}

// ============================================================
// 辅助函数 —— 从 WooCommerce HTML 中提取结构化数据
// ============================================================

/**
 * 从 WooCommerce 简短描述中提取要点式功能列表。
 *
 * 去除 HTML 标签，按换行符分割，移除前导项目符号
 * （•, -, –, —, ·），返回清理后的功能字符串数组。
 * 限制为 8 项以防止溢出。
 *
 * @param   {string}   html - WooCommerce 的原始 HTML 简短描述。
 * @returns {string[]}       清理后的功能要点数组。
 */
function extractFeatures(html: string): string[] {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.replace(/^[•\-–—·]\s*/, "").trim())
    .filter((s) => s.length > 3)
    .slice(0, 8);
}

/**
 * 从简短描述中提取键值对规格信息。
 *
 * 去除 HTML，按换行符分割，筛选较短的
 * 行（< 60 字符），挑选看起来像规格条目的行。
 * 当 WooCommerce attributes API 数据不可用时回退到原始行。
 * 限制为 16 条。
 *
 * @param   {string}   html - WooCommerce 的原始 HTML 简短描述。
 * @returns {Array<{ label: string; value: string }>} 规格条目数组。
 */
function extractSpecs(html: string): { label: string; value: string }[] {
  const lines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const specs: { label: string; value: string }[] = [];
  for (const line of lines) {
    if (line.length < 60) specs.push({ label: "", value: line });
  }
  return specs.slice(0, 16);
}

// ============================================================
// 页面组件
// ============================================================

/**
 * ProductDetailPage —— /products/:slug 路由的默认导出页面组件。
 *
 * 渲染完整的产品详情页面，包含图片画廊、规格表、
 * 完整描述、OEM/ODM CTA 和相关产品。当 slug 不匹配
 * 任何 WooCommerce 产品时回退到 404 样式消息。
 *
 * @param   {object}   props       - 路由 props。
 * @param   {Promise<{ slug: string }>} props.params - Promise，解析为路由参数。
 * @returns {Promise<JSX.Element>} 渲染后的产品详情页面。
 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // 404 回退 —— WooCommerce 中未找到产品
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  // 面包屑: Home > Products > Product Name
  const breadcrumbs = generateBreadcrumbs([
    { label: "Products", href: "/products" },
    { label: product.name },
  ]);

  // 产品 JSON-LD 结构化数据，用于 Google 富媒体搜索结果
  const schema = productSchema({
    name: product.name,
    description: product.shortDescription?.slice(0, 160) || "",
    image: product.images?.[0]?.src || null,
    sku: product.sku,
    url: `/products/${slug}`,
  });

  // 从简短描述 HTML 中解析功能要点
  const features = product.shortDescription ? extractFeatures(product.shortDescription) : [];

  // 优先使用 WooCommerce 原生属性；回退到从简短描述行解析的规格
  const wcAttrs = product.attributes || [];
  const parsedSpecs = product.shortDescription ? extractSpecs(product.shortDescription) : [];
  const specs = wcAttrs.length > 0
    ? wcAttrs.map((a) => ({ label: a.name, value: a.value }))
    : parsedSpecs;

  // 产品图片数据
  const primaryImage = product.images?.[0]?.src || null;
  const galleryImages = product.gallery || [];
  const hasContent = product.description && product.description.trim().length > 0;

  // 从同一主分类获取相关产品（最多 4 个）
  let relatedProducts: Awaited<ReturnType<typeof getProducts>> = { products: [], pagination: null };
  if (product.categories.length > 0) {
    try { relatedProducts = await getProducts({ category: product.categories[0].id, perPage: 4 }); } catch { /* 静默忽略 —— 相关产品是可选的 */ }
  }

  return (
    <>
      {/* 产品 JSON-LD 结构化数据注入 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ================================================================
          面包屑栏 —— 浅色背景，导航面包屑
          ================================================================ */}
      <section className="bg-gray-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </section>

      {/* ================================================================
          产品概览 —— 双列: 图片画廊 + 产品信息
          ================================================================ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">

            {/* --- 左列: 产品图片 + 图库缩略图 --- */}
            <div>
              {primaryImage ? (
                <div className="space-y-4">
                  {/* 产品主图 —— 正方形比例卡片 */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={primaryImage}
                      alt={product.images?.[0]?.alt || product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                    />
                    {/* 分类徽章覆盖层 —— 左上角 */}
                    {product.categories[0] && (
                      <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-lg shadow-sm border border-gray-200/50">
                        {product.categories[0].name}
                      </span>
                    )}
                  </div>

                  {/* 图库缩略图 —— 5 列网格，最多 5 张图片 */}
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {galleryImages.slice(0, 5).map((img) => (
                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-200/60 cursor-pointer hover:border-gray-400 transition-colors">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.src} alt={img.alt || product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* 图片占位符 —— 当没有产品图片时显示 */
                <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-300">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
              )}
            </div>

            {/* --- 右列: 产品信息 --- */}
            <div>
              {/* 品牌标签 —— 产品品牌引用 */}
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">product brand</p>

              {/* 产品名称 */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
                {product.name}
              </h1>

              {/* 功能要点 —— 从简短描述中提取 */}
              {features.length > 0 && (
                <ul className="space-y-2.5 mb-7">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600 leading-relaxed">
                      <span className="text-gray-400 mt-1 shrink-0">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* SKU —— 等宽字体以提高可读性，如果有的话 */}
              {product.sku && (
                <p className="text-xs text-gray-400 mb-5">
                  SKU: <span className="font-mono text-gray-500">{product.sku}</span>
                </p>
              )}

              {/* CTA 按钮: "发送询价"（主要）+ "所有产品"（次要） */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Send Inquiry
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  &larr; All Products
                </Link>
              </div>

              {/* OEM/ODM 通知 —— 绿色提示，表明可进行定制 */}
              <div className="flex items-center gap-2.5 p-4 bg-green-50 rounded-xl border border-green-100">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700">
                  Available for OEM/ODM — wholesale pricing upon request
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          规格表 —— 结构化的键值对或自由文本行
          优先使用 WooCommerce attributes，否则使用解析的规格数据。
          ================================================================ */}
      {specs.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Specifications</h2>
            <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      {spec.label ? (
                        /* 带 label + value 列的行 */
                        <>
                          <td className="w-[35%] px-6 py-3.5 text-sm font-medium text-gray-500 bg-gray-50/50 border-r border-gray-100">
                            {spec.label}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-gray-900">{spec.value}</td>
                        </>
                      ) : (
                        /* 无标签全宽值行 —— 自由文本规格行 */
                        <td colSpan={2} className="px-6 py-3.5 text-sm text-gray-900">{spec.value}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          产品标签 —— 规格下方的药丸样式标签列表
          ================================================================ */}
      {product.tags.length > 0 && (
        <section className="py-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag.id} className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200/60">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          产品亮点 / 完整描述 —— 渲染 WooCommerce HTML
          仅当描述字段包含有意义的内容时显示。
          ================================================================ */}
      {hasContent && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Product Highlights</h2>
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </section>
      )}

      {/* ================================================================
          相关产品 —— 同一分类下最多 4 个产品
          当前产品被过滤掉。仅当分类中存在 > 1 个产品时显示
          （即至少有一个相关产品）。
          ================================================================ */}
      {relatedProducts.products.length > 1 && (
        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.products
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
