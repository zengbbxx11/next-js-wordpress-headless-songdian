"use client"; // React Hook Form 需要在客户端运行

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number; // 仅用于 textarea
  registration: UseFormRegisterReturn;
}

export default function FormField({
  label,
  error,
  type = "text",
  placeholder,
  required = false,
  className,
  rows = 4,
  registration,
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={registration.name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={registration.name}
          {...registration}
          rows={rows}
          placeholder={placeholder}
          className={cn(
            hasError && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
          )}
        />
      ) : (
        <Input
          id={registration.name}
          type={type}
          {...registration}
          placeholder={placeholder}
          className={cn(
            hasError && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
          )}
        />
      )}

      {hasError && (
        <p className="text-sm text-red-500">{error?.message}</p>
      )}
    </div>
  );
}
