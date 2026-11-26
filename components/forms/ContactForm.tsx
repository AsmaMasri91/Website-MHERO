"use client";

import { useForm } from "react-hook-form";
import { useLocalizedResolver } from "@/lib/forms/localizedResolver";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import LightSelect from "@/components/forms/LightSelect";
import PhoneField from "@/components/forms/PhoneField";
import { FormField } from "@/components/forms/TestDriveForm";
import { buildMailDraft, openMailDraft } from "@/lib/forms/mailDraft";

const required = z.string().trim().min(1, "Required");

const schema = z.object({
  title: z.string(),
  firstName: required,
  lastName: required,
  email: z.string().trim().email(),
  dialCode: z.string(),
  phone: required.refine((v) => /^[\d\s-]{6,15}$/.test(v), "Please enter a valid phone number"),
  model: required,
  location: required,
  message: required,
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  title: "",
  firstName: "",
  lastName: "",
  email: "",
  dialCode: "+971",
  phone: "",
  model: "",
  location: "",
  message: "",
};

function StepHeading({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-mhero-black text-xs font-semibold text-mhero-primary"
      >
        {index}
      </span>
      <h3 className="text-base font-semibold text-mhero-black">{title}</h3>
    </div>
  );
}

/**
 * There is no mail backend, so submitting opens a pre-filled draft in the
 * visitor's own email app; they press Send there.
 */
export default function ContactForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [draft, setDraft] = useState("");
  const confirmationRef = useRef<HTMLDivElement>(null);

  // The confirmation is much shorter than the form, so bring it into view.
  useEffect(() => {
    if (draft) confirmationRef.current?.scrollIntoView({ block: "center" });
  }, [draft]);
  const resolver = useLocalizedResolver(schema);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver, defaultValues });

  const titles = [
    { value: "mr", label: dict.forms.titleMr },
    { value: "mrs", label: dict.forms.titleMrs },
    { value: "ms", label: dict.forms.titleMs },
    { value: "dr", label: dict.forms.titleDr },
  ];
  const locations = [
    { value: "abu-dhabi", label: dict.contact.locationAbuDhabi },
    { value: "dubai", label: dict.contact.locationDubai },
  ];
  const modelOptions = models.map((m) => ({ value: m.slug, label: m.name }));

  const onSubmit = (values: FormValues) => {
    const labelOf = (options: { value: string; label: string }[], value: string) =>
      options.find((o) => o.value === value)?.label ?? "—";
    const modelName = labelOf(modelOptions, values.model);
    const href = buildMailDraft(dict.contact.emailValue, `${dict.contact.emailSubject} - ${modelName}`, [
      [dict.forms.title, labelOf(titles, values.title)],
      [dict.forms.firstName, values.firstName],
      [dict.forms.lastName, values.lastName],
      [dict.forms.emailAddress, values.email],
      [dict.forms.phoneNumber, `${values.dialCode} ${values.phone}`],
      [dict.contact.model, modelName],
      [dict.contact.location, labelOf(locations, values.location)],
      [dict.forms.message, values.message],
    ]);
    setDraft(href);
    openMailDraft(href);
  };

  if (draft) {
    return (
      <div
        ref={confirmationRef}
        role="status"
        className="flex flex-col items-start gap-4 border border-mhero-fog bg-white p-6 shadow-[0_20px_60px_rgba(20,20,22,0.07)] sm:p-10"
      >
        <h2 className="text-2xl font-bold leading-[1.3] text-mhero-black">{dict.contact.draftTitle}</h2>
        <p className="text-mhero-steel">{dict.contact.draftBody}</p>
        <p className="text-sm text-mhero-steel">
          {dict.contact.draftFallback}{" "}
          <a href={draft} className="link-underline font-semibold text-mhero-black">
            <bdi>{dict.contact.emailValue}</bdi>
          </a>
        </p>
        <button type="button" onClick={() => setDraft("")} className="btn-outline mt-2">
          {dict.contact.editDetails}
        </button>
      </div>
    );
  }

  const select = (name: "title" | "model" | "location") => ({
    value: watch(name),
    onChange: (v: string) => setValue(name, v, { shouldValidate: !!errors[name] }),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 border border-mhero-fog bg-white p-6 shadow-[0_20px_60px_rgba(20,20,22,0.07)] sm:p-10"
      noValidate
    >
      <div className="flex flex-col gap-2 border-b border-mhero-fog pb-8">
        <h2 className="text-2xl font-bold leading-[1.3] text-mhero-black md:text-3xl">{dict.contact.sendMessage}</h2>
        <p className="text-base text-mhero-steel">{dict.contact.sendMessageDescription}</p>
      </div>

      <div className="flex flex-col gap-5">
        <StepHeading index={1} title={dict.contact.yourDetails} />
        <div className="grid gap-5 sm:grid-cols-[120px_1fr_1fr]">
          <FormField label={dict.forms.title}>
            <LightSelect
              {...select("title")}
              placeholder="—"
              options={titles}
            />
          </FormField>
          <FormField label={dict.forms.firstName} required error={errors.firstName?.message}>
            <input className="input-field-light" autoComplete="given-name" {...register("firstName")} />
          </FormField>
          <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
            <input className="input-field-light" autoComplete="family-name" {...register("lastName")} />
          </FormField>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
            <input className="input-field-light" type="email" autoComplete="email" {...register("email")} />
          </FormField>
          <FormField label={dict.forms.phoneNumber} required error={errors.phone?.message}>
            <PhoneField
              dialCode={watch("dialCode")}
              dialCodeLabel={dict.contact.countryCode}
              dialCodeProps={register("dialCode")}
              {...register("phone")}
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <StepHeading index={2} title={dict.contact.enquiryDetails} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label={dict.contact.model} required error={errors.model?.message}>
            <LightSelect
              {...select("model")}
              placeholder={dict.contact.selectModel}
              options={modelOptions}
            />
          </FormField>
          <FormField label={dict.contact.location} required error={errors.location?.message}>
            <LightSelect
              {...select("location")}
              placeholder={dict.forms.selectLocation}
              options={locations}
            />
          </FormField>
        </div>
        <FormField label={dict.forms.message} required error={errors.message?.message}>
          <textarea
            className="input-field-light min-h-[140px] resize-y"
            rows={5}
            placeholder={dict.contact.messagePlaceholder}
            {...register("message")}
          />
        </FormField>
      </div>

      <div className="flex flex-col items-start gap-5 border-t border-mhero-fog pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm text-mhero-steel">
          {dict.contact.responseNote}{" "}
          <a href="tel:80064376" className="link-underline whitespace-nowrap font-semibold text-mhero-black">
            <bdi>{dict.contact.phoneValue}</bdi>
          </a>
        </p>
        <button type="submit" className="btn-primary w-full shrink-0 sm:w-auto">
          {dict.forms.sendMessage}
        </button>
      </div>
    </form>
  );
}
