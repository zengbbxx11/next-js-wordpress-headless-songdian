/*
 * 文件：app/page.tsx（首页 / Homepage）
 * 职责：网站首页，聚合展示信任条、产品分类、精选产品、核心优势与最新资讯，并引导询盘。
 * 数据来源（WP REST API）：
 *   - getPosts()            → WP 文章（新闻）列表
 *   - getProducts()         → WP 产品列表（经 WP REST API，无需 WooCommerce Key）
 *   - getProductCategories()→ WP 产品分类
 *   - getSiteBanner()       → WP 站点 Banner 图
 * 渲染方式：Async Server Component + ISR（revalidate = 60 秒）。
 * 是否含 client 组件：是 —— HeroSection、AnimatedSection、ProductCard、PostCard 为客户端动效组件。
 *
 * 页面区块（Section）：
 *   1. 首屏 Hero   2. 信任条 Trust Strip   3. 产品分类 Product Categories
 *   4. 精选产品 Featured Products   5. 核心优势 Why Choose Us
 *   6. 最新资讯 Latest News   7. 行动号召 CTA
 */

import Link from "next/link";
import { getPosts, getProducts, getSiteBanner, getProductCategories } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/motion/HeroSection";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { superMeta } from "next-super-meta";
import { PRODUCT_CATEGORIES, STRENGTHS, COMPANY } from "@/lib/content-data";

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

  // 从每个分类中各取最新 1 个产品（mirrorless, compact, action, video, kids）
  const categoryOrder = ["mirrorless", "compact", "action", "video", "kids"];
  const sortedCategories = categoryOrder
    .map((slug) => categories.find((c) => c.slug.toLowerCase().includes(slug)))
    .filter(Boolean);

  const categoryProducts = await Promise.all(
    sortedCategories.map((cat) =>
      getProducts({ category: cat!.id, perPage: 1 }).catch(() => ({ products: [], pagination: null }))
    )
  );
  const products = categoryProducts.flatMap((r) => r.products).slice(0, 5);

  const hasWooCommerce = products.length > 0;

  return (
    <>
      {/* 区块 1 — 首屏 Hero */}
      <HeroSection bannerUrl={bannerUrl || undefined} />

      {/* 区块 2 — 信任条 Trust Strip */}
      <section className="py-10" style={{ borderBottom: "1px solid #EEEEEE", backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4" style={{ fontSize: "14px", color: "#5C5E62" }}>
            <span className="flex items-center gap-2">ISO 9001 Certified</span>
            <span className="hidden sm:block" style={{ color: "#EEEEEE" }}>|</span>
            <span className="flex items-center gap-2">8,000 Units/Day Capacity</span>
            <span className="hidden sm:block" style={{ color: "#EEEEEE" }}>|</span>
            <span className="flex items-center gap-2">50+ Countries Served</span>
            <span className="hidden sm:block" style={{ color: "#EEEEEE" }}>|</span>
            <span className="flex items-center gap-2">500+ Patents</span>
          </div>
        </div>
      </section>

      {/* 区块 3 — 产品分类 Product Categories */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>Our Capabilities</span>
            <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>
              Camera Product Categories
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: "#5C5E62" }}>
              We design and manufacture a wide range of digital cameras for global brands
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="group flex flex-col items-center p-6 border text-center transition-colors border-[#EEEEEE] hover:border-[#D0D1D2]"
                style={{
                  borderRadius: "12px",
                  transitionDuration: "0.33s",
                }}
              >
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mb-4 transition-colors" style={{ borderRadius: "12px" }} />
                <span className="text-sm font-medium text-gray-900 mb-1">{cat.name}</span>
                <span className="text-[11px] leading-snug" style={{ color: "#5C5E62" }}>{cat.description.slice(0, 50)}...</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 区块 4 — 精选产品 Featured Products */}
      {hasWooCommerce && (
        <AnimatedSection>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>5 Categories</span>
                <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Our Camera Lineup</h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center text-sm font-medium transition-colors" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
                View All <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link href="/products" className="inline-flex items-center text-sm font-medium transition-colors" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
                View All Products <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
        </AnimatedSection>
      )}

      {/* 区块 5 — 核心优势 Why Choose Us */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>Why Choose Us</span>
            <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Manufacturing Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STRENGTHS.map((item, i) => (
              <div
                key={item.title}
                className="p-6 border transition-colors animate-fade-in-up border-[#EEEEEE] hover:border-[#D0D1D2]"
                style={{
                  borderRadius: "12px",
                  transitionDuration: "0.33s",
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5C5E62" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 区块 6 — 最新资讯 Latest News */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#5C5E62" }}>News &amp; Insights</span>
              <h2 className="mt-2 tracking-tight" style={{ fontSize: "30px", fontWeight: 500, color: "#171A20" }}>Latest Updates</h2>
            </div>
            <Link href="/news" className="hidden md:inline-flex items-center text-sm font-medium transition-colors" style={{ color: "#393C41", transitionDuration: "0.33s" }}>
              View All <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
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
      </AnimatedSection>

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
