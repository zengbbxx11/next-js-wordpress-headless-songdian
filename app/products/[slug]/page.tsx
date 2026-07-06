/**
 * 产品详情页面 — Tesla Design System
 */

import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getAllProductSlugs, getProducts } from "@/lib/wordpress";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { cleanPostContent } from "@/lib/html-cleaner";
import { generateBreadcrumbs, productSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/content-data";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription?.slice(0, 160) || `OEM/ODM ${product.name} — ${COMPANY.name}`,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription?.slice(0, 160),
      images: product.images?.[0]?.src ? [{ url: product.images[0].src, width: 800, height: 800 }] : [],
      type: "article",
    },
  };
}

function extractFeatures(html: string): string[] {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.replace(/^[•\-–—·]\s*/, "").trim())
    .filter((s) => s.length > 3)
    .slice(0, 8);
}

function extractSpecs(html: string): { label: string; value: string }[] {
  const lines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const specs: { label: string; value: string }[] = [];
  for (const line of lines) {
    if (line.length < 60) specs.push({ label: "", value: line });
  }
  return specs.slice(0, 16);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumbs([
    { label: "Products", href: "/products" },
    { label: product.name },
  ]);

  const schema = productSchema({
    name: product.name,
    description: product.shortDescription?.slice(0, 160) || "",
    image: product.images?.[0]?.src || null,
    sku: product.sku,
    url: `/products/${slug}`,
  });

  const features = product.shortDescription ? extractFeatures(product.shortDescription) : [];

  const wcAttrs = product.attributes || [];
  const parsedSpecs = product.shortDescription ? extractSpecs(product.shortDescription) : [];
  const specs = wcAttrs.length > 0
    ? wcAttrs.map((a) => ({ label: a.name, value: a.value }))
    : parsedSpecs;

  const primaryImage = product.images?.[0]?.src || null;
  const galleryImages = product.gallery || [];
  const hasContent = product.description && product.description.trim().length > 0;

  let relatedProducts: Awaited<ReturnType<typeof getProducts>> = { products: [], pagination: null };
  if (product.categories.length > 0) {
    try { relatedProducts = await getProducts({ category: product.categories[0].id, perPage: 4 }); } catch { /* ignore */ }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumbs */}
      <section className="bg-gray-50 py-4" style={{ borderBottom: "1px solid #EEEEEE" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">

            {/* Left: Product Gallery */}
            <div>
              {primaryImage ? (
                <>
                  <ProductGallery
                    mainImage={primaryImage}
                    mainAlt={product.images?.[0]?.alt || product.name}
                    gallery={galleryImages}
                    category={product.categories[0]?.name}
                  />
                  {/* 产品标签 — 放在大图下方 */}
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: "#F4F4F4", color: "#5C5E62" }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-gray-50 border border-[#EEEEEE] flex items-center justify-center text-gray-300" style={{ borderRadius: "12px" }}>
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Product Model</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-5">
                {product.name}
              </h1>

              {features.length > 0 && (
                <ul className="space-y-2.5 mb-7">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600 leading-relaxed">
                      <span className="text-gray-400 mt-1 shrink-0">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              {product.sku && (
                <p className="text-xs text-gray-400 mb-5">
                  SKU: <span className="font-mono text-gray-500">{product.sku}</span>
                </p>
              )}

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 text-white text-sm font-medium rounded transition-colors bg-[#3E6AE1] hover:bg-[#3561CC]"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    height: "42px",
                    borderRadius: "4px",
                    transitionDuration: "0.33s",
                  }}
                >
                  Send Inquiry
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  &larr; All Products
                </Link>
              </div>

              {/* OEM/ODM notice */}
              <div className="flex items-center gap-2.5 p-4 rounded-xl border" style={{ backgroundColor: "#EFF3FF", borderColor: "#C5D5F8" }}>
                <svg className="w-5 h-5 shrink-0" style={{ color: "#3E6AE1" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm" style={{ color: "#3561CC" }}>
                  Available for OEM/ODM — wholesale pricing upon request
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="py-12 md:py-16" style={{ backgroundColor: "#F4F4F4" }}>
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Specifications</h2>
            <div className="bg-white overflow-hidden border border-[#EEEEEE]" style={{ borderRadius: "12px" }}>
              <table className="w-full">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className="border-b border-[#EEEEEE] last:border-0">
                      {spec.label ? (
                        <>
                          <td className="w-[35%] px-6 py-3.5 text-sm font-medium text-gray-500 bg-gray-50/50 border-r border-[#EEEEEE]">
                            {spec.label}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-gray-900">{spec.value}</td>
                        </>
                      ) : (
                        <td colSpan={2} className="px-6 py-3.5 text-sm text-gray-900">{spec.value}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      
      {/* Product Highlights */}
      {hasContent && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Product Highlights</h2>
            <div className="wp-content" dangerouslySetInnerHTML={{ __html: cleanPostContent(product.description) }} />
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.products.length > 1 && (
        <section className="py-14 md:py-20" style={{ backgroundColor: "#F4F4F4" }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.products
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
