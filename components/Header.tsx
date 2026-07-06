/**
 * 页面顶部固定导航栏
 * ------------------------------------------------------------------
 * 默认：深色半透明背景 + 白色文字（适配所有 Hero 背景）
 * 滚动后：毛玻璃效果 + 深色文字
 * 无阴影、无边框。
 */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEDIA } from "@/lib/media";

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "OEM / ODM", href: "/services" },
      { label: "FAQ", href: "/services/faq" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

/** 配色常量 — Electric Blue 主 CTA，品牌红呼应 Logo 中红色 GD 字母 */
const COLORS = {
  carbonDark: "#171A20",
  electricBlue: "#3E6AE1",
  electricBlueHover: "#3457B8",
  brandRed: "#d4343e",       // Logo 中 GD 的红色
  brandRedHover: "#b91c1c",
  white: "#FFFFFF",
} as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all bg-white ${
        scrolled
          ? "backdrop-blur-xl border-b border-[#EEEEEE]"
          : ""
      }`}
      style={{ transitionDuration: "0.33s", transitionProperty: "background-color, backdrop-filter" }}
    >
      <div className="relative max-w-7xl mx-auto px-6 h-14 flex items-center">
        {/* ====================== Logo — 左侧 ====================== */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MEDIA.logo}
              alt="Songdian Technology"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* ====================== 桌面端导航 — 绝对居中 ====================== */}
        <nav
          ref={dropdownRef}
          className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const hasDropdown = !!item.children;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasDropdown && handleMouseEnter(item.label)}
                onMouseLeave={() => hasDropdown && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: isActive ? COLORS.brandRed : COLORS.carbonDark,
                    borderRadius: "4px",
                    transition: "color 0.33s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = COLORS.brandRed;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = isActive ? COLORS.brandRed : COLORS.carbonDark;
                  }}
                >
                  {item.label}
                  {hasDropdown && (
                    <svg
                      className={`w-3.5 h-3.5 ml-1 transition-transform ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                      style={{ transitionDuration: "0.33s" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* 下拉菜单 — 圆角卡片风格 */}
                {hasDropdown && (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-36 bg-white border border-gray-100 rounded-lg py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all origin-top ${
                      activeDropdown === item.label
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    }`}
                    style={{ transitionDuration: "0.2s" }}
                  >
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center px-4 py-2.5 mx-1 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        style={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: COLORS.carbonDark,
                          transitionDuration: "0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = COLORS.brandRed;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ====================== CTA + 移动端汉堡 — 右侧 ====================== */}
        <div className="flex-1 flex items-center justify-end gap-3">
          {/* 桌面端 CTA 按钮 */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center px-5 text-white text-sm font-medium rounded"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: COLORS.electricBlue,
              color: COLORS.white,
              height: "40px",
              borderRadius: "4px",
              transition: "background-color 0.33s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.electricBlueHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.electricBlue;
            }}
          >
            Request Quote
          </Link>

          {/* 移动端汉堡菜单 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded"
            style={{ borderRadius: "4px" }}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span
                className={`block h-[2px] w-full rounded-full transition-all origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
                style={{
                  backgroundColor: COLORS.carbonDark,
                  transitionDuration: "0.33s",
                }}
              />
              <span
                className={`block h-[2px] w-full rounded-full transition-all ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
                style={{
                  backgroundColor: COLORS.carbonDark,
                  transitionDuration: "0.33s",
                }}
              />
              <span
                className={`block h-[2px] w-full rounded-full transition-all origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
                style={{
                  backgroundColor: COLORS.carbonDark,
                  transitionDuration: "0.33s",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ====================== 移动端菜单 — 无阴影 ====================== */}
      <div
        className={`md:hidden fixed inset-0 top-14 bg-white z-40 transition-all overflow-y-auto ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ transitionDuration: "0.33s" }}
      >
        <nav className="flex flex-col p-6 gap-1">
          {NAV_LINKS.map((item, i) => (
            <div
              key={item.label}
              className="animate-fade-in-up"
              style={{
                animationDelay: mobileOpen ? `${i * 60}ms` : "0ms",
              }}
            >
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium rounded"
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: COLORS.carbonDark,
                  borderRadius: "4px",
                  transition: "color 0.33s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = COLORS.brandRed;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                }}
              >
                {item.label}
              </Link>

              {item.children && (
                <div className="ml-4 mt-1 space-y-1 pl-4" style={{ borderLeft: "2px solid #EEEEEE" }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm font-normal rounded"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: COLORS.carbonDark,
                        borderRadius: "4px",
                        transition: "color 0.33s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = COLORS.brandRed;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = COLORS.carbonDark;
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 移动端 CTA */}
          <div className="pt-5 mt-3" style={{ borderTop: "1px solid #EEEEEE" }}>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-6 py-3 text-white text-sm font-medium rounded"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                backgroundColor: COLORS.electricBlue,
                color: COLORS.white,
                borderRadius: "4px",
                transition: "background-color 0.33s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.electricBlueHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = COLORS.electricBlue;
              }}
            >
              Request Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
