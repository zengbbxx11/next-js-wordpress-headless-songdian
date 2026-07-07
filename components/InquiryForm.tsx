"use client";

import { useState, type FormEvent } from "react";

/**
 * InquiryForm — 产品咨询表单（简化版，components 根目录）
 * ------------------------------------------------------------------
 * 客户端组件。受控于本地 state 管理提交/加载状态，提交为模拟请求（1 秒延迟）。
 * 用于产品详情页等场景，可携带 productName / productSku 作为隐藏字段。
 */

interface InquiryFormProps {
  productName?: string;
  productSku?: string;
  className?: string;
}

export default function InquiryForm({ productName, productSku, className = "" }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const _formData = new FormData(e.currentTarget);
    try {
      // 模拟提交请求：生产环境应替换为对后端 / WP REST API 的真实调用
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`bg-white border border-[#EEEEEE] p-8 md:p-10 text-center ${className}`} style={{ borderRadius: "12px" }}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EFF3FF" }}>
          <svg className="w-8 h-8" style={{ color: "#3E6AE1" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          We&apos;ve received your inquiry. Our sales team will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      id="inquiry"
      onSubmit={handleSubmit}
      className={`bg-white border border-[#EEEEEE] p-8 md:p-10 ${className}`}
      style={{ borderRadius: "12px" }}
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {productName ? `Inquire About ${productName}` : "Send an Inquiry"}
        </h3>
        <p className="text-sm text-gray-500">
          Fill out the form below and our team will contact you shortly.
        </p>
      </div>

      {productName && <input type="hidden" name="product_name" value={productName} />}
      {productSku && <input type="hidden" name="product_sku" value={productSku} />}

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span style={{ color: "#3E6AE1" }}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
              placeholder="John Smith"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span style={{ color: "#3E6AE1" }}>*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
              placeholder="Your Company Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span style={{ color: "#3E6AE1" }}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
              Country / Region
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
              placeholder="United States"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
              Estimated Order Quantity
            </label>
            <select
              id="quantity"
              name="quantity"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              style={{ borderRadius: "4px" }}
            >
              <option value="">Please select</option>
              <option value="sample">Sample Order (1-10 pcs)</option>
              <option value="small">Small (100-500 pcs)</option>
              <option value="medium">Medium (500-5,000 pcs)</option>
              <option value="large">Large (5,000-50,000 pcs)</option>
              <option value="enterprise">Enterprise (50,000+ pcs)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Service Required
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["OEM Manufacturing", "ODM Design & Build", "Custom Development", "Sample Request", "Technical Consulting", "Other"].map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors has-[:checked]:border-gray-400 has-[:checked]:bg-gray-100 has-[:checked]:text-gray-900"
                style={{ borderRadius: "4px" }}
              >
                <input type="checkbox" name="services" value={service} className="sr-only" />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Requirements <span style={{ color: "#3E6AE1" }}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all resize-none"
            style={{ borderRadius: "4px" }}
            placeholder="Please describe your product requirements, target specifications, expected delivery timeline, and any other relevant details..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 text-white text-sm font-semibold rounded disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          style={{
            backgroundColor: "#3E6AE1",
            color: "#FFFFFF",
            borderRadius: "4px",
            transitionDuration: "0.33s",
          }}
          onMouseEnter={(e) => {
            if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = "#3561CC";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#3E6AE1";
          }}
        >
          {loading ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
