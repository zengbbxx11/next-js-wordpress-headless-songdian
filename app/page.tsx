/*
 * 文件：app/page.tsx（首页 / Homepage）
 * 职责：网站首页，聚合展示信任条、精选产品、核心优势与最新资讯，并引导询盘。
 * 数据来源（WP REST API）：
 *   - getPosts()            → WP 文章（新闻）列表
 *   - getProducts()         → WP 产品列表（经 WP REST API，无需 WooCommerce Key）
 *   - getProductCategories()→ WP 产品分类
 *   - getSiteBanner()       → WP 站点 Banner 图
 * 渲染方式：Async Server Component + ISR（revalidate = 60 秒）。
 * 是否含 client 组件：是 —— HeroSection、AnimatedSection、ProductCard、PostCard 为客户端动效组件。
 *
 * 页面区块（Section）：
 *   1. 首屏 Hero   2. 信任条 Trust Strip
 *   3. 精选产品 Featured Products   4. 核心优势 Why Choose Us
 *   5. 全球 ODM 合作伙伴 Global ODM Partners   6. 最新资讯 Latest News
 *   7. 行动号召 CTA
 */

import Link from "next/link";
import Image from "next/image";
import { getPosts, getProducts, getSiteBanner, getProductCategories } from "@/lib/wordpress";
import NewsGrid from "@/components/NewsGrid";
import HeroSection from "@/components/motion/HeroSection";
import AnimatedSection from "@/components/motion/AnimatedSection";
import ExhibitionMarquee from "@/components/ExhibitionMarquee";
import { getExhibitions } from "@/lib/exhibitions";
import { ShieldCheck, ArrowRight, Camera, Award, Zap, Factory, Lightbulb, Globe, Package, type LucideIcon } from "lucide-react";
import { superMeta } from "next-super-meta";
import { STRENGTHS, COMPANY, GLOBAL_ODM, TRUST_CERTS, CATEGORY_SHOWCASE } from "@/lib/content-data";
import { MEDIA } from "@/lib/media";
import type { WCProductCategory } from "@/lib/types";

// 核心优势图标映射 —— 与 content-data.ts 中 STRENGTHS[].icon 字段对应
const STRENGTH_ICONS: Record<string, LucideIcon> = {
  award: Award,
  zap: Zap,
  factory: Factory,
  lightbulb: Lightbulb,
  globe: Globe,
  package: Package,
};

export const metadata = await superMeta({
  title: `${COMPANY.tagline} — OEM / ODM Digital Camera Factory`,
  description: COMPANY.description,
  url: "/",
});

// ISR 重新验证间隔（秒）：每 60 秒重新生成首页，平衡内容实时性与性能
export const revalidate = 60;

