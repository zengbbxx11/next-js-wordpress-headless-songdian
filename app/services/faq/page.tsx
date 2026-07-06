/**
 * FAQ 页面 — Tesla Design System
 */

import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import { generateBreadcrumbs, faqSchema } from "@/lib/seo";
import { FAQS } from "@/lib/content-data";

export const metadata = await superMeta({
  title: "FAQ",
  description: "Frequently asked questions about our OEM/ODM camera manufacturing services, MOQ, pricing, customization, quality control, shipping, and after-sales support.",
  url: "/services/faq",
});

export const revalidate = 3600;

export default function FAQPage() {
  const breadcrumbs = generateBreadcrumbs([
    { label: "Services", href: "/services" },
    { label: "FAQ" },
  ]);

  const allFaqs = FAQS.flatMap((c) => [...c.items]);
  const schema = faqSchema(allFaqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero — 仅面包屑 */}
      <section className="py-5" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="space-y-12">
            {FAQS.map((category) => (
              <div key={category.category}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-[#EEEEEE]">
                  {category.category}
                </h2>

                <div className="space-y-3">
                  {category.items.map((faq) => (
                    <details
                      key={faq.question}
                      className="group bg-gray-50 border border-[#EEEEEE] overflow-hidden hover:border-[#D0D1D2] transition-colors"
                      style={{ borderRadius: "12px", transitionDuration: "0.33s" }}
                    >
                      <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between text-sm font-medium text-gray-900 transition-colors" style={{ transitionDuration: "0.33s" }}>
                        {faq.question}
                        <svg
                          className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ transitionDuration: "0.33s" }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#5C5E62" }}>
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
