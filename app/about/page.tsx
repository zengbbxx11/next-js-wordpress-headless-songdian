/*
 * 文件：app/about/page.tsx（关于我们 / About）
 * 职责：企业介绍页，展示品牌故事、发展时间线、价值观、研发实力、认证资质与工厂视频。
 * 数据来源：本地常量 ABOUT、COMPANY（@/lib/content-data）；不请求 WP REST API。
 * 渲染方式：静态生成 + ISR（revalidate = 3600 秒）。
 * 是否含 client 组件：是 —— AnimatedCounter、HorizontalTimeline、FactoryVideo 为客户端组件。
 */

import { superMeta } from "next-super-meta";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import SectionHeading from "@/components/SectionHeading";
import FactoryVideo from "@/components/FactoryVideo";
import { MEDIA } from "@/lib/media";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY, ABOUT } from "@/lib/content-data";

export const metadata = await superMeta({
  title: "About Us",
  description: `Learn about ${COMPANY.name} — a leading OEM/ODM digital camera manufacturer with 15+ years of experience, serving brands in 50+ countries worldwide.`,
  url: "/about",
});

// ISR 重新验证间隔（秒）：静态内容每小时刷新一次
export const revalidate = 3600;

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "About" }]);

  return (
    <>
      {/* 区块 1 —— 仅含面包屑 */}
      <section className="py-5" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
        </div>
      </section>

      {/* 区块 2+3 —— 品牌故事 + 数据统计（合并） */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* 左栏 —— 品牌故事 */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#d4343e" }}>
                Who We Are
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">
                {ABOUT.story.title}
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                {ABOUT.story.content.map((p, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-[16px] md:text-[17px] text-gray-700 leading-relaxed"
                        : "text-[15px] md:text-base"
                    }
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* 右栏 —— 紧凑数据统计条（细线网格，无卡片） */}
            {/* lg 以上用左侧细竖线 + 左内边距，与左栏品牌故事形成「两栏一体」的视觉关系 */}
            <div className="lg:col-span-5 lg:border-l lg:border-[#EEEEEE] lg:pl-16">
              {/* 与左栏 "Who We Are" 呼应的小标题，建立左右两栏的对称节奏 */}
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#d4343e" }}>
                By the Numbers
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-10">
                {ABOUT.stats.map((stat, idx) => (
                  <div
                    key={stat.label}
                    className={
                      idx === 0
                        ? "border-t-2 pt-4" /* 首项焦点：品牌红加粗细线 */
                        : "border-t border-[#E5E5E5] pt-4"
                    }
                    style={idx === 0 ? { borderTopColor: "#d4343e" } : undefined}
                  >
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      format={stat.format}
                      className="text-3xl md:text-4xl"
                    />
                    <p
                      className="text-xs mt-2 font-medium uppercase tracking-wide"
                      style={{ color: "#5C5E62" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 区块 4 —— 发展历程 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading className="mb-14">Our Journey</SectionHeading>
          <HorizontalTimeline items={ABOUT.timeline} />
        </div>
      </section>

      {/* 区块 5 —— 企业价值观 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading className="mb-12">Our Values</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT.values.map((v) => (
              <div key={v.title} className="p-8 border border-[#EEEEEE] hover:border-[#D0D1D2] transition-colors" style={{ borderRadius: "12px", transitionDuration: "0.33s" }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5C5E62" }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 区块 6 —— 研发实力 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">{ABOUT.rd.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-10">{ABOUT.rd.content}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ABOUT.rd.highlights.map((h) => (
              <div key={h.label} className="bg-white p-5 border border-[#EEEEEE] text-center" style={{ borderRadius: "12px" }}>
                <div className="text-xl font-bold text-gray-900">{h.value}</div>
                <div className="text-xs mt-1" style={{ color: "#5C5E62" }}>{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 区块 7 —— 资质认证 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading className="mb-12">Certifications &amp; Compliance</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ABOUT.certifications.map((cert) => (
              <div key={cert.name} className="p-6 border border-[#EEEEEE] text-center hover:border-[#D0D1D2] transition-colors" style={{ borderRadius: "12px", transitionDuration: "0.33s" }}>
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 flex items-center justify-center" style={{ borderRadius: "12px" }}>
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{cert.name}</div>
                <div className="text-xs" style={{ color: "#5C5E62" }}>{cert.description}</div>
                <div className="text-[11px] mt-2" style={{ color: "#8E8E8E" }}>Since {cert.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 区块 —— 工厂视频（位于 CTA 之前） */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeading className="mb-10">{ABOUT.factory.title}</SectionHeading>
          <FactoryVideo
            src={MEDIA.factoryVideo}
            label="Play Songdian factory tour video"
          />
          <p
            className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed"
            style={{ color: "#5C5E62" }}
          >
            {ABOUT.factory.caption}
          </p>
        </div>
      </section>

      {/* 区块 8 —— 行动号召（电光蓝） */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-white tracking-tight mb-4" style={{ fontSize: "30px", fontWeight: 500, color: "#FFFFFF" }}>
            Ready to Partner With Us?
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: "#8E8E8E" }}>
            Let&apos;s discuss your camera project and explore how we can bring your vision to market.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 text-white text-sm font-medium rounded transition-colors bg-[#3E6AE1] hover:bg-[#3561CC]"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
              height: "44px",
              borderRadius: "4px",
              transitionDuration: "0.33s",
            }}
          >
            Get in Touch
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
