/**
 * 关于我们页面 — Tesla Design System
 */

import { superMeta } from "next-super-meta";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import StatsDashboard from "@/components/StatsDashboard";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import SectionHeading from "@/components/SectionHeading";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY, ABOUT } from "@/lib/content-data";

export const metadata = await superMeta({
  title: "About Us",
  description: `Learn about ${COMPANY.name} — a leading OEM/ODM digital camera manufacturer with 15+ years of experience, serving brands in 50+ countries worldwide.`,
  url: "/about",
});

export const revalidate = 3600;

export default function AboutPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "About" }]);

  return (
    <>
      {/* Section 1 — 仅面包屑 */}
      <section className="py-5" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
        </div>
      </section>

      {/* Section 2 — Stats Dashboard */}
      <StatsDashboard />

      {/* Section 3 — Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-8">{ABOUT.story.title}</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {ABOUT.story.content.map((p, i) => (
              <p key={i} className="text-[15px] md:text-base">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Timeline */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeading className="mb-14">Our Journey</SectionHeading>
          <HorizontalTimeline items={ABOUT.timeline} />
        </div>
      </section>

      {/* Section 5 — Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading className="mb-12">Our Values</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT.values.map((v) => (
              <div key={v.title} className="p-8 border border-[#EEEEEE] hover:border-[#D0D1D2] transition-colors" style={{ borderRadius: "12px", transitionDuration: "0.33s" }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5C5E62" }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — R&D */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6">{ABOUT.rd.title}</h2>
          <p className="text-gray-600 leading-relaxed mb-10">{ABOUT.rd.content}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ABOUT.rd.highlights.map((h) => (
              <div key={h.label} className="bg-white p-5 border border-[#EEEEEE] text-center" style={{ borderRadius: "12px" }}>
                <div className="text-xl font-bold text-gray-900">{h.value}</div>
                <div className="text-xs mt-1" style={{ color: "#5C5E62" }}>{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Certifications */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading className="mb-12">Certifications &amp; Compliance</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ABOUT.certifications.map((cert) => (
              <div key={cert.name} className="p-6 border border-[#EEEEEE] text-center hover:border-[#D0D1D2] transition-colors" style={{ borderRadius: "12px", transitionDuration: "0.33s" }}>
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 flex items-center justify-center" style={{ borderRadius: "12px" }}>
                  <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{cert.name}</div>
                <div className="text-xs" style={{ color: "#5C5E62" }}>{cert.description}</div>
                <div className="text-[11px] mt-2" style={{ color: "#8E8E8E" }}>Since {cert.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — CTA (Electric Blue) */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-white tracking-tight mb-4" style={{ fontSize: "30px", fontWeight: 500, color: "#FFFFFF" }}>
            Ready to Partner With Us?
          </h2>
          <p className="max-w-md mx-auto mb-8" style={{ color: "#8E8E8E" }}>
            Let&apos;s discuss your camera project and explore how we can bring your vision to market.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 text-white text-sm font-medium rounded transition-colors bg-[#3E6AE1] hover:bg-[#3561CC]"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
              height: "44px",
              borderRadius: "4px",
              transitionDuration: "0.33s",
            }}
          >
            Get in Touch
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
