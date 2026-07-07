/*
 * 文件：app/contact/page.tsx（联系我们 / Contact）
 * 职责：联系方式展示 + 询盘表单，含公司地址/邮箱/电话、询盘须知与 Google 地图。
 * 数据来源：本地常量 COMPANY、INQUIRY_GUIDE（@/lib/content-data）；
 *           localBusinessSchema()（@/lib/seo）；表单提交由 InquiryForm 处理。
 * 渲染方式：静态生成 + ISR（revalidate = 3600 秒）。
 * 是否含 client 组件：是 —— InquiryForm 为客户端表单组件。
 */

import { superMeta } from "next-super-meta";
import Breadcrumbs from "@/components/Breadcrumbs";
import InquiryForm from "@/components/form/InquiryForm";
import { generateBreadcrumbs, localBusinessSchema } from "@/lib/seo";
import { COMPANY, INQUIRY_GUIDE } from "@/lib/content-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = await superMeta({
  title: "Contact Us",
  description: `Get in touch with ${COMPANY.name}. Request a quote for OEM/ODM camera manufacturing — our team responds within 24 hours.`,
  url: "/contact",
});

// ISR 重新验证间隔（秒）：静态内容每小时刷新一次
export const revalidate = 3600;

export default function ContactPage() {
  const breadcrumbs = generateBreadcrumbs([{ label: "Contact" }]);
  const businessSchema = localBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* 首屏 Hero —— 仅含面包屑 */}
      <section className="py-5" style={{ backgroundColor: "#171A20" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs items={breadcrumbs} variant="dark" />
        </div>
      </section>

      {/* 主内容区 */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

            {/* 左栏 */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Contact Information</h2>

              <Card className="mb-8 border-[#EEEEEE]" style={{ borderRadius: "12px" }}>
                <CardContent className="space-y-5 pt-(--card-spacing)">
                  {[
                    {
                      label: "Address",
                      value: COMPANY.contact.address,
                      icon: <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                    },
                    {
                      label: "Email",
                      value: (
                        <>
                          <a href={`mailto:${COMPANY.contact.email}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors block">{COMPANY.contact.email}</a>
                          <a href={`mailto:${COMPANY.contact.emailAlt}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors mt-0.5 block">{COMPANY.contact.emailAlt}</a>
                        </>
                      ),
                      icon: <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
                    },
                    {
                      label: "Phone / WhatsApp",
                      value: <><p className="text-sm text-gray-500">Phone: {COMPANY.contact.phone}</p><p className="text-sm text-gray-500 mt-0.5">WhatsApp: {COMPANY.contact.whatsapp}</p></>,
                      icon: <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
                    },
                    {
                      label: "Business Hours",
                      value: <p className="text-sm text-gray-500">{COMPANY.contact.hours}</p>,
                      icon: <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <div className="w-11 h-11 shrink-0 bg-gray-100 flex items-center justify-center" style={{ borderRadius: "12px" }}>
                        {item.icon}
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-1">{item.label}</Badge>
                        {typeof item.value === "string" ? (
                          <p className="text-sm text-gray-500 leading-relaxed">{item.value}</p>
                        ) : item.value}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 询盘指引 */}
              <Card className="bg-gray-50 border-[#EEEEEE]" style={{ borderRadius: "12px" }}>
                <CardContent>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">What to Include</h3>
                  <ul className="space-y-2.5">
                    {INQUIRY_GUIDE.map((item) => (
                      <li key={item.title} className="flex gap-2.5 text-sm">
                        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div>
                          <span className="text-gray-700 font-medium">{item.title}</span>
                          <span className="text-gray-400 ml-1">— {item.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 右栏 —— 询盘表单 */}
            <div className="lg:col-span-3">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Google 地图 */}
      <section className="py-4 bg-gray-50 border-t border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="aspect-[21/9] overflow-hidden bg-gray-200 border border-[#D0D1D2]" style={{ borderRadius: "12px" }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent("B-10 Qiaozhu North Road, Ronggui, Shunde, Foshan")}&z=17&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
              className=""
            />
          </div>
        </div>
      </section>
    </>
  );
}