export default async function HomePage() {
  const [{ posts }, categories, bannerUrl] = await Promise.all([
    getPosts({ perPage: 3 }),
    getProductCategories().catch(() => []),
    getSiteBanner(),
  ]);

  // 从每个类目各取最新 1 个产品图（mirrorless, compact, action, video, kids）
  const categoryOrder = ["mirrorless", "compact", "action", "video", "kids"] as const;
  const sortedCategories = categoryOrder
    .map((slug) => categories.find((c) => c.slug.toLowerCase().includes(slug)))
    .filter((c): c is WCProductCategory => Boolean(c));

  const categoryProducts = await Promise.all(
    sortedCategories.map((cat) =>
      getProducts({ category: cat.id, perPage: 1 }).catch(() => ({ products: [], pagination: null }))
    )
  );

  // 组装首页类目展示卡片：类目标签 + 该类目下最新产品图片
  const categoryCards = sortedCategories.map((cat, i) => ({
    category: cat,
    meta: CATEGORY_SHOWCASE[categoryOrder[i]] ?? { name: cat.name, description: "" },
    product: categoryProducts[i]?.products?.[0] ?? null,
  }));

  // 动态读取 public/Exhibitions 下的展会图片（增删改自动同步，ISR 60s 再生）
  const exhibitions = getExhibitions();

  return (
    <>
      {/* 区块 1 — 首屏 Hero */}
      <HeroSection bannerUrl={bannerUrl || undefined} />

      {/* 区块 2 — 信任条 Trust Strip：认证标识墙 */}
      <section className="py-6 border-b" style={{ borderColor: "#EEEEEE", backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-6">
          <ul className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {TRUST_CERTS.map((cert) => (
              <li
                key={cert.code}
                className="flex items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-2 transition-colors"
                style={{ borderColor: "#E5E7EB" }}
                title={cert.full}
              >
                <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: "#d4343e" }} aria-hidden="true" />
                <span className="text-sm font-medium" style={{ color: "#393C41" }}>{cert.code}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 区块 3 — 产品类目展示 Product Categories */}
      {categoryCards.length > 0 && (
        <AnimatedSection>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>Product Categories</span>
                <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Cameras We Manufacture</h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center text-sm font-medium transition-colors hover:text-[#d4343e]" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:flex lg:h-[460px] lg:gap-4">
              {categoryCards.map(({ category, meta, product }, i) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative block overflow-hidden bg-[#171A20] aspect-[3/4] animate-fade-in-up transition-[flex-grow] duration-500 ease-out lg:aspect-auto lg:h-full lg:min-w-0 lg:flex-1 lg:contain-layout lg:hover:flex-[2.7]"
                  style={{ animationDelay: `${i * 80}ms`, borderRadius: "12px" }}
                  aria-label={`${meta.name} — view products`}
                >
                  {product?.image ? (
                    <Image
                      src={product.image}
                      alt={product.imageAlt || meta.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] will-change-transform transform-gpu"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}

                  {/* 渐变遮罩 — 保证文字可读 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* 类目标题（默认显示，带序号）+ 说明/CTA（展开后显示） */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold tabular-nums" style={{ color: "#d4343e" }} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-semibold leading-snug">{meta.name}</h3>
                    </div>
                    <div className="overflow-hidden max-h-0 opacity-0 transition-all duration-500 ease-out group-hover:delay-500 group-hover:max-h-28 group-hover:opacity-100">
                      <p className="mt-2 text-[12px] leading-snug text-white/80 line-clamp-2">{meta.description}</p>
                      <span className="mt-2 inline-flex items-center text-[12px] font-medium text-white/90">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/products" className="inline-flex items-center text-sm font-medium transition-colors hover:text-[#d4343e]" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
                View All Products <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
        </AnimatedSection>
      )}

      {/* 区块 4 — 核心优势 Why Choose Us（重设计：图标卡片 + 品牌红悬停态） */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>Why Choose Us</span>
            <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Manufacturing Excellence</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STRENGTHS.map((item, i) => {
              const Icon = STRENGTH_ICONS[item.icon] ?? ShieldCheck;
              return (
                <div
                  key={item.title}
                  className="group relative flex flex-col p-7 border border-[#EEEEEE] bg-white rounded-xl transition-colors duration-300 hover:border-[#d4343e] animate-fade-in-up"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  {/* 品牌红图标方块：悬停反白，强化视觉焦点 */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d4343e]/10 text-[#d4343e] transition-colors duration-300 group-hover:bg-[#d4343e] group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-[#171A20]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C5E62]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 区块 5 — 全球 ODM 合作伙伴 Global ODM Partners */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* 品牌红 eyebrow + 标题 */}
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: "#d4343e" }}>
            {GLOBAL_ODM.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
            {GLOBAL_ODM.title}
          </h2>
          <div className="mb-8 max-w-2xl">
            <p className="text-lg font-semibold text-gray-900 leading-snug">
              {GLOBAL_ODM.tagline}
            </p>
            <p className="text-base font-medium mt-1" style={{ color: "#5C5E62" }}>
              {GLOBAL_ODM.taglineSecondary}
            </p>
          </div>

          {/* 全球出口网络 + 合作品牌 Logo 墙大图 */}
          <div
            className="relative overflow-hidden border border-[#EEEEEE]"
            style={{ borderRadius: "12px" }}
          >
            <Image
              src={MEDIA.globalOdmPartners}
              alt="Global export network map showing shipments from China to 60+ countries, with internationally renowned imaging brand ODM partner logos including Konica Minolta, Kenko, Rollei, YASHICA, aiwa, ILFORD, B+H, Gripo, and AKITO"
              width={1200}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* 出口国家/地区说明文字 */}
          <p
            className="mt-6 text-sm leading-relaxed max-w-3xl mx-auto text-center"
            style={{ color: "#5C5E62" }}
          >
            {GLOBAL_ODM.exportDescription}
          </p>

          {/* 合作品牌标签云（纯文字，增强 SEO 与可访问性） */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {GLOBAL_ODM.brands.map((brand) => (
              <span
                key={brand}
                className="text-[13px] font-medium px-3 py-1 bg-white border border-[#EEEEEE]"
                style={{
                  borderRadius: "6px",
                  color: "#393C41",
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 区块 5.5 — 参展展会 Exhibition Marquee（位于 Global Reach 与 News & Insights 之间） */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white border-y border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#d4343e" }}>Global Presence</span>
            <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Exhibitions &amp; Trade Shows</h2>
            <p className="mt-3 text-base font-medium mx-auto max-w-2xl" style={{ color: "#5C5E62" }}>
              We showcase our latest OEM / ODM camera innovations at leading industry events worldwide.
            </p>
          </div>

          {exhibitions.length > 0 ? (
            <ExhibitionMarquee items={exhibitions} />
          ) : (
            <div className="text-center py-12 text-[#8E8E8E] border border-[#EEEEEE] rounded-xl">
              <p className="text-sm">No exhibition photos uploaded yet. Add images to <code className="px-1.5 py-0.5 bg-[#F4F4F4] rounded text-[#393C41]">/public/Exhibitions</code>.</p>
            </div>
          )}
        </div>
      </section>
      </AnimatedSection>

      {/* 区块 6 — 最新资讯 Latest News */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>News &amp; Insights</span>
              <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Latest Updates</h2>
            </div>
            <Link href="/news" className="hidden md:inline-flex items-center text-sm font-medium transition-colors" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
              View All <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          </AnimatedSection>

          {posts.length > 0 ? (
            <NewsGrid posts={posts} />
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white border border-[#EEEEEE]" style={{ borderRadius: "12px" }}>
              <p className="text-sm">No articles published yet. Add posts in your WordPress admin panel.</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/news" className="inline-flex items-center text-sm font-medium transition-colors" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
              View All News <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 区块 7 — 行动号召 CTA */}
      <AnimatedSection>
      <section className="py-16 md:py-24" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-white tracking-tight mb-4" style={{ fontSize: "30px", fontWeight: 500, color: "#FFFFFF" }}>
            Ready to Start Your Camera Project?
          </h2>
          <p className="max-w-lg mx-auto mb-8" style={{ color: "#8E8E8E" }}>
            Whether you need OEM manufacturing or full ODM product development, our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
              Send an Inquiry <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 text-sm font-medium rounded transition-colors bg-transparent hover:bg-white/10"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                height: "44px",
                borderRadius: "4px",
                border: "1px solid rgba(255,255,255,0.2)",
                transitionDuration: "0.33s",
              }}
            >
              About Us
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </>
  );
}
