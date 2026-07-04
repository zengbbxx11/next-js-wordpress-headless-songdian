/**
 * 关于我们页面 —— 松典科技 B2B 数码相机制造商
 * ------------------------------------------------------------------
 * 静态企业"关于我们"页面，作为服务端组件渲染。
 * 请求时不获取数据 —— 所有内容来自静态 content-data 常量
 * （COMPANY, ABOUT）。ISR 设置为 3600 秒（1 小时）。
 *
 * 版块（从上到下）：
 *   1. Hero（深色）       —— 页面标题 + 副标题，搭配深色主题面包屑
 *   2. 公司数据            —— 4 列网格（年数、团队、日产量、专利）
 *   3. 我们的故事          —— 关于公司历史的叙述段落
 *   4. 发展历程            —— 带年份标记的垂直时间线
 *   5. 我们的价值观        —— 2 列卡片网格，展示价值观描述
 *   6. 研发能力            —— 叙述 + 4 列亮点网格
 *   7. 认证资质            —— 6 列认证徽章（对勾图标）
 *   8. CTA（深色）         —— "准备好与我们合作了吗？" → /contact
 *
 * 数据来源：
 *   - lib/content-data.ts → COMPANY, ABOUT（hero, story, timeline, values, rd, certs）
 *   - lib/seo.ts          → generateBreadcrumbs()
 *   - components/Breadcrumbs → 导航面包屑路径
 */

import { superMeta } from "next-super-meta";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY, ABOUT } from "@/lib/content-data";

/**
 * 页面级 Metadata —— SEO 的标题 + 描述，使用 next-super-meta 生成。
 */
export const metadata = await superMeta({
  title: "About Us",
  description: `Learn about ${COMPANY.name} — a leading OEM/ODM digital camera manufacturer with 15+ years of experience, serving brands in 50+ countries worldwide.`,
  url: "/about",
});

/** ISR: 最多每小时重新生成一次此页面 */
export const revalidate = 3600;

/**
 * AboutPage —— 渲染完整关于我们页面的静态 RSC，
 * 包含 8 个内容版块，数据来源于 ABOUT 常量。
 */
export default function AboutPage() {
  // 生成面包屑路径: Home > About
  const breadcrumbs = generateBreadcrumbs([{ label: "About" }]);

  return (
    <>
      {/* ================================================================
          版块 1 — Hero（深色）
          全宽深色 hero，含页面标题 + 副标题。
          面包屑使用 `variant="dark"` 以在深色背景上提供对比。
          ================================================================ */}
      <section className="bg-gray-950 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* 面包屑路径 —— Home > About，深色背景样式 */}
          <Breadcrumbs items={breadcrumbs} variant="dark" />
          {/* Hero 文字内容 —— 限制最大宽度为 max-w-3xl */}
          <div className="max-w-3xl mt-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              {ABOUT.hero.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              {ABOUT.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 2 — 公司数据
          4 列响应式网格，显示根据 COMPANY 数据计算的的关键指标。
          从业年限从 `COMPANY.founded` 动态计算得出。
          ================================================================ */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* 数据网格: 移动端 2 列 → 桌面端 4 列 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              // 从成立年份动态计算从业年限
              { value: `${new Date().getFullYear() - COMPANY.founded}+`, label: "Years Experience" },
              { value: COMPANY.employees, label: "Team Members" },
              { value: COMPANY.dailyOutput, label: "Daily Output" },
              { value: COMPANY.patents, label: "Patents" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-white rounded-2xl border border-gray-200/70">
                {/* 统计数值 —— 大号加粗数字 */}
                <div className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                {/* 统计标签 —— 小号淡色文字 */}
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 3 — 我们的故事
          从 ABOUT.story.content 数组渲染的长篇叙述内容。
          每个段落映射为具有一致间距的 <p> 元素。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">{ABOUT.story.title}</h2>
          {/* 故事段落 —— 垂直排列 */}
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {ABOUT.story.content.map((p, i) => (
              <p key={i} className="text-[15px] md:text-base">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 4 — 发展历程
          带左侧边框 + 圆点标记的垂直时间线。
          每个条目展示年份徽章 + 事件描述。
          使用绝对定位将圆点标记与左侧边框对齐。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">Our Journey</h2>
          {/* 时间线容器: 左边框 + 内边距为圆点留出空间 */}
          <div className="relative pl-8 border-l-2 border-gray-200 space-y-8">
            {ABOUT.timeline.map((item) => (
              <div key={item.year} className="relative">
                {/* 圆点标记 —— 绝对定位以精确覆盖左侧边框 */}
                <div className="absolute -left-[41px] top-0 w-4 h-4 bg-gray-900 rounded-full border-2 border-white ring-2 ring-gray-200" />
                {/* 年份徽章 —— 灰色背景的药丸形状 */}
                <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg inline-block mb-1.5">
                  {item.year}
                </span>
                {/* 事件描述 */}
                <p className="text-sm text-gray-500 mt-1">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 5 — 我们的价值观
          2 列卡片网格展示公司价值观。
          每张卡片包含标题 + 描述，悬停时有边框效果。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">Our Values</h2>
          {/* 价值观网格: 移动端 1 列 → 桌面端 2 列 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT.values.map((v) => (
              <div key={v.title} className="p-8 rounded-2xl border border-gray-200/70 hover:border-gray-300 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 6 — 研发能力
          关于研发实力的叙述描述，后跟 4 列
          亮点网格，展示关键指标（专利数等）。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">{ABOUT.rd.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-10">{ABOUT.rd.content}</p>
          {/* R&D 亮点: 移动端 2 列 → 桌面端 4 列 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ABOUT.rd.highlights.map((h) => (
              <div key={h.label} className="bg-white p-5 rounded-2xl border border-gray-200/70 text-center">
                {/* 亮点数值 —— 加粗数字/统计 */}
                <div className="text-xl font-bold text-gray-900">{h.value}</div>
                {/* 亮点标签 —— 小号描述文字 */}
                <div className="text-xs text-gray-500 mt-1">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 7 — 认证与合规
          6 列认证徽章网格，每项包含：
          - 灰色圆形中的对勾图标
          - 认证名称
          - 描述
          - "Since {year}" 标签
          ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-12 text-center">Certifications &amp; Compliance</h2>
          {/* 认证网格: 移动端 2 列 → 桌面端 6 列 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ABOUT.certifications.map((cert) => (
              <div key={cert.name} className="p-6 rounded-2xl border border-gray-200/70 text-center hover:border-gray-300 transition-colors">
                {/* 圆角方形容器中的对勾图标 */}
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                {/* 认证名称 */}
                <div className="text-sm font-semibold text-gray-900 mb-1">{cert.name}</div>
                {/* 简要描述 */}
                <div className="text-xs text-gray-500">{cert.description}</div>
                {/* 获得年份 */}
                <div className="text-[11px] text-gray-400 mt-2">Since {cert.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          版块 8 — CTA（底部）
          深色全宽号召行动区域，包含标题、
          描述和单个 "Get in Touch" 按钮 → /contact。
          ================================================================ */}
      <section className="py-16 md:py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Let&apos;s discuss your camera project and explore how we can bring your vision to market.
          </p>
          {/* 单个 CTA 按钮 —— 白色实心，"Get in Touch" → /contact */}
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Get in Touch
            {/* 右箭头图标 */}
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
