"use client";

import { useForm } from "react-hook-form";
import { useLocalizedResolver } from "@/lib/forms/localizedResolver";
import { z } from "zod";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import LightSelect from "@/components/forms/LightSelect";
import PhoneField from "@/components/forms/PhoneField";
import { FormField } from "@/components/forms/TestDriveForm";

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

export default function ContactForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);
  const resolver = useLocalizedResolver(schema);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver, defaultValues });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-mhero-fog bg-white p-10 text-center shadow-[0_20px_60px_rgba(20,20,22,0.07)]">
        <h3 className="text-2xl font-bold text-mhero-black">{dict.forms.messageSent}</h3>
        <p className="mt-3 text-mhero-steel">{dict.forms.messageSentThankYou}</p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {dict.forms.sendAnotherMessage}
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
              options={[
                { value: "mr", label: dict.forms.titleMr },
                { value: "mrs", label: dict.forms.titleMrs },
                { value: "ms", label: dict.forms.titleMs },
                { value: "dr", label: dict.forms.titleDr },
              ]}
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
              options={models.map((m) => ({ value: m.slug, label: m.name }))}
            />
          </FormField>
          <FormField label={dict.contact.location} required error={errors.location?.message}>
            <LightSelect
              {...select("location")}
              placeholder={dict.forms.selectLocation}
              options={[
                { value: "abu-dhabi", label: dict.contact.locationAbuDhabi },
                { value: "dubai", label: dict.contact.locationDubai },
              ]}
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
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full shrink-0 sm:w-auto">
          {isSubmitting ? dict.forms.sending : dict.forms.sendMessage}
        </button>
      </div>
    </form>
  );
}
