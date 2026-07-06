/**
 * RootLayout — Songdian Technology B2B Website
 * ------------------------------------------------------------------
 * Next.js App Router root layout that wraps every page on the site.
 * Provides:
 *   - Font loading (Geist Sans + Geist Mono from next/font)
 *   - Global Metadata & Open Graph for SEO (search engines / social sharing)
 *   - Twitter Card metadata for social previews on X / Twitter
 *   - JSON-LD structured data (Organization + WebSite schemas)
 *   - Persistent UI shell: Header, main content area, Footer
 *   - FloatingInquiry quick-contact widget visible on all pages
 *   - Google Analytics scaffolding (commented-out GA4 snippet)
 *   - Robots directives allowing full indexing / crawling
 *   - Canonical URL via `alternates` for duplicate-content avoidance
 *   - Tailwind CSS v4 + custom theme variables via globals.css
 *
 * Dependencies:
 *   - lib/content-data.ts        → COMPANY constants (name, tagline, description)
 *   - lib/seo.ts                 → organizationSchema(), webSiteSchema()
 *   - components/Header.tsx       → site-wide header + navigation
 *   - components/Footer.tsx       → site-wide footer
 *   - components/FloatingInquiry  → floating inquiry button / form
 */

import type { Metadata } from "next";
import { initSuperMeta } from "next-super-meta";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingInquiry from "@/components/FloatingInquiry";
import { COMPANY } from "@/lib/content-data";
import { MEDIA } from "@/lib/media";
import { organizationSchema, webSiteSchema } from "@/lib/seo";
import "./globals.css";

// 初始化 next-super-meta 全局配置
initSuperMeta({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultImage: MEDIA.ogImage,
});

// ------------------------------------------------------------------
// Font configuration — self-hosted via next/font (no external requests)
// ------------------------------------------------------------------

/** Geist Sans — primary body / heading font, loaded with Latin subset */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Geist Mono — monospace font for code / technical content */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ------------------------------------------------------------------
// Site URL — used for canonical links, OG images, and JSON-LD @id
// ------------------------------------------------------------------

/** Canonical base URL of the site; override via NEXT_PUBLIC_SITE_URL env var */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Global Metadata object exported for every page.
 * Child pages can extend or override individual fields via their own `metadata` export.
 * Includes Open Graph, Twitter Card, robots, and alternates for SEO best practices.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Page title: "Songdian Technology — OEM / ODM Digital Camera Manufacturer"
  title: {
    default: `${COMPANY.name} — ${COMPANY.tagline}`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,

  // SEO keywords targeting B2B camera manufacturing buyers
  keywords: [
    "digital camera manufacturer",
    "OEM camera factory",
    "ODM camera supplier",
    "Songdian Technology",
    "松典相机",
    "compact digital camera OEM",
    "mirrorless camera factory",
    "action camera manufacturer",
    "kids camera supplier",
    "video camera OEM",
    "custom camera development",
    "China camera factory",
    "B2B camera manufacturing",
    "private label cameras",
  ],

  authors: [{ name: COMPANY.fullName }],
  creator: COMPANY.name,
  publisher: COMPANY.name,

  // Disable automatic phone/email/address detection (prevents iOS/Android from linking text)
  formatDetection: { email: false, telephone: false, address: false },

  // Open Graph — used by Facebook, LinkedIn, Discord, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: COMPANY.name,
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.description,
    images: [{ url: MEDIA.ogImage, width: 1200, height: 630 }],
  },

  // Twitter Card — used by X / Twitter for link previews
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description: COMPANY.description,
  },

  // Robots: allow all indexing and crawling by both generic + Google crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL to prevent duplicate-content SEO penalties
  alternates: {
    canonical: SITE_URL,
  },

  // Site verification — add Google Search Console code after domain setup
  verification: {
    // google: "your-verification-code",
  },
};

/**
 * RootLayout — the outermost React Server Component.
 * Renders <html>, <head> (with JSON-LD), <body>, and the persistent shell
 * (Header → main → Footer → FloatingInquiry) that wraps every child page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate JSON-LD structured data for Google rich results
  const orgSchema = organizationSchema();
  const siteSchema = webSiteSchema();

  return (
    // ------------------------------------------------------------------
    // <html> tag: sets lang="en" for accessibility + SEO, attaches font CSS variables,
    // and enables Tailwind's antialiased smoothing
    // ------------------------------------------------------------------
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* JSON-LD structured data — injected for Google rich snippets */}
        {/* Organization schema: name, logo, URL, sameAs social profiles */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* WebSite schema: enables sitelinks search box in Google results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        {/*
          Google Analytics / GTM
          Currently handled by WordPress Site Kit plugin.
          To enable direct GA4 tracking, uncomment the Script blocks below
          and replace the measurement ID with your own.
        */}
        {/* next-super-meta 自动注入 SEO 元标签 */}
      </head>
      {/* Body: vertical flex column to push footer to the bottom; white bg, dark text */}
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {/* Site-wide navigation header */}
        <Header />

        {/*
          Main content area:
          - flex-1 pushes the footer to the bottom on short pages
          - pt-14 matches the Tesla-style fixed header height (h-14 = 56px)
        */}
        <main className="flex-1 pt-14 pb-14">{children}</main>

        {/* Site-wide footer with company info, links, and copyright */}
        <Footer />

        {/* Floating inquiry button — sticky widget visible on all pages */}
        <FloatingInquiry />
      </body>
    </html>
  );
}
