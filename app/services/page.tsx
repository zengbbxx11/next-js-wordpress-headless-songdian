/**
 * 服务概览页面 — Tesla Design System
 */

import Link from "next/link";
import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import InquiryForm from "@/components/InquiryForm";
import { generateBreadcrumbs } from "@/lib/seo";
import { COMPANY } from "@/lib/content-data";

export const metadata = await superMeta({
  title: "OEM / ODM Services",
  description: `Comprehensive OEM and ODM camera manufacturing services — from industrial design and prototyping to mass production. ${COMPANY.name}.`,
  url: "/services",
});

export const revalidate = 3600;

const services = [
  {
    title: "OEM Manufacturing",
    desc: "Build-to-spec production. Hand us your specifications and branding — we handle BOM procurement, SMT assembly, firmware, QC, and packaging. 10 production lines, 8,000 units daily output.",
    features: [
      "Full BOM procurement and supply chain management",
      "High-precision SMT assembly across 10 production lines",
      "Custom firmware, enclosure, and retail packaging",
      "100% functional QC with detailed inspection reports",
    ],
  },
  {
    title: "ODM Design & Development",
    desc: "We design, you brand. Choose from 500+ patented camera designs or let our R&D team create custom products. 30+ new products developed annually — concept to production in 3 months.",
    features: [
      "Access to 500+ patented camera designs",
      "Industrial design, PCB layout, firmware development",
      "Rapid prototyping with 3D printing and CNC",
      "CE, FCC, RoHS compliance support",
    ],
  },
  {
    title: "Brand Customization",
    desc: "Full-spectrum branding for distributors and retailers. Custom logos, packaging, firmware UI, and user manuals — everything you need to launch your own camera brand.",
    features: [
      "Custom logo printing on camera body and lens",
      "Bespoke packaging design and branded firmware",
      "Multi-language user manual creation",
      "Low MOQ — start with 100 units",
    ],
  },
  {
    title: "Quality Assurance",
    desc: "Every camera undergoes rigorous 5-stage QC. ISO 9001 certified — IQC, IPQC, FQC, OQC with traceable components, ensuring every batch meets EU & USA standards.",
    features: [
      "IQC — Incoming material inspection",
      "IPQC — In-process quality control at each stage",
      "FQC — Full functional and burn-in testing",
      "OQC — AQL sampling inspection with reports",
    ],
  },
];

export default function ServicesPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "Services" }]);

  return (
    <>
      {/* Hero — 仅面包屑 */}
      <section className="py-5" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
        </div>
      </section>

      {/* Service Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-8 border border-[#EEEEEE] hover:border-[#D0D1D2] transition-colors"
                style={{ borderRadius: "12px", transitionDuration: "0.33s" }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#5C5E62" }}>{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#3E6AE1" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA — Electric Blue */}
      <section className="py-12 bg-gray-50 border-y border-[#EEEEEE]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Have Questions?</h3>
          <p className="text-sm mb-6" style={{ color: "#5C5E62" }}>
            Find answers about ordering, customization, quality, and shipping in our FAQ.
          </p>
          <Link
            href="/services/faq"
            className="inline-flex items-center px-6 text-white text-sm font-medium rounded transition-colors bg-[#3E6AE1] hover:bg-[#3561CC]"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
              height: "42px",
              borderRadius: "4px",
              transitionDuration: "0.33s",
            }}
          >
            View FAQ
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
