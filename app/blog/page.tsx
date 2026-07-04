/**
 * 博客 → 新闻重定向
 *
 * @file       app/blog/page.tsx
 * @route      /blog → 重定向到 /news
 * @dataSource 无 —— 仅执行服务端重定向。
 * @strategy   SSR（服务端重定向），使用 next/navigation 的 redirect()。
 *              不会为 /blog 生成静态页面。所有对 /blog 的请求
 *              都会立即返回 307（临时重定向）到 /news。
 *
 * 用途：
 * 本网站使用 "News" 作为文章版块的主要标识（B2B 定位）。
 * /blog 路径作为重定向目标保留，以兼容旧的 URL
 * 和可能仍指向 /blog 的外部链接。
 * 这确保了不会出现死链，并提供良好的用户体验。
 *
 * @note 此文件故意不返回任何 JSX —— redirect() 会抛出
 *       NEXT_REDIRECT 错误，Next.js 捕获该错误后执行重定向。
 */

import { redirect } from "next/navigation";

/**
 * BlogRedirect —— 将所有 /blog 流量重定向到 /news。
 *
 * 使用 Next.js 服务端重定向，将访问者从旧博客路径
 * 永久路由到当前新闻版块。
 *
 * @returns {never} 永远不会渲染 —— redirect() 在内部抛出异常。
 */
export default function BlogRedirect() {
  redirect("/news");
}
