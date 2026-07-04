/**
 * FAQ（常见问题）页面
 *
 * @file       app/services/faq/page.tsx
 * @page       /services/faq
 * @dataSource 静态站点数据 —— FAQS 数组来自 lib/content-data。
 *              内容在代码库中硬编码维护。
 *              不依赖 WordPress 或 WooCommerce。
 * @strategy   ISR（增量静态再生），revalidate: 3600。
 *              FAQ 内容是静态的 —— 仅通过代码部署更新。
 *              重新验证最多每小时运行一次。
 * @seo        - 静态 Metadata，包含 title/description/canonical。
 *              - FAQPage JSON-LD schema 通过 faqSchema() 生成，用于 Google 富媒体搜索结果。
 *              - BreadcrumbList: Home > Services > FAQ。
 *
 * 布局：
 * - 深色 hero 区域，包含面包屑、标题和副标题
 * - FAQ 分类以可折叠的 <details> 元素渲染，
 *   按类别分组（订购、定制、质量等），
 *   展开时带旋转箭头图标
 */

import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateBreadcrumbs, faqSchema } from "@/lib/seo";
import { FAQS } from "@/lib/content-data";

// ---------------------------------------------------------------------------
// SEO 元数据 —— 使用 next-super-meta 生成
// ---------------------------------------------------------------------------
export const metadata = await superMeta({
  title: "FAQ",
  description: "Frequently asked questions about our OEM/ODM camera manufacturing services, MOQ, pricing, customization, quality control, shipping, and after-sales support.",
  url: "/services/faq",
});

// ISR: 最多每小时重新验证一次此静态页面。
export const revalidate = 3600;

/**
 * FAQPage —— /services/faq 路由的默认导出页面组件。
 *
 * 渲染分类的 FAQ 页面，使用原生 HTML <details>/<summary>
 * 元素显示可折叠的问答对。每个分类是一个带标题的区域；
 * 每个问题是一个可展开的样式卡片。
 * 注入 FAQPage JSON-LD 结构化数据，用于 Google 富媒体搜索结果。
 *
 * @returns {JSX.Element} 渲染后的 FAQ 页面。
 */
export default function FAQPage() {
  // 面包屑: Home > Services > FAQ（最后一项为当前页面）
  const breadcrumbs = generateBreadcrumbs([
    { label: "Services", href: "/services" },
    { label: "FAQ" },
  ]);

  // 展平所有分类中的 FAQ 条目，用于 JSON-LD schema
  const allFaqs = FAQS.flatMap((c) => [...c.items]);
  const schema = faqSchema(allFaqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      {/* FAQPage JSON-LD 结构化数据 —— 启用 Google 搜索中的富媒体结果 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ================================================================
          Hero 区域 —— 深色背景，面包屑，标题，副标题
          ================================================================ */}
      <section className="bg-gray-950 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            {/* 面包屑导航 —— 深色变体，用于 bg-gray-950 */}
            <Breadcrumbs items={breadcrumbs} variant="dark" />
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-6 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              Everything you need to know about working with {""}
              OptimaLens — from ordering and customization to quality and shipping.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ 分类 —— 可折叠的问答手风琴组
          每个分类有一个标题和 <details> 元素的垂直列表，
          展开后显示答案。
          ================================================================ */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-12">
            {FAQS.map((category) => (
              <div key={category.category}>
                {/* 分类标题，带底部分隔线 */}
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                  {category.category}
                </h2>

                {/* FAQ 条目 —— 每个都是可折叠的 <details> 卡片 */}
                <div className="space-y-3">
                  {category.items.map((faq) => (
                    <details
                      key={faq.question}
                      className="group bg-gray-50 rounded-2xl border border-gray-200/70 overflow-hidden hover:border-gray-300 transition-colors"
                    >
                      {/* Summary = 问题行，右侧带箭头图标 */}
                      <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors">
                        {faq.question}
                        {/* 箭头在打开时旋转 180 度（group-open） */}
                        <svg
                          className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      {/* 答案内容 —— 在 details 展开时显示 */}
                      <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
