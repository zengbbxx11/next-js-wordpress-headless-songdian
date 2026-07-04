"use client";

import { useState, type FormEvent } from "react";

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

    const formData = new FormData(e.currentTarget);
    // Send to WordPress REST API (Contact Form 7 endpoint if installed, or custom endpoint)
    // For now, simulate submission
    try {
      // If you install Contact Form 7 plugin with REST API enabled:
      // await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/FORM_ID/feedback`, {
      //   method: "POST",
      //   body: formData,
      // });

      // Simulate delay
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
      <div className={`bg-white rounded-2xl border border-gray-200/70 p-8 md:p-10 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      className={`bg-white rounded-2xl border border-gray-200/70 p-8 md:p-10 ${className}`}
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {productName ? `Inquire About ${productName}` : "Send an Inquiry"}
        </h3>
        <p className="text-sm text-gray-500">
          Fill out the form below and our team will contact you shortly.
        </p>
      </div>

      {/* Hidden fields for tracking */}
      {productName && <input type="hidden" name="product_name" value={productName} />}
      {productSku && <input type="hidden" name="product_sku" value={productSku} />}

      <div className="space-y-5">
        {/* Name + Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              placeholder="Your Company Inc."
            />
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        {/* Country + Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">
              Country / Region
            </label>
            <input
              id="country"
              name="country"
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
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
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
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

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Service Required
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["OEM Manufacturing", "ODM Design & Build", "Custom Development", "Sample Request", "Technical Consulting", "Other"].map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors has-[:checked]:border-gray-400 has-[:checked]:bg-gray-100 has-[:checked]:text-gray-900"
              >
                <input type="checkbox" name="services" value={service} className="sr-only" />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Requirements <span className="text-red-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all resize-none"
            placeholder="Please describe your product requirements, target specifications, expected delivery timeline, and any other relevant details..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/10"
        >
          {loading ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
