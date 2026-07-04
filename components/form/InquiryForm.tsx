"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createSafeAction } from "next-safe-form";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// 产品分类下拉选项（相机类别）
const cameraCategories = [
  { label: "Compact Digital Cameras", value: "compact-digital-cameras" },
  { label: "Mirrorless Cameras", value: "mirrorless-cameras" },
  { label: "Action Cameras", value: "action-cameras" },
  { label: "Kids Cameras", value: "kids-cameras" },
  { label: "Video Cameras / Camcorders", value: "video-cameras-camcorders" },
  { label: "Custom OEM/ODM Project", value: "custom-oem-odm-project" },
];

// 首选联系方式下拉选项
const preferredContactOptions = [
  { label: "Email", value: "email" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Phone", value: "phone" },
];

// Zod 校验模式 —— 定义表单字段的验证规则
const inquirySchema = z.object({
  fullName: z.string().min(2, "姓名至少需要 2 个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  phone: z.string().optional(),
  company: z.string().optional(),
  productInterest: z.string().min(1, "请选择产品类型"),
  quantity: z.string().optional(),
  message: z.string().min(10, "留言至少需要 10 个字符"),
  preferredContact: z.string().optional(),
});

// 从 Zod 模式推断 TypeScript 类型
type InquiryFormValues = z.infer<typeof inquirySchema>;

// 使用 next-safe-form 创建安全的表单提交动作（含服务端二次校验）
const submitInquiry = createSafeAction({
  schema: inquirySchema,
  handler: async (data) => {
    // 模拟 API 调用 —— 实际项目中替换为真实的服务器请求
    await new Promise((resolve) => setTimeout(resolve, 500));
    return data;
  },
});

export default function InquiryForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      productInterest: "",
      quantity: "",
      message: "",
      preferredContact: "",
    },
  });

  // 提交回调 —— 将表单值转为 FormData 后调用 safe action
  const onSubmit = async (values: InquiryFormValues) => {
    // 将表单值转换为 FormData 以传递给 safe action
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await submitInquiry(null, formData);
    if (result.success) {
      alert("感谢您的询盘！我们将在 24 小时内与您联系。");
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full shadow-lg border-gray-200/70">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Send an Inquiry</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Fill out the form below and our team will contact you shortly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            {/* 姓名 + 邮箱 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Full Name"
                type="text"
                placeholder="John Smith"
                required
                registration={register("fullName")}
                error={errors.fullName}
              />
              <FormField
                label="Email"
                type="email"
                placeholder="john@company.com"
                required
                registration={register("email")}
                error={errors.email}
              />
            </div>

            {/* 电话 + 公司 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Phone / WhatsApp"
                type="tel"
                placeholder="+1 234 567 8900"
                registration={register("phone")}
                error={errors.phone}
              />
              <FormField
                label="Company Name"
                type="text"
                placeholder="Your Company Inc."
                registration={register("company")}
                error={errors.company}
              />
            </div>

            {/* 产品兴趣 + 数量 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormSelect
                name="productInterest"
                label="Product Interest"
                control={control}
                error={errors.productInterest}
                options={cameraCategories}
                placeholder="Select camera type..."
                required
              />
              <FormField
                label="Estimated Order Quantity"
                type="text"
                placeholder="e.g. 500 units"
                registration={register("quantity")}
                error={errors.quantity}
              />
            </div>

            {/* 留言 */}
            <FormField
              label="Your Requirements"
              type="textarea"
              placeholder="Please describe your product requirements, target specifications, expected delivery timeline, and any other relevant details..."
              rows={5}
              required
              registration={register("message")}
              error={errors.message}
            />

            {/* 首选联系方式 */}
            <FormSelect
              name="preferredContact"
              label="Preferred Contact Method"
              control={control}
              error={errors.preferredContact}
              options={preferredContactOptions}
              placeholder="Select method..."
            />

            {/* 提交按钮 */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-sm font-semibold transition-all duration-200"
                style={{ backgroundColor: "#d4343e" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
