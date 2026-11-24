"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  model: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-mhero-accent-dark">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-mhero-fog bg-white p-10 text-center">
        <h3 className="text-2xl font-bold text-mhero-black">{dict.forms.messageSent}</h3>
        <p className="mt-3 text-mhero-steel">{dict.forms.messageSentThankYou}</p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {dict.forms.sendAnotherMessage}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <h2 className="text-4xl font-bold leading-[1.2] tracking-[-0.9px] text-mhero-black">{dict.contact.sendMessage}</h2>
      <p className="text-base text-mhero-steel">{dict.contact.sendMessageDescription}</p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={dict.forms.firstName} required error={errors.firstName?.message}>
          <input className="input-field-light" placeholder={locale === "ar" ? "الاسم الأول" : "First name"} {...register("firstName")} />
        </Field>
        <Field label={dict.forms.lastName} required error={errors.lastName?.message}>
          <input className="input-field-light" placeholder={locale === "ar" ? "اسم العائلة" : "Last name"} {...register("lastName")} />
        </Field>
        <Field label={dict.forms.email} required error={errors.email?.message}>
          <input className="input-field-light" type="email" placeholder="name@example.com" {...register("email")} />
        </Field>
        <Field label={dict.forms.phoneNumber}>
          <input className="input-field-light" type="tel" placeholder="+971 50 123 4567" {...register("phone")} />
        </Field>
        <Field label={dict.contact.selectModel} error={errors.model?.message}>
          <select className="input-field-light" {...register("model")}>
            {models.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label={dict.contact.subject}>
          <input className="input-field-light" defaultValue={dict.contact.subjectGeneral} {...register("subject")} />
        </Field>
      </div>
      <Field label={dict.forms.message} required error={errors.message?.message}>
        <textarea
          className="input-field-light min-h-[56px]"
          rows={1}
          placeholder={locale === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help?"}
          {...register("message")}
        />
      </Field>
      <div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? dict.forms.sending : dict.forms.sendMessage}
        </button>
      </div>
      <p className="text-xs text-mhero-steel">{dict.contact.responseNote}</p>
    </form>
  );
}
