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
    <div className="mb-6 flex items-center gap-3 border-b border-mhero-fog pb-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mhero-black text-xs font-bold text-white">
        {index}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-widest2 text-mhero-black">{title}</h3>
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
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-mhero-ash">
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-mhero-fog bg-white p-8 md:p-10" noValidate>
      <SectionHeader index={1} title={dict.testDrive.chooseYourMhero} />
      <div className="mb-6 flex items-start gap-3 border border-mhero-primary bg-mhero-primary/15 px-4 py-3 text-sm text-mhero-black">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mhero-primary text-xs font-bold text-white"
        >
          i
        </span>
        <p>
          {locale === "ar"
            ? "يرجى ملاحظة أن رخصة قيادة إماراتية سارية مطلوبة لتجربة القيادة."
            : "Note that a valid UAE license is required for the test drive."}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-mhero-fog/40 lg:aspect-auto">
          {selectedModel && (
            <Image
              key={selectedModel.slug}
              src={carImages[selectedModel.slug]}
              alt={selectedModel.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
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
                className={`flex items-center gap-3 border p-3 text-start transition-colors ${
                  isActive ? "border-mhero-black bg-mhero-fog/30" : "border-mhero-fog hover:border-mhero-black/40"
                }`}
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-mhero-fog">
                  <Image src={carImages[m.slug]} alt={m.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-mhero-black">{m.name}</p>
                  <p className="mt-1 text-xs text-mhero-steel">
                    {dict.common.startingFrom} {formatCurrency(m.startingPrice, m.currency)}
                  </p>
                  {isActive && (
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest2 text-mhero-black">
                      {locale === "ar" ? "محدد" : "Selected"}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
          {selectedModel && selectedModel.variants.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest2 text-mhero-steel">
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
                      className={`border px-4 py-2.5 text-sm font-semibold transition-colors ${
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
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader index={2} title={dict.testDrive.whenAndWhere} />
        <div className="space-y-5">
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
            {selectedShowroom === "Private Viewing" && (
              <div className="mt-3 flex items-start gap-3 border border-mhero-primary bg-mhero-primary/25 px-4 py-3 text-sm text-mhero-black">
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
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
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
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-mhero-ash">
                {dict.forms.preferredTime} *
              </label>
              {isPrivateViewing && selectedDate && !hasValidSlotsForDate ? (
                <p className="border border-mhero-fog bg-mhero-fog/30 px-3 py-3 text-xs text-mhero-steel">
                  {selectedDate === new Date(now).toISOString().slice(0, 10)
                    ? locale === "ar"
                      ? "لا تتوفر مواعيد معاينة خاصة اليوم. أقرب موعد متاح هو غدًا الساعة 9:00 صباحًا."
                      : "No private viewing times are available today. The next available time is tomorrow at 9:00 AM."
                    : locale === "ar"
                    ? "لا تتوفر مواعيد معاينة خاصة صالحة في هذا التاريخ. الرجاء اختيار تاريخ آخر."
                    : "No Private Viewing slots are available for this date. Please choose another date."}
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {visibleTimeSlots.map((t) => {
                    const disabled = slotDisabled(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        disabled={disabled}
                        onClick={() => setValue("time", t, { shouldValidate: true })}
                        title={
                          disabled
                            ? locale === "ar"
                              ? "خارج نافذة الإشعار لمدة 4 ساعات"
                              : "Outside the 4-hour notice window"
                            : undefined
                        }
                        className={`border px-2 py-2 text-xs font-semibold transition-colors ${
                          disabled
                            ? "cursor-not-allowed border-mhero-fog text-mhero-fog line-through"
                            : selectedTime === t
                            ? "border-mhero-black bg-mhero-black text-white"
                            : "border-mhero-fog text-mhero-steel hover:border-mhero-black/40"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.time && <p className="mt-1.5 text-xs text-mhero-accent-dark">{errors.time.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeader index={3} title={dict.forms.personalInformation} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 sm:max-w-xs">
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
          </div>
          <FormField label={dict.forms.firstName} required error={errors.firstName?.message}>
            <input className="input-field-light" {...register("firstName")} />
          </FormField>
          <FormField label={dict.forms.lastName} required error={errors.lastName?.message}>
            <input className="input-field-light" {...register("lastName")} />
          </FormField>
          <FormField label={dict.forms.emailAddress} required error={errors.email?.message}>
            <input className="input-field-light" type="email" {...register("email")} />
          </FormField>
          <FormField label={dict.forms.phoneNumber}>
            <div className="flex">
              <span className="flex items-center border border-e-0 border-mhero-fog bg-mhero-fog/40 px-3 text-sm text-mhero-steel">
                🇦🇪 +971
              </span>
              <input className="input-field-light" type="tel" placeholder="50 123 4567" {...register("phone")} />
            </div>
          </FormField>
          <div className="sm:col-span-2">
            <FormField label={dict.testDrive.additionalNotes}>
              <textarea
                className="input-field-light min-h-[100px]"
                placeholder={dict.testDrive.additionalNotesPlaceholder}
                {...register("notes")}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("acceptTerms")} />
          <span>
            {dict.testDrive.acceptTermsPrefix}{" "}
            <Link href="/terms" className="link-underline font-semibold text-mhero-black">
              {dict.testDrive.termsAndConditions}
            </Link>{" "}
            *
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-mhero-accent-dark">{errors.acceptTerms.message}</p>}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mhero-steel">
          <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("marketingConsent")} />
          <span>{dict.testDrive.marketingConsent}</span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-mhero-fog pt-6">
        <p className="max-w-sm text-xs text-mhero-ash">{dict.testDrive.submitNote}</p>
        <button type="submit" disabled={isSubmitting} className="btn-primary shrink-0">
          {isSubmitting ? dict.forms.booking : dict.testDrive.confirmRequest}
        </button>
      </div>
    </form>
  );
}
