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

const cameraCategories = [
  { label: "Compact Digital Cameras", value: "compact-digital-cameras" },
  { label: "Mirrorless Cameras", value: "mirrorless-cameras" },
  { label: "Action Cameras", value: "action-cameras" },
  { label: "Kids Cameras", value: "kids-cameras" },
  { label: "Video Cameras / Camcorders", value: "video-cameras-camcorders" },
  { label: "Custom OEM/ODM Project", value: "custom-oem-odm-project" },
];

const preferredContactOptions = [
  { label: "Email", value: "email" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Phone", value: "phone" },
];

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

type InquiryFormValues = z.infer<typeof inquirySchema>;

const submitInquiry = createSafeAction({
  schema: inquirySchema,
  handler: async (data) => {
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

  const onSubmit = async (values: InquiryFormValues) => {
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
      <Card className="w-full border-[#EEEEEE]" style={{ borderRadius: "12px" }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Send an Inquiry</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Fill out the form below and our team will contact you shortly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
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

            <FormField
              label="Your Requirements"
              type="textarea"
              placeholder="Please describe your product requirements, target specifications, expected delivery timeline, and any other relevant details..."
              rows={5}
              required
              registration={register("message")}
              error={errors.message}
            />

            <FormSelect
              name="preferredContact"
              label="Preferred Contact Method"
              control={control}
              error={errors.preferredContact}
              options={preferredContactOptions}
              placeholder="Select method..."
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "#3E6AE1",
                  color: "#FFFFFF",
                  borderRadius: "4px",
                  transitionDuration: "0.33s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLElement).style.backgroundColor = "#3561CC";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#3E6AE1";
                }}
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
