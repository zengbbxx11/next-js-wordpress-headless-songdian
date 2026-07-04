import Link from "next/link";
import { COMPANY, FOOTER_LINKS } from "@/lib/site-config";

/**
 * 全局站点页脚组件（服务端组件）。
 *
 * 渲染五列网格：
 * 1. 品牌列 — logo、简短公司描述、"联系我们"链接
 * 2. 产品 — 来自 `FOOTER_LINKS.products` 的链接列表
 * 3. 服务 — 来自 `FOOTER_LINKS.services` 的链接列表
 * 4. 公司 — 来自 `FOOTER_LINKS.company` 的链接列表
 * 5. 支持 — 来自 `FOOTER_LINKS.support` 的链接列表
 *
 * 底部栏显示版权（动态年份）、Sitemap、隐私政策和 FAQ 链接。
 *
 * 所有链接数据集中来源于 `@/lib/site-config`，以实现单一数据源维护。
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/**
         * 主要链接网格 — 桌面端 5 列，移动端折叠为 2 列。
         * 每列是一个语义区块，包含标题和无序链接列表。
         */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* ====================== 品牌列 ====================== */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={COMPANY.name} className="h-8 w-auto" />
            </Link>
            {/* 截断的公司描述 — 完整文本在 /about */}
            <p className="text-[12px] text-gray-500 leading-relaxed max-w-xs mb-4">
              {COMPANY.description.slice(0, 120)}...
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-[13px] font-medium text-gray-900 hover:text-gray-600 transition-colors"
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

          {/* ====================== 产品 ====================== */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====================== 服务 ====================== */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====================== 公司 ====================== */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====================== 支持 ====================== */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ====================== 底部栏 ====================== */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* 动态版权年份 */}
          <p className="text-[12px] text-gray-400">
            &copy; {year} {COMPANY.fullName}. All rights reserved.
          </p>
          {/* 次要实用链接 */}
          <div className="flex items-center gap-5">
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sitemap
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/services/faq"
              className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
