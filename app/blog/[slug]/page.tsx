/*
 * 文件：app/blog/[slug]/page.tsx（博客文章 → 新闻文章重定向）
 * 职责：将 /blog/[slug] 旧文章路径重定向到 /news/[slug]，兼容旧 URL 与外部链接。
 * 数据来源：无 —— 纯服务端重定向。
 * 渲染方式：服务端重定向（redirect()），不生成静态页面。
 * 是否含 client 组件：否。
 */

import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/news/${slug}`);
}
