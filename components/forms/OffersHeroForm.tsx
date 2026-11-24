"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getOffers } from "@/lib/i18n/data";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  offer: z.string().optional(),
  consent: z.boolean().refine((v) => v, "Please accept to continue"),
});

type FormValues = z.infer<typeof schema>;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function OffersHeroForm() {
  const { locale, dict } = useLocale();
  const offers = getOffers(locale);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  };

  const o = dict.offers;

  return (
    <div className="bg-white p-6 text-mhero-black sm:p-8">
      {submitted ? (
        <div role="status" className="py-6 text-center">
          <h2 className="text-xl font-bold">{o.formSuccessTitle}</h2>
          <p className="mt-3 text-sm text-mhero-steel">{o.formSuccessBody}</p>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-dark mt-6 w-full">
            {o.formAnother}
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold leading-[1.3]">{o.formTitle}</h2>
          <p className="mt-4 text-sm text-mhero-steel">{o.formSubtitle}</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
            <Field id="oh-name" label={dict.forms.fullName} error={errors.fullName?.message}>
              <input id="oh-name" autoComplete="name" placeholder="Enter your full name" className="input-field-light" {...register("fullName")} />
            </Field>
            <Field id="oh-phone" label={dict.forms.phoneNumber} error={errors.phone?.message}>
              <input id="oh-phone" type="tel" autoComplete="tel" placeholder="+971 50 123 4567" className="input-field-light" {...register("phone")} />
            </Field>
            <Field id="oh-email" label={dict.forms.email} error={errors.email?.message}>
              <input id="oh-email" type="email" autoComplete="email" placeholder="name@example.com" className="input-field-light" {...register("email")} />
            </Field>
            <Field id="oh-offer" label={o.formOfferLabel}>
              <select id="oh-offer" className="input-field-light" {...register("offer")}>
                <option value="">{o.formOfferPlaceholder}</option>
                {offers.map((offer) => (
                  <option key={offer.slug} value={offer.slug}>
                    {offer.title}
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <label className="flex items-center gap-3 text-sm text-mhero-steel">
                <input type="checkbox" className="checkbox-field-light shrink-0" {...register("consent")} />
                <span>{o.formConsent}</span>
              </label>
              {errors.consent && (
                <p role="alert" className="mt-1 text-xs text-red-700">
                  {errors.consent.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-dark w-full py-3.5 disabled:opacity-60">
              {isSubmitting ? dict.forms.sending : o.formSubmit}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
