"use client";

import Link from "next/link";
import { COMPANY, FOOTER_LINKS } from "@/lib/site-config";
import { MEDIA } from "@/lib/media";

/**
 * 极简 Tesla 页脚
 * ------------------------------------------------------------------
 * Light Ash 背景（#F4F4F4），极细顶部分割线。
 * 列标题 uppercase，链接 Pewter 色，底部 Silver Fog 版权。
 */

const COLORS = {
  lightAsh: "#F4F4F4",
  carbonDark: "#171A20",
  pewter: "#5C5E62",
  silverFog: "#8E8E8E",
  border: "#EEEEEE",
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: COLORS.lightAsh, borderTop: `1px solid ${COLORS.border}` }}>
      <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
        {/* 链接网格 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* 品牌列 */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={MEDIA.logo} alt={COMPANY.name} className="h-8 w-auto" />
            </Link>
            <p
              className="leading-relaxed max-w-xs mb-4"
              style={{ fontSize: "13px", color: COLORS.pewter }}
            >
              {COMPANY.description.slice(0, 120)}...
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center font-medium transition-colors"
              style={{
                fontSize: "13px",
                color: COLORS.carbonDark,
                transitionDuration: "0.33s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.pewter;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
              }}
            >
              Get in touch
              <svg
                className="w-3.5 h-3.5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* 产品 */}
          <div>
            <h4
              className="uppercase tracking-wider mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: COLORS.carbonDark,
              }}
            >
              Products
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: COLORS.pewter,
                      transitionDuration: "0.33s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.pewter;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 服务 */}
          <div>
            <h4
              className="uppercase tracking-wider mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: COLORS.carbonDark,
              }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: COLORS.pewter,
                      transitionDuration: "0.33s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.pewter;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 公司 */}
          <div>
            <h4
              className="uppercase tracking-wider mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: COLORS.carbonDark,
              }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: COLORS.pewter,
                      transitionDuration: "0.33s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.pewter;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h4
              className="uppercase tracking-wider mb-4"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: COLORS.carbonDark,
              }}
            >
              Support
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: COLORS.pewter,
                      transitionDuration: "0.33s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = COLORS.pewter;
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部栏 */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <p style={{ fontSize: "14px", color: COLORS.silverFog }}>
            &copy; {year} {COMPANY.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="transition-colors"
              style={{
                fontSize: "14px",
                color: COLORS.silverFog,
                transitionDuration: "0.33s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.silverFog;
              }}
            >
              Sitemap
            </Link>
            <Link
              href="/privacy-policy"
              className="transition-colors"
              style={{
                fontSize: "14px",
                color: COLORS.silverFog,
                transitionDuration: "0.33s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.silverFog;
              }}
            >
              Privacy
            </Link>
            <Link
              href="/services/faq"
              className="transition-colors"
              style={{
                fontSize: "14px",
                color: COLORS.silverFog,
                transitionDuration: "0.33s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = COLORS.silverFog;
              }}
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
