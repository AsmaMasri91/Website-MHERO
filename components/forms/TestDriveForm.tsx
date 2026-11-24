"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";
import { formatCurrency } from "@/lib/financeMath";
import LightSelect from "@/components/forms/LightSelect";
import DateDropdown from "@/components/forms/DateDropdown";

function buildTimeSlots(startMins: number, endMins: number): string[] {
  const slots: string[] = [];
  for (let mins = startMins; mins <= endMins; mins += 30) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

// Operating hours: 9:00 AM – 7:00 PM, for both standard and Private Viewing bookings.
const OPEN_MINS = 9 * 60;
const CLOSE_MINS = 19 * 60;
const TIME_SLOTS = buildTimeSlots(OPEN_MINS, CLOSE_MINS);
// Private Viewing shares the same 9:00 AM–7:00 PM window; the 4-hour notice
// rule (applied below) is what actually restricts which of these are bookable.
const PRIVATE_VIEWING_TIME_SLOTS = TIME_SLOTS;

const SHOWROOM_OPTIONS = ["DXB", "AUH", "Private Viewing"] as const;
const PRIVATE_VIEWING_NOTICE_HOURS = 4;

/**
 * A Private Viewing slot is only bookable if it falls on/after
 * (referenceTime + noticeHours). `referenceTime` must be the *actual* moment
 * of the check — pass Date.now() at submit time and a live-ticking clock for
 * on-screen slot rendering — never a value captured once when the form loaded.
 */
function isSlotWithinNotice(
  date: string,
  time: string,
  noticeHours: number,
  referenceTime: number = Date.now()
): boolean {
  if (!date || !time) return false;
  const slot = new Date(`${date}T${time}:00`);
  const earliestAllowed = new Date(referenceTime + noticeHours * 60 * 60 * 1000);
  return slot < earliestAllowed;
}

const carImages: Record<string, string> = {
  "mhero-1": "/images/models/mhero-1-campaign.png",
  "mhero-2": "/images/models/mhero-2-campaign.png",
  "mhero-2-terrain": "/images/models/mhero-2-campaign.png",
};

const schema = z
  .object({
    model: z.string().min(1),
    variant: z.string().optional(),
    showroom: z.string().min(1),
    date: z.string().min(1),
    time: z.string().min(1),
    title: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    notes: z.string().optional(),
    acceptTerms: z.boolean(),
    marketingConsent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.acceptTerms) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["acceptTerms"], message: "Required" });
    }
    if (
      data.showroom === "Private Viewing" &&
      data.date &&
      data.time &&
      isSlotWithinNotice(data.date, data.time, PRIVATE_VIEWING_NOTICE_HOURS)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: "Private Viewing requires a minimum of 4 hours' notice.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function SectionHeader({ index, title }: { index: number; title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="flex items-start rounded-[12px] bg-mhero-black px-[9px] py-1 text-[11px] font-medium uppercase leading-[1.4] tracking-widest2 text-white">
        {index}
      </span>
      <h3 className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-black">{title}</h3>
    </div>
  );
}

function ShowroomSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <LightSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={SHOWROOM_OPTIONS.map((s) => ({ value: s, label: s }))}
    />
  );
}

export function FormField({
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
    <div className="flex flex-col gap-1.5">
      <label className="block text-xs font-medium uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-mhero-accent-dark">{error}</p>}
    </div>
  );
}

