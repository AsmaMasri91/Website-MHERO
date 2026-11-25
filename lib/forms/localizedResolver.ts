"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";
import { useLocale } from "@/components/i18n/LocaleProvider";

const AR_MESSAGES: Record<string, string> = {
  Required: "مطلوب",
  "Invalid email": "عنوان البريد الإلكتروني غير صالح",
  "Please enter a valid email": "عنوان البريد الإلكتروني غير صالح",
  "String must contain at least 1 character(s)": "يجب أن يحتوي النص على حرف واحد على الأقل",
  "Please enter your full name": "يرجى إدخال اسمك الكامل",
  "Please enter a valid phone number": "يرجى إدخال رقم هاتف صالح",
  "Please accept to continue": "يرجى الموافقة للمتابعة",
  "Private Viewing requires a minimum of 4 hours' notice.": "تتطلب المعاينة الخاصة إشعارًا قبل 4 ساعات على الأقل.",
};

function translate(errors: unknown) {
  if (!errors || typeof errors !== "object") return;
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (key === "ref" || !value || typeof value !== "object") continue;
    const error = value as { message?: unknown };
    if (typeof error.message === "string") {
      error.message = AR_MESSAGES[error.message] ?? error.message;
    } else {
      translate(value);
    }
  }
}

/** zodResolver whose validation messages follow the current site language. */
export function useLocalizedResolver<T extends FieldValues>(schema: z.ZodType<T, z.ZodTypeDef, unknown>): Resolver<T> {
  const { locale } = useLocale();
  const resolve = zodResolver(schema) as Resolver<T>;

  return async (values, context, options) => {
    const result = await resolve(values, context, options);
    if (locale === "ar") translate(result.errors);
    return result;
  };
}
