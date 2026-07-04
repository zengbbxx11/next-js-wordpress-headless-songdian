/**
 * 联系 + 询盘合并页面
 *
 * @file       app/contact/page.tsx
 * @page       /contact
 * @dataSource 静态站点数据（来自 lib/content-data 的 COMPANY, INQUIRY_GUIDE）。
 *              无 WordPress 或 WooCommerce 依赖 —— 内容为硬编码，维护在源码仓库中。
 * @strategy   ISR（增量静态再生），revalidate: 3600。
 *              页面在构建时预渲染，每小时重新验证一次。
 *              Google 地图嵌入在客户端延迟加载。
 * @seo        - 静态 Metadata 用于 title/description/canonical。
 *              - LocalBusiness JSON-LD 结构化数据通过 localBusinessSchema() 注入。
 *              - 面包屑结构化数据通过 generateBreadcrumbs() 生成。
 *
 * 用途：
 * 同时作为联系页面和询盘提交页面。
 * 左列显示公司联系详情（地址、邮箱、电话、工作时间）以及询盘编写指南。
 * 右列渲染 InquiryForm 组件用于潜在客户表单提交。
 * 底部显示带公司位置的 Google 地图嵌入。
 */

import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import InquiryForm from "@/components/form/InquiryForm";
import { generateBreadcrumbs, localBusinessSchema } from "@/lib/seo";
import { COMPANY, INQUIRY_GUIDE } from "@/lib/content-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// SEO 元数据 —— 使用 next-super-meta 生成此页面的标题、描述和 canonical URL。
// ---------------------------------------------------------------------------
export const metadata = await superMeta({
  title: "Contact Us",
  description: `Get in touch with ${COMPANY.name}. Request a quote for OEM/ODM camera manufacturing — our team responds within 24 hours.`,
  url: "/contact",
});

// ISR 重新验证：Next.js 最多每小时重新生成一次此页面。
export const revalidate = 3600;

/**
 * ContactPage —— /contact 路由的默认导出页面组件。
 *
 * 渲染一个单页的联系 + 询盘体验，包括：
 * - 深色 Hero 区域，带面包屑和标题
 * - 双列布局：联系信息（左）/ 询盘表单（右）
 * - Google 地图嵌入，显示公司位置
 * - LocalBusiness JSON-LD 结构化数据，用于 SEO
 *
 * @returns {JSX.Element} 渲染后的联系页面。
 */
export default function ContactPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "Contact" }]);
  const businessSchema = localBusinessSchema();

  return (
    <>
      {/* 注入 LocalBusiness 结构化数据，用于 Google 富媒体搜索结果 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* ================================================================
          Hero 区域 —— 深色背景、面包屑和标题
          ================================================================ */}
      <section className="bg-gray-950 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* 面包屑导航 —— 深色变体以在 bg-gray-950 上提供对比度 */}
          <Breadcrumbs items={breadcrumbs} variant="dark" />
          <div className="max-w-3xl mt-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              Have a camera project in mind? Fill out the form and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          主要内容 —— 双列布局
          左侧：联系信息 + 询盘指南
          右侧：InquiryForm 组件用于潜在客户表单提交
          ================================================================ */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

            {/* ----------------------------------------------------------
                左列 —— 在大屏幕上跨越 5 列中的 2 列
                包含联系详情和询盘编写指南。
                ---------------------------------------------------------- */}
            <div className="lg:col-span-2">
              {/* --- 联系信息卡片 --- */}
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Contact Information</h2>

              <Card className="mb-8 border-gray-200/70 shadow-sm">
                <CardContent className="space-y-5 pt-(--card-spacing)">
                  {/* 地址 */}
                  <div className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">Address</Badge>
                      <p className="text-sm text-gray-500 leading-relaxed">{COMPANY.contact.address}</p>
                    </div>
                  </div>

                  {/* 邮箱 */}
                  <div className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">Email</Badge>
                      <a href={`mailto:${COMPANY.contact.email}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors block">
                        {COMPANY.contact.email}
                      </a>
                      <a href={`mailto:${COMPANY.contact.emailAlt}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors mt-0.5 block">
                        {COMPANY.contact.emailAlt}
                      </a>
                    </div>
                  </div>

                  {/* 电话 / WhatsApp */}
                  <div className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">Phone / WhatsApp</Badge>
                      <p className="text-sm text-gray-500">Phone: {COMPANY.contact.phone}</p>
                      <p className="text-sm text-gray-500 mt-0.5">WhatsApp: {COMPANY.contact.whatsapp}</p>
                    </div>
                  </div>

                  {/* 工作时间 */}
                  <div className="flex gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">Business Hours</Badge>
                      <p className="text-sm text-gray-500">{COMPANY.contact.hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* --- 询盘指南 —— 帮助用户编写更好的询盘信息 --- */}
              <Card className="bg-gray-50 border-gray-200/50 shadow-sm">
                <CardContent>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">What to Include</h3>
                  <ul className="space-y-2.5">
                    {INQUIRY_GUIDE.map((item) => (
                      <li key={item.title} className="flex gap-2.5 text-sm">
                        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <span className="text-gray-700 font-medium">{item.title}</span>
                          <span className="text-gray-400 ml-1">— {item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* ----------------------------------------------------------
                右列 —— 跨越 5 列中的 3 列
                InquiryForm 用于潜在客户表单提交（姓名、邮箱、留言等）
                ---------------------------------------------------------- */}
            <div className="lg:col-span-3">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          Google 地图嵌入 —— 公司位置可视化展示
          灰度滤镜以保持品牌美学，iframe 延迟加载。
          ================================================================ */}
      <section className="py-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-gray-200 border border-gray-300/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690!2d113.85!3d22.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzQ4LjAiTiAxMTPCsDUxJzAwLjAiRQ!5e0!3m2!1sen!2scn!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
              className="grayscale"
            />
          </div>
        </div>
      </section>
    </>
  );
}
