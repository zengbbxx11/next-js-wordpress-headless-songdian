/**
 * 新闻文章详情页面 — Tesla Design System
 */

import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs, getPosts } from "@/lib/wordpress";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import { generateBreadcrumbs, articleSchema } from "@/lib/seo";
import { formatDate } from "@/lib/wordpress";
import { cleanPostContent } from "@/lib/html-cleaner";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt?.slice(0, 160),
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      title: post.title, description: post.excerpt?.slice(0, 160),
      images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [],
      type: "article", publishedTime: post.date, modifiedTime: post.modified, authors: [post.author],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <Link href="/news" className="text-sm hover:underline" style={{ color: "#3E6AE1" }}>&larr; Back to News</Link>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbs([{ label: "News", href: "/news" }, { label: post.title }]);

  const schema = articleSchema({
    title: post.title, description: post.excerpt?.slice(0, 160) || "",
    image: post.featuredImage, datePublished: post.date, dateModified: post.modified,
    author: post.author, url: `/news/${slug}`,
  });

  let relatedPosts: Awaited<ReturnType<typeof getPosts>> = { posts: [], pagination: { total: 0, totalPages: 0 } };
  if (post.categories.length > 0) {
    try { relatedPosts = await getPosts({ categoryId: post.categories[0].id, perPage: 4 }); } catch { /* ignore */ }
  }

  const related = relatedPosts.posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="py-6 md:py-8" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />

          {post.categories.length > 0 && (
            <Link
              href={`/news?category=${post.categories[0].id}`}
              className="inline-block mt-4 px-3 py-1 text-xs font-semibold rounded-full transition-colors bg-[rgba(62,106,225,0.15)] hover:bg-[rgba(62,106,225,0.25)]"
              style={{
                color: "#3E6AE1",
                transitionDuration: "0.33s",
              }}
            >
              {post.categories[0].name}
            </Link>
          )}

          <h1 className="text-[1.5rem] md:text-[2rem] font-medium text-white tracking-normal leading-[1.15] mt-3 mb-3">
            {post.title}
          </h1>

          <div className="text-sm">
            <time dateTime={post.date} className="text-gray-400">{formatDate(post.date)}</time>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="bg-white pt-8 md:pt-10 pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* 特色图片 — 限制高度，确保首屏可见正文 */}
          {post.featuredImage && (
            <div className="mb-5 overflow-hidden bg-gray-100 max-h-[360px]" style={{ borderRadius: "12px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.featuredImageAlt}
                className="w-full h-auto max-h-[360px] object-contain"
                loading="eager"
              />
            </div>
          )}

          <div className="wp-content" dangerouslySetInnerHTML={{ __html: cleanPostContent(post.content) }} />

          {/* Tags — #F4F4F4 bg, #5C5E62 text */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-14 pt-10 border-t border-[#EEEEEE]">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "#F4F4F4", color: "#5C5E62" }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Back to News — blue link */}
          <div className="mt-12">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-medium transition-colors group text-[#3E6AE1] hover:text-[#3561CC]"
              style={{ transitionDuration: "0.33s" }}
            >
              <svg className="w-4 h-4 mr-1.5 transition-transform" style={{ transitionDuration: "0.33s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50 border-t border-[#EEEEEE]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 tracking-normal mb-8">
              More Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