export default function TestDriveForm() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const [submitted, setSubmitted] = useState(false);

  // Live clock used only to keep the Private Viewing 4-hour notice window
  // accurate while the form sits open (e.g. left open for a couple of
  // hours). The definitive check still re-runs against the real submission
  // instant inside the zod schema when the form is actually submitted.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: models[0]?.slug ?? "",
      variant: models[0]?.variants[0]?.id ?? "",
      showroom: "",
      date: "",
      time: "",
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      acceptTerms: false,
      marketingConsent: false,
    },
  });

  const selectedModelSlug = watch("model");
  const selectedVariantId = watch("variant");
  const selectedTime = watch("time");
  const selectedShowroom = watch("showroom");
  const selectedDate = watch("date");
  const selectedModel = models.find((m) => m.slug === selectedModelSlug) ?? models[0];

  // Pre-select model/variant when arriving from the compare page (?model=...&variant=...).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = models.find((x) => x.slug === params.get("model"));
    if (!m) return;
    setValue("model", m.slug);
    const v = m.variants.find((x) => x.id === params.get("variant")) ?? m.variants[0];
    setValue("variant", v?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPrivateViewing = selectedShowroom === "Private Viewing";
  const visibleTimeSlots = isPrivateViewing ? PRIVATE_VIEWING_TIME_SLOTS : TIME_SLOTS;
  const slotDisabled = (t: string) =>
    isPrivateViewing && isSlotWithinNotice(selectedDate, t, PRIVATE_VIEWING_NOTICE_HOURS, now);
  const hasValidSlotsForDate =
    !isPrivateViewing || !selectedDate || visibleTimeSlots.some((t) => !slotDisabled(t));

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset({
      model: models[0]?.slug ?? "",
      variant: models[0]?.variants[0]?.id ?? "",
      showroom: "",
      date: "",
      time: "",
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      acceptTerms: false,
      marketingConsent: false,
    });
  };

  if (submitted) {
    return (
      <div className="border border-mhero-fog bg-white p-10 text-center">
        <h3 className="text-2xl font-bold text-mhero-black">
          {locale === "ar" ? "تم طلب تجربة القيادة" : "Test Drive Requested"}
        </h3>
        <p className="mt-3 text-mhero-steel">
          {locale === "ar"
            ? "شكرًا لك. سيتواصل فريقنا معك قريبًا لتأكيد موعد تجربة القيادة."
            : "Thank you. Our team will contact you shortly to confirm your test drive appointment."}
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {locale === "ar" ? "احجز مرة أخرى" : "Book Another"}
        </button>
      </div>
    );
  }

  const timeOptions = visibleTimeSlots.map((t) => ({
    value: t,
    label: t,
    disabled: slotDisabled(t),
    badge: slotDisabled(t) ? (locale === "ar" ? "غير متاح" : "Unavailable") : undefined,
  }));
  const noSlotsMessage =
    isPrivateViewing && selectedDate && !hasValidSlotsForDate
      ? selectedDate === new Date(now).toISOString().slice(0, 10)
        ? locale === "ar"
          ? "لا تتوفر مواعيد معاينة خاصة اليوم. أقرب موعد متاح هو غدًا الساعة 9:00 صباحًا."
          : "No private viewing times are available today. The next available time is tomorrow at 9:00 AM."
        : locale === "ar"
        ? "لا تتوفر مواعيد معاينة خاصة صالحة في هذا التاريخ. الرجاء اختيار تاريخ آخر."
        : "No Private Viewing slots are available for this date. Please choose another date."
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10" noValidate>
      <SectionHeader index={1} title={dict.testDrive.chooseYourMhero} />
      <div className="bg-mhero-primary px-4 py-3 text-sm text-mhero-black">
        {locale === "ar"
          ? "يرجى ملاحظة أن رخصة قيادة إماراتية سارية مطلوبة لتجربة القيادة."
          : "Note that a valid UAE license is required for the test drive."}
      </div>
      <div className="grid gap-8 lg:grid-cols-[640px_1fr]">
        <div className="relative aspect-square w-full self-start overflow-hidden bg-white">
          {selectedModel && (
            <Image
              key={selectedModel.slug}
              src={carImages[selectedModel.slug]}
              alt={selectedModel.name}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-3">
          {models.map((m) => {
            const isActive = m.slug === selectedModelSlug;
            return (
              <button
                type="button"
                key={m.slug}
                onClick={() => {
                  setValue("model", m.slug);
                  setValue("variant", m.variants[0]?.id ?? "");
                }}
                className={`flex items-center gap-4 border p-3 text-start transition-colors ${
                  isActive ? "border-mhero-black" : "border-mhero-fog hover:border-mhero-black/40"
                }`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-mhero-fog">
                  <Image src={carImages[m.slug]} alt={m.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold leading-[1.4] text-mhero-black">{m.name}</p>
                  <p className="text-sm text-mhero-steel">
                    {dict.common.startingFrom} {formatCurrency(m.startingPrice, m.currency)}
                  </p>
                </div>
              </button>
            );
          })}
          {selectedModel && selectedModel.variants.length > 0 && (
            <>
              <p className="text-xs font-medium uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
                {dict.models.variant}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={dict.models.variant}>
                {selectedModel.variants.map((v) => {
                  const active = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setValue("variant", v.id)}
                      className={`border px-4 py-2.5 text-sm font-semibold leading-[1.4] transition-colors ${
                        active
                          ? "border-mhero-black bg-mhero-black text-white"
                          : "border-mhero-fog bg-white text-mhero-black hover:border-mhero-black"
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <SectionHeader index={2} title={dict.testDrive.whenAndWhere} />
      <div className="grid gap-6 md:grid-cols-3">
        <FormField label={dict.testDrive.preferredShowroom} required error={errors.showroom?.message}>
          <ShowroomSelect
            value={selectedShowroom}
            onChange={(v) => {
              setValue("showroom", v, { shouldValidate: true });
              if (
                v === "Private Viewing" &&
                selectedTime &&
                (!PRIVATE_VIEWING_TIME_SLOTS.includes(selectedTime) ||
                  isSlotWithinNotice(selectedDate, selectedTime, PRIVATE_VIEWING_NOTICE_HOURS))
              ) {
                setValue("time", "", { shouldValidate: true });
              }
            }}
            placeholder="—"
          />
        </FormField>
        <FormField label={dict.forms.preferredDate} required error={errors.date?.message}>
          <DateDropdown
            value={selectedDate}
            locale={locale}
            placeholder={dict.forms.selectDate}
            onChange={(v) => {
              setValue("date", v, { shouldValidate: true });
              if (isPrivateViewing && selectedTime && isSlotWithinNotice(v, selectedTime, PRIVATE_VIEWING_NOTICE_HOURS)) {
                setValue("time", "", { shouldValidate: true });
              }
            }}
          />
        </FormField>
        <FormField label={dict.forms.preferredTime} required error={errors.time?.message}>
          <LightSelect
            value={selectedTime}
            onChange={(v) => setValue("time", v, { shouldValidate: true })}
            placeholder={dict.forms.selectTime}
            disabled={!!noSlotsMessage}
            options={timeOptions}
          />
        </FormField>
      </div>
      {selectedShowroom === "Private Viewing" && (
        <div className="flex items-start gap-3 border border-mhero-primary bg-mhero-primary/25 px-4 py-3 text-sm text-mhero-black">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mhero-primary text-xs font-bold text-white"
          >
            !
          </span>
          <p>
            <span className="font-semibold">{locale === "ar" ? "إشعار: " : "Notice: "}</span>
            {locale === "ar"
              ? "تتطلب المعاينة الخاصة حدًا أدنى 4 ساعات من الإشعار المسبق."
              : "Private Viewing requires a minimum of 4 hours' notice."}
          </p>
        </div>
      )}
      {noSlotsMessage && (
        <p className="border border-mhero-fog bg-mhero-fog/30 px-4 py-3 text-sm text-mhero-steel">{noSlotsMessage}</p>
      )}

      <SectionHeader index={3} title={dict.testDrive.yourDetails} />
      <div className="grid gap-6 md:grid-cols-3">
        <FormField label={dict.forms.title} required error={errors.title?.message}>
          <LightSelect
            value={watch("title")}
            onChange={(v) => setValue("title", v, { shouldValidate: true })}
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
          <input className="input-field-light" placeholder={dict.forms.firstName} {...register("firstName")} />
        </FormField>
        <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
          <input className="input-field-light" placeholder={dict.forms.lastName} {...register("lastName")} />
        </FormField>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
          <input className="input-field-light" type="email" placeholder="name@example.com" {...register("email")} />
        </FormField>
        <FormField label={dict.forms.phoneNumber}>
          <input className="input-field-light" type="tel" placeholder="+971 50 123 4567" {...register("phone")} />
        </FormField>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light" {...register("acceptTerms")} />
          <span>
            {dict.testDrive.acceptTermsPrefix}{" "}
            <Link href="/terms" className="link-underline font-semibold text-mhero-black">
              {dict.testDrive.termsAndConditions}
            </Link>{" "}
            *
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-mhero-accent-dark">{errors.acceptTerms.message}</p>}
        <label className="flex cursor-pointer items-center gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light" {...register("marketingConsent")} />
          <span>{dict.testDrive.marketingConsent}</span>
        </label>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? dict.forms.booking : dict.testDrive.confirmRequest}
        </button>
      </div>
    </form>
  );
}
