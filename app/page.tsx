/**
 * Homepage — Songdian Technology B2B Digital Camera Manufacturer
 * ------------------------------------------------------------------
 * The primary landing page for the corporate website. This is an async
 * Server Component that fetches WordPress posts and WooCommerce products
 * at request time (ISR, revalidate every 60s).
 *
 * Sections (top → bottom):
 *   1. Hero              — dark full-width hero with badge, headline, dual CTAs
 *   2. Trust Strip       — key stats bar (ISO cert, capacity, countries, patents)
 *   3. Product Categories — 6-column grid of camera types with icons
 *   4. Featured Products  — WooCommerce product cards (conditional, 6 items)
 *   5. Why Choose Us     — 3 strength cards in a responsive grid
 *   6. Latest News        — 3 WordPress posts via PostCard, with fallback empty state
 *   7. CTA               — dark section with "Send an Inquiry" + "About Us" links
 *
 * Data sources:
 *   - lib/wordpress.ts    → getPosts(), getProducts()  (headless WP / WooCommerce)
 *   - lib/content-data.ts → HERO, TRUST_ITEMS, PRODUCT_CATEGORIES, STRENGTHS, COMPANY
 *
 * Revalidation: ISR at 60s (posts/products update within 1 minute without full rebuild)
 */

import Link from "next/link";
import { getPosts, getProducts } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/motion/HeroSection";
import AnimatedSection from "@/components/motion/AnimatedSection";
import { superMeta } from "next-super-meta";
import { PRODUCT_CATEGORIES, STRENGTHS, COMPANY } from "@/lib/content-data";

/** 页面 Metadata —— 使用 next-super-meta 生成标题和 SEO 标签 */
export const metadata = await superMeta({
  title: `${COMPANY.tagline} — OEM / ODM Digital Camera Factory`,
  description: COMPANY.description,
  url: "/",
});

/** ISR: regenerate this page at most once every 60 seconds */
export const revalidate = 60;

/**
 * HomePage — async RSC that fetches posts + products in parallel,
 * then renders the full homepage layout with 7 content sections.
 */
export default async function HomePage() {
  // Fetch WordPress posts (latest 3) and WooCommerce featured products (up to 6) in parallel
  const [{ posts }, { products }] = await Promise.all([
    getPosts({ perPage: 3 }),
    // Gracefully degrade if WooCommerce is not installed — return empty array
    getProducts({ perPage: 6, featured: true }).catch(() => ({ products: [], pagination: null })),
  ]);

  // Determine whether WooCommerce is available (products returned)
  const hasWooCommerce = products.length > 0;

  return (
    <>
      {/* ================================================================
          Section 1 — Hero
          Client-side animated hero with SMT production line banner.
          Uses framer-motion for staggered entrance animations with
          prefers-reduced-motion support.
          ================================================================ */}
      <HeroSection />

      {/* ================================================================
          Section 2 — Trust Strip
          Horizontal stat bar showing key company metrics.
          Separators hidden on mobile via `hidden sm:block`.
          ================================================================ */}
      <section className="py-10 border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">ISO 9001 Certified</span>
            <span className="hidden sm:block text-gray-200">|</span>
            <span className="flex items-center gap-2">8,000 Units/Day Capacity</span>
            <span className="hidden sm:block text-gray-200">|</span>
            <span className="flex items-center gap-2">50+ Countries Served</span>
            <span className="hidden sm:block text-gray-200">|</span>
            <span className="flex items-center gap-2">500+ Patents</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          Section 3 — Product Categories
          ================================================================ */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header — centered */}
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Our Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              Camera Product Categories
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              We design and manufacture a wide range of digital cameras for global brands
            </p>
          </div>
          {/* Responsive grid: 2 cols on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="group flex flex-col items-center p-6 rounded-2xl border border-gray-200/80 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 text-center"
              >
                {/* Placeholder icon container — styled as a small rounded square */}
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors" />
                {/* Category name */}
                <span className="text-sm font-medium text-gray-900 mb-1">{cat.name}</span>
                {/* Truncated description (first 50 chars) */}
                <span className="text-[11px] text-gray-400 leading-snug">{cat.description.slice(0, 50)}...</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* ================================================================
          Section 4 — Featured Products (WooCommerce)
          ================================================================ */}
      {hasWooCommerce && (
        <AnimatedSection>
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section header with "View All" link aligned to the right */}
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured Products</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Our Camera Lineup</h2>
              </div>
              {/* Desktop "View All" link (hidden on mobile) */}
              <Link href="/products" className="hidden md:inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                View All <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            {/* Product grid: 2 cols mobile → 6 cols desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {products.slice(0, 6).map((p, i) => (
                // Each product card animates in with incremental delay for staggered effect
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            {/* Mobile "View All" link — only visible on small screens */}
            <div className="mt-8 text-center md:hidden">
              <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                View All Products <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
        </AnimatedSection>
      )}

      {/* ================================================================
          Section 5 — Why Choose Us
          3-column grid of strength cards highlighting manufacturing advantages.
          Cards animate in with staggered delays.
          ================================================================ */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header — centered */}
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Manufacturing Excellence</h2>
          </div>
          {/* Strength cards: 1 col mobile → 3 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STRENGTHS.map((item, i) => (
              <div key={item.title} className="p-6 rounded-2xl border border-gray-200/70 hover:border-gray-300 hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* ================================================================
          Section 6 — Latest News (WordPress Blog)
          ================================================================ */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header with desktop "View All" link */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">News &amp; Insights</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Latest Updates</h2>
            </div>
            {/* Desktop "View All" → /news */}
            <Link href="/news" className="hidden md:inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              View All <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {/* Conditional: render posts or empty-state placeholder */}
          {posts.length > 0 ? (
            /* Posts grid: 1 col mobile → 3 cols desktop with staggered animation */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state — shown when no WordPress posts are published */
            <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm">No articles published yet. Add posts in your WordPress admin panel.</p>
            </div>
          )}

          {/* Mobile "View All" link — visible only on small screens */}
          <div className="mt-8 text-center md:hidden">
            <Link href="/news" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              View All News <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* ================================================================
          Section 7 — Call-to-Action (Bottom)
          ================================================================ */}
      <AnimatedSection>
      <section className="py-16 md:py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to Start Your Camera Project?
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Whether you need OEM manufacturing or full ODM product development, our team is ready to help.
          </p>
          {/* Dual CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Primary: "Send an Inquiry" → /contact */}
            <Link href="/contact" className="inline-flex items-center px-8 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200">
              Send an Inquiry <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            {/* Secondary: "About Us" → /about */}
            <Link href="/about" className="inline-flex items-center px-8 py-3.5 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
              About Us
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </>
  );
}
