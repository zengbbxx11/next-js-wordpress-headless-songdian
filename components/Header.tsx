/**
 * 这是一个客户端组件，因为它使用了：
 * - `useState` 用于移动菜单开关、滚动检测和下拉菜单悬停状态
 * - `useEffect` 用于滚动监听、路由变化清理和 body 滚动锁定
 * - `useRef` 用于下拉菜单悬停延迟计时器和下拉菜单容器引用
 * - 仅浏览器 API（window.scrollY、document.body.style）
 */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 单个导航链接项的类型定义。
 * 顶级链接可以可选地包含嵌套子项用于下拉菜单。
 */
interface NavLink {
  /** 链接的显示文本 */
  label: string;
  /** 目标 URL */
  href: string;
  /** 在下拉菜单中渲染的可选子链接 */
  children?: { label: string; href: string }[];
}

/**
 * 站点头部的中央导航数据。
 * 包含 `children` 数组的链接在桌面端渲染悬停下拉菜单，
 * 在移动端渲染缩进子列表。
 */
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

/**
 * 主站点头部组件。
 *
 * 功能：
 * - 固定定位，根据滚动状态切换背景/阴影
 * - 桌面端水平导航，带悬停触发的下拉菜单（防抖处理）
 * - 移动端离屏下滑菜单，带错位链接动画
 * - 汉堡菜单动画切换（三线 → X）
 * - "询盘" CTA 按钮（桌面端：内联，移动端：菜单内）
 * - 根据当前路径名高亮激活路由
 * - 移动菜单打开时锁定 body 滚动
 */
export default function Header() {
  /** 移动菜单覆盖层是否打开 */
  const [mobileOpen, setMobileOpen] = useState(false);
  /** 用户是否已经滚动过触发背景/阴影的阈值 */
  const [scrolled, setScrolled] = useState(false);
  /** 当前悬停的下拉菜单标签，无则为 null */
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  /** 延迟关闭下拉菜单的计时器引用 — 防止快速移出/移入时的闪烁 */
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * 监听滚动位置，当用户滚动超过约 20px 时
   * 切换微妙的背景 + 阴影效果。
   */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 路由变化时关闭移动菜单和任何打开的下拉菜单，
   * 确保新页面的干净状态。
   */
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  /**
   * 移动菜单打开时阻止背景页面滚动。
   * 卸载时恢复默认 overflow。
   */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /** 立即打开下拉菜单，清除任何待处理的关闭计时器 */
  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  /** 短暂延迟（约 200ms）后关闭下拉菜单，避免闪烁 */
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-white border-b border-transparent"
      }`}
      style={{ transitionProperty: "background-color, border-color, box-shadow" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-[4.5rem] flex items-center justify-between">
        {/* ====================== Logo ====================== */}
        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Songdian Technology"
            className="h-10 w-auto"
          />
        </Link>

        {/* ====================== 桌面端导航 ====================== */}
        <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
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
                {/* 导航链接 — 有子项时渲染箭头图标 */}
                <Link
                  href={item.href}
                  className={`relative inline-flex items-center px-4 py-2.5 text-lg font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-red-600 bg-red-50/60"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                  {hasDropdown && (
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
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

                {/* 下拉菜单 — 带动画缩放/淡入，pointer-events 控制交互 */}
                {hasDropdown && (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/40 py-2 transition-all duration-200 origin-top ${
                      activeDropdown === item.label
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-5 py-3 mx-2 rounded-xl text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150"
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

        {/* ====================== CTA + 移动端切换按钮 ====================== */}
        <div className="flex items-center gap-3">
          {/* 桌面端"询盘"按钮 — 移动端隐藏，lg 以下完全隐藏 */}
          <Link
            href="/contact"
            className="hidden lg:inline-flex items-center px-6 py-2.5 bg-red-600 text-white text-base font-semibold rounded-xl hover:bg-red-700 active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              transitionProperty: "background-color, transform, box-shadow",
            }}
          >
            Request Quote
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {/* 移动端汉堡菜单切换按钮 — 打开时三线动画变成 X */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-150"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              {/* 顶部横线 — 顺时针旋转形成 X */}
              <span
                className={`block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              {/* 中间横线 — 淡出消失 */}
              <span
                className={`block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-200 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              {/* 底部横线 — 逆时针旋转形成 X */}
              <span
                className={`block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ====================== 移动端菜单 ====================== */}
      <div
        className={`md:hidden fixed inset-0 top-[4.5rem] bg-white z-40 transition-all duration-300 overflow-y-auto ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
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
              {/* 顶级移动端链接 */}
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-[17px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-150"
              >
                {item.label}
              </Link>

              {/* 嵌套子链接 — 以缩进列表和左侧边框渲染 */}
              {item.children && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-[15px] text-gray-500 hover:text-gray-900 rounded-lg transition-all duration-150"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 移动端"询盘"CTA — 菜单底部全宽显示 */}
          <div className="pt-5 mt-3 border-t border-gray-100">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-6 py-3.5 bg-red-600 text-white text-[16px] font-semibold rounded-xl active:scale-[0.98] transition-all duration-200 hover:bg-red-700"
            >
              Request Quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
