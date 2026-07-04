/**
 * 服务概览页面
 *
 * @file       app/services/page.tsx
 * @page       /services
 * @dataSource 静态站点数据 —— services 数组在本文件中硬编码。
 *              不依赖 WordPress 或 WooCommerce。公司信息来自 CONTENT_DATA。
 * @strategy   ISR（增量静态再生），revalidate: 3600。
 *              内容完全是静态的，仅在代码库更新时改变，
 *              因此重新验证设置为 1 小时。
 * @seo        - 静态 Metadata title/description/canonical。
 *              - 通过 generateBreadcrumbs() 生成 BreadcrumbList 结构化数据。
 *
 * 布局：
 * - 深色 hero 区域，包含面包屑、页面标题和副标题
 * - 服务网格（2x2 卡片布局）: OEM 制造、ODM 设计、
 *   品牌定制、质量保证 —— 每项包含描述和功能项目列表
 * - FAQ CTA 横幅，链接到 /services/faq
 * - 底部 InquiryForm 用于潜在客户捕获
 */

import Link from "next/link";
import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import InquiryForm from "@/components/InquiryForm";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY } from "@/lib/content-data";

// ---------------------------------------------------------------------------
// SEO 元数据 —— 使用 next-super-meta 生成
// ---------------------------------------------------------------------------
export const metadata = await superMeta({
  title: "OEM / ODM Services",
  description: `Comprehensive OEM and ODM camera manufacturing services — from industrial design and prototyping to mass production. ${COMPANY.name}.`,
  url: "/services",
});

// ISR: 最多每小时重新验证一次此静态页面。
export const revalidate = 3600;

/**
 * 服务数据 —— 每张服务卡片包含标题、描述和功能列表。
 * 硬编码的 B2B 服务内容。更新需要代码部署。
 */
const services = [
  {
    title: "OEM Manufacturing",
    desc: "Build-to-spec production. Hand us your specifications and branding — we handle BOM procurement, SMT assembly, firmware, QC, and packaging. 10 production lines, 8,000 units daily output.",
    features: [
      "Full BOM procurement and supply chain management",
      "High-precision SMT assembly across 10 production lines",
      "Custom firmware, enclosure, and retail packaging",
      "100% functional QC with detailed inspection reports",
    ],
  },
  {
    title: "ODM Design & Development",
    desc: "We design, you brand. Choose from 500+ patented camera designs or let our R&D team create custom products. 30+ new products developed annually — concept to production in 3 months.",
    features: [
      "Access to 500+ patented camera designs",
      "Industrial design, PCB layout, firmware development",
      "Rapid prototyping with 3D printing and CNC",
      "CE, FCC, RoHS compliance support",
    ],
  },
  {
    title: "Brand Customization",
    desc: "Full-spectrum branding for distributors and retailers. Custom logos, packaging, firmware UI, and user manuals — everything you need to launch your own camera brand.",
    features: [
      "Custom logo printing on camera body and lens",
      "Bespoke packaging design and branded firmware",
      "Multi-language user manual creation",
      "Low MOQ — start with 100 units",
    ],
  },
  {
    title: "Quality Assurance",
    desc: "Every camera undergoes rigorous 5-stage QC. ISO 9001 certified — IQC, IPQC, FQC, OQC with traceable components, ensuring every batch meets EU & USA standards.",
    features: [
      "IQC — Incoming material inspection",
      "IPQC — In-process quality control at each stage",
      "FQC — Full functional and burn-in testing",
      "OQC — AQL sampling inspection with reports",
    ],
  },
];

/**
 * ServicesPage —— /services 路由的默认导出页面组件。
 *
 * 渲染服务概览页面，包含深色 hero、2 列服务卡片网格、
 * FAQ 号召行动横幅和底部的询盘表单（用于潜在客户捕获）。
 *
 * @returns {JSX.Element} 渲染后的服务页面。
 */
export default function ServicesPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "Services" }]);

  return (
    <>
      {/* ================================================================
          Hero 区域 —— 深色背景，包含面包屑和标题
          ================================================================ */}
      <section className="bg-gray-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
          <div className="max-w-3xl mt-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              OEM / ODM Camera Manufacturing
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              End-to-end solutions for brands and distributors worldwide. From concept to delivery — we build cameras that perform.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          服务网格 —— 桌面端 2x2 卡片布局
          每张卡片: 标题、描述段落、4 项功能列表（带对勾图标）。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s) => (
              <div key={s.title} className="p-8 rounded-2xl border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                {/* 服务标题 */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                {/* 服务描述 */}
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{s.desc}</p>
                {/* 功能项目列表，带对勾图标 */}
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ CTA 横幅 —— 鼓励访客查看 FAQ 页面
          ================================================================ */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Have Questions?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Find answers about ordering, customization, quality, and shipping in our FAQ.
          </p>
          <Link
            href="/services/faq"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            View FAQ
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ================================================================
          询盘表单 —— 页面底部的潜在客户捕获
          ================================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
