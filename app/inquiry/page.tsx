/**
 * 询盘 → 联系页面重定向
 *
 * @file       app/inquiry/page.tsx
 * @route      /inquiry → 重定向到 /contact
 * @dataSource 无 —— 仅执行服务端重定向。
 * @strategy   SSR（服务端重定向），使用 next/navigation 的 redirect()。
 *              不会为 /inquiry 生成静态页面。所有对 /inquiry 的请求
 *              都会立即返回 307（临时重定向）到 /contact。
 *
 * 用途：
 * 询盘功能已合并到联系页面（app/contact/page.tsx），
 * 现在联系信息与询盘表单整合在同一个页面中。
 * 此重定向保留了对现有外部链接、书签或指向 /inquiry 的
 * 导航引用的向后兼容性。
 *
 * @note 此文件故意不返回任何 JSX —— redirect() 会抛出
 *       NEXT_REDIRECT 错误，Next.js 捕获该错误后执行重定向。
 */

import { redirect } from "next/navigation";

/**
 * InquiryRedirect —— 将所有 /inquiry 流量重定向到 /contact。
 *
 * 使用 Next.js 服务端重定向，将询盘和联系页面
 * 合并到同一个目的地（/contact）。
 *
 * @returns {never} 永远不会渲染 —— redirect() 在内部抛出异常。
 */
export default function InquiryRedirect() {
  redirect("/contact");
}
