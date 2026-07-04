"use client"; // 表单组件需要客户端交互

import { Controller, type Control, type FieldError, type FieldPath, type FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  control: Control<TFieldValues>;
  error?: FieldError;
  options: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

export default function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  control,
  error,
  options,
  placeholder = "Select...",
  required = false,
}: FormSelectProps<TFieldValues, TName>) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>

      {/* Controller 将 react-hook-form 的 control 与 shadcn Select 组件桥接 */}
      <Controller<TFieldValues, TName>
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={cn(
                "w-full",
                hasError && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {hasError && (
        <p className="text-sm text-red-500">{error?.message}</p>
      )}
    </div>
  );
}
