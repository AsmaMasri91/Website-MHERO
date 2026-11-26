"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { useLocalizedResolver } from "@/lib/forms/localizedResolver";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import LightSelect from "@/components/forms/LightSelect";
import { FormField } from "@/components/forms/TestDriveForm";

const required = z.string().trim().min(1, "Required");

const schema = z.object({
  firstName: required,
  lastName: required,
  email: z.string().trim().email(),
  phone: z.string().optional(),
  model: required,
  acceptTerms: z.boolean().refine(Boolean, { message: "Required" }),
  marketingConsent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function openMailDraft(href: string) {
  const link = document.createElement("a");
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Register Interest form. There is no mail backend, so submitting opens a
 * pre-filled draft in the visitor's own email app; they press Send there.
 */
export default function RegisterInterestForm() {
  const { locale, dict } = useLocale();
  const t = dict.registerInterest;
  const models = getModels(locale);
  const [draft, setDraft] = useState("");
  const resolver = useLocalizedResolver(schema);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      model: "",
      acceptTerms: false,
      marketingConsent: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    const modelName = models.find((m) => m.slug === values.model)?.name ?? values.model;
    const yesNo = (v: boolean) => (v ? dict.forms.yes : dict.forms.no);
    const body = [
      [dict.forms.firstName, values.firstName],
      [dict.forms.lastName, values.lastName],
      [dict.forms.emailAddress, values.email],
      [dict.forms.phoneNumber, values.phone || "—"],
      [t.preferredModel, modelName],
      [t.marketingLabel, yesNo(values.marketingConsent)],
    ]
      .map(([label, value]) => `${label}: ${value}`)
      .join("\r\n");
    const href = `mailto:${dict.contact.emailValue}?subject=${encodeURIComponent(
      `${t.title} - ${modelName}`
    )}&body=${encodeURIComponent(body)}`;
    setDraft(href);
    openMailDraft(href);
  };

  if (draft) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <h3 className="text-xl font-bold text-mhero-black">{t.draftTitle}</h3>
        <p className="text-mhero-steel">{t.draftBody}</p>
        <p className="text-sm text-mhero-steel">
          {t.draftFallback}{" "}
          <a href={draft} className="link-underline font-semibold text-mhero-black">
            <bdi>{dict.contact.emailValue}</bdi>
          </a>
        </p>
        <button type="button" onClick={() => setDraft("")} className="btn-outline mt-2">
          {t.editDetails}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label={dict.forms.firstName} required error={errors.firstName?.message}>
          <input className="input-field-light" autoComplete="given-name" placeholder={dict.forms.firstName} {...register("firstName")} />
        </FormField>
        <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
          <input className="input-field-light" autoComplete="family-name" placeholder={dict.forms.lastName} {...register("lastName")} />
        </FormField>
        <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
          <input className="input-field-light" type="email" autoComplete="email" placeholder="name@example.com" {...register("email")} />
        </FormField>
        <FormField label={dict.forms.phoneNumber}>
          <input className="input-field-light" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" {...register("phone")} />
        </FormField>
      </div>
      <FormField label={t.preferredModel} required error={errors.model?.message}>
        <LightSelect
          value={watch("model")}
          onChange={(v) => setValue("model", v, { shouldValidate: true })}
          placeholder={dict.forms.chooseModel}
          options={models.map((m) => ({ value: m.slug, label: m.name }))}
        />
      </FormField>

      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light shrink-0" {...register("acceptTerms")} />
          <span>
            {dict.testDrive.acceptTermsPrefix}{" "}
            <Link href="/terms" target="_blank" className="link-underline font-semibold text-mhero-black">
              {dict.testDrive.termsAndConditions}
            </Link>{" "}
            *
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-mhero-accent-dark">{errors.acceptTerms.message}</p>}
        <label className="flex cursor-pointer items-center gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light shrink-0" {...register("marketingConsent")} />
          <span>{dict.testDrive.marketingConsent}</span>
        </label>
      </div>

      <div>
        <button type="submit" className="btn-primary">
          {t.submit}
        </button>
      </div>
    </form>
  );
}
