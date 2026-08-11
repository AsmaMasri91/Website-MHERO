"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import PlateNumberField from "@/components/forms/PlateNumberField";
import { useLocale } from "@/components/i18n/LocaleProvider";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
];

const LOCATIONS = [
  { value: "dubai-al-ittihad", en: "Dubai Al Ittihad", ar: "دبي الاتحاد" },
  { value: "sharjah", en: "Sharjah", ar: "الشارقة" },
  { value: "ras-al-khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { value: "abu-dhabi-mussafah", en: "Abu Dhabi Mussafah", ar: "أبوظبي مصفح" },
];

const SERVICE_INTERVALS = [
  { value: "asap", en: "As Soon As Possible", ar: "في أقرب وقت ممكن" },
  { value: "5000", en: "Next 5,000 km", ar: "خلال 5,000 كم القادمة" },
  { value: "10000", en: "Next 10,000 km", ar: "خلال 10,000 كم القادمة" },
  { value: "20000", en: "Next 20,000 km", ar: "خلال 20,000 كم القادمة" },
];

const schema = z
  .object({
    title: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email(),
    plateEmirate: z.string().min(1),
    plateCode: z.string().min(1),
    plateNumber: z.string().min(1),
    purpose: z.string().min(1),
    serviceInterval: z.string().min(1),
    location: z.string().min(1),
    appointmentDate: z.string().min(1),
    appointmentTime: z.string().min(1),
    requestPickupDropoff: z.boolean(),
    pickUp: z.boolean(),
    pickUpAddress: z.string().optional(),
    pickUpDate: z.string().optional(),
    pickUpTime: z.string().optional(),
    pickUpInstructions: z.string().optional(),
    dropOff: z.boolean(),
    dropOffAddress: z.string().optional(),
    dropOffDate: z.string().optional(),
    dropOffTime: z.string().optional(),
    dropOffInstructions: z.string().optional(),
    message: z.string().optional(),
    agreePrivacy: z.boolean(),
    verificationCode: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (!data.agreePrivacy) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["agreePrivacy"], message: "Required" });
    }
    if (data.requestPickupDropoff && data.pickUp) {
      if (!data.pickUpAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickUpAddress"], message: "Required" });
      if (!data.pickUpDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickUpDate"], message: "Required" });
      if (!data.pickUpTime) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickUpTime"], message: "Required" });
    }
    if (data.requestPickupDropoff && data.dropOff) {
      if (!data.dropOffAddress) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dropOffAddress"], message: "Required" });
      if (!data.dropOffDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dropOffDate"], message: "Required" });
      if (!data.dropOffTime) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dropOffTime"], message: "Required" });
    }
  });

type FormValues = z.infer<typeof schema>;

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

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
      <label className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-mhero-ash">
        {label}
        {required && " *"}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-mhero-accent-dark">{error}</p>}
    </div>
  );
}

function YesNoRow({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border border-mhero-fog p-4">
      <p className="text-sm font-medium text-mhero-black">{label}</p>
      <div className="inline-flex border border-mhero-fog">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-5 py-2 text-sm font-semibold transition-colors ${
            value ? "bg-mhero-black text-white" : "bg-white text-mhero-steel hover:bg-mhero-fog/50"
          }`}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`border-s border-mhero-fog px-5 py-2 text-sm font-semibold transition-colors ${
            !value ? "bg-mhero-black text-white" : "bg-white text-mhero-steel hover:bg-mhero-fog/50"
          }`}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
}

export default function ServiceBookingForm() {
  const { locale, dict } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState(generateCode);
  const [codeError, setCodeError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      plateEmirate: "",
      plateCode: "",
      plateNumber: "",
      purpose: "",
      serviceInterval: "",
      location: "",
      appointmentDate: "",
      appointmentTime: "",
      requestPickupDropoff: false,
      pickUp: false,
      dropOff: false,
      message: "",
      agreePrivacy: false,
      verificationCode: "",
    },
  });

  const requestPickupDropoff = watch("requestPickupDropoff");
  const pickUp = watch("pickUp");
  const dropOff = watch("dropOff");

  const locationOptions = useMemo(
    () => LOCATIONS.map((l) => ({ value: l.value, label: locale === "ar" ? l.ar : l.en })),
    [locale]
  );

  const onSubmit = async (data: FormValues) => {
    if (data.verificationCode.trim().toUpperCase() !== code) {
      setCodeError(true);
      return;
    }
    setCodeError(false);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setCode(generateCode());
    reset();
  };

  if (submitted) {
    return (
      <div className="border border-mhero-fog bg-white p-10 text-center">
        <h3 className="text-2xl font-bold text-mhero-black">{dict.forms.serviceBooked}</h3>
        <p className="mt-3 text-mhero-steel">{dict.forms.serviceBookedThankYou}</p>
        <button onClick={() => setSubmitted(false)} className="btn-outline mt-6">
          {dict.forms.bookAnotherService}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-mhero-fog bg-white p-8 md:p-10" noValidate>
      <p className="mb-8 text-xs text-mhero-ash">{dict.forms.fieldsRequired}</p>

      <SectionHeader index={1} title={dict.forms.personalInformation} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2 sm:max-w-xs">
          <Field label={dict.forms.title} required error={errors.title?.message}>
            <select className="input-field-light" {...register("title")}>
              <option value="">—</option>
              <option value="mr">{dict.forms.titleMr}</option>
              <option value="mrs">{dict.forms.titleMrs}</option>
              <option value="ms">{dict.forms.titleMs}</option>
              <option value="dr">{dict.forms.titleDr}</option>
            </select>
          </Field>
        </div>
        <Field label={dict.forms.firstName} required error={errors.firstName?.message}>
          <input className="input-field-light" {...register("firstName")} />
        </Field>
        <Field label={dict.forms.lastName} required error={errors.lastName?.message}>
          <input className="input-field-light" {...register("lastName")} />
        </Field>
        <Field label={dict.forms.phoneNumber}>
          <div className="flex">
            <span className="flex items-center border border-e-0 border-mhero-fog bg-mhero-fog/40 px-3 text-sm text-mhero-steel">
              🇦🇪 +971
            </span>
            <input className="input-field-light" type="tel" placeholder="50 123 4567" {...register("phone")} />
          </div>
        </Field>
        <Field label={dict.forms.emailAddress} required error={errors.email?.message}>
          <input className="input-field-light" type="email" {...register("email")} />
        </Field>
      </div>

      <div className="mt-10">
        <SectionHeader index={2} title={dict.forms.vehicleDetails} />
        <Controller
          control={control}
          name="plateEmirate"
          render={({ field: emirateField }) => (
            <Controller
              control={control}
              name="plateCode"
              render={({ field: codeField }) => (
                <Controller
                  control={control}
                  name="plateNumber"
                  render={({ field: numberField }) => (
                    <PlateNumberField
                      light
                      emirate={emirateField.value}
                      onEmirateChange={emirateField.onChange}
                      code={codeField.value}
                      onCodeChange={codeField.onChange}
                      number={numberField.value}
                      onNumberChange={numberField.onChange}
                      emirateError={errors.plateEmirate?.message}
                      codeError={errors.plateCode?.message}
                      numberError={errors.plateNumber?.message}
                    />
                  )}
                />
              )}
            />
          )}
        />
      </div>

      <div className="mt-10">
        <SectionHeader index={3} title={dict.forms.appointmentDetails} />
        <div className="space-y-5">
          <Field label={dict.forms.purposeOfVisit} required error={errors.purpose?.message}>
            <select className="input-field-light" {...register("purpose")}>
              <option value="">{dict.forms.selectPurpose}</option>
              <option value="maintenance">{dict.forms.purposeOptions.maintenance}</option>
              <option value="repair">{dict.forms.purposeOptions.repair}</option>
              <option value="warranty">{dict.forms.purposeOptions.warranty}</option>
              <option value="recall">{dict.forms.purposeOptions.recall}</option>
              <option value="other">{dict.forms.purposeOptions.other}</option>
            </select>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Field label={dict.forms.serviceNextInterval} required error={errors.serviceInterval?.message}>
                <select className="input-field-light" {...register("serviceInterval")}>
                  <option value="">{dict.forms.selectServiceInterval}</option>
                  {SERVICE_INTERVALS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {locale === "ar" ? s.ar : s.en}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="mt-1.5 text-xs text-mhero-ash">{dict.forms.serviceIntervalHint}</p>
            </div>
            <Field label={dict.forms.location} required error={errors.location?.message}>
              <select className="input-field-light" {...register("location")}>
                <option value="">{dict.forms.selectLocation}</option>
                {locationOptions.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={dict.forms.preferredAppointmentDate} required error={errors.appointmentDate?.message}>
              <input className="input-field-light" type="date" {...register("appointmentDate")} />
            </Field>
            <div>
              <Field label={dict.forms.preferredAppointmentTime} required error={errors.appointmentTime?.message}>
                <select className="input-field-light" {...register("appointmentTime")}>
                  <option value="">{dict.forms.selectTime}</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="mt-1.5 text-xs text-mhero-ash">{dict.forms.appointmentTimeHint}</p>
            </div>
          </div>

          <Controller
            control={control}
            name="requestPickupDropoff"
            render={({ field }) => (
              <YesNoRow
                label={dict.forms.requestPickupDropoff}
                value={field.value}
                onChange={field.onChange}
                yesLabel={dict.forms.yes}
                noLabel={dict.forms.no}
              />
            )}
          />

          {requestPickupDropoff && (
            <>
              <Controller
                control={control}
                name="pickUp"
                render={({ field }) => (
                  <YesNoRow
                    label={dict.forms.pickUp}
                    value={field.value}
                    onChange={field.onChange}
                    yesLabel={dict.forms.yes}
                    noLabel={dict.forms.no}
                  />
                )}
              />
              {pickUp && (
                <div className="grid gap-5 border border-mhero-fog p-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label={dict.forms.address} required error={errors.pickUpAddress?.message}>
                      <input className="input-field-light" {...register("pickUpAddress")} />
                    </Field>
                  </div>
                  <Field label={dict.forms.preferredDate} required error={errors.pickUpDate?.message}>
                    <input className="input-field-light" type="date" {...register("pickUpDate")} />
                  </Field>
                  <Field label={dict.forms.preferredTime} required error={errors.pickUpTime?.message}>
                    <select className="input-field-light" {...register("pickUpTime")}>
                      <option value="">{dict.forms.selectTime}</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label={dict.forms.instructions}>
                      <textarea
                        className="input-field-light min-h-[80px]"
                        placeholder={dict.forms.instructionsPlaceholder}
                        {...register("pickUpInstructions")}
                      />
                    </Field>
                  </div>
                </div>
              )}

              <Controller
                control={control}
                name="dropOff"
                render={({ field }) => (
                  <YesNoRow
                    label={dict.forms.dropOff}
                    value={field.value}
                    onChange={field.onChange}
                    yesLabel={dict.forms.yes}
                    noLabel={dict.forms.no}
                  />
                )}
              />
              {dropOff && (
                <div className="grid gap-5 border border-mhero-fog p-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label={dict.forms.address} required error={errors.dropOffAddress?.message}>
                      <input className="input-field-light" {...register("dropOffAddress")} />
                    </Field>
                  </div>
                  <Field label={dict.forms.preferredDate} required error={errors.dropOffDate?.message}>
                    <input className="input-field-light" type="date" {...register("dropOffDate")} />
                  </Field>
                  <Field label={dict.forms.preferredTime} required error={errors.dropOffTime?.message}>
                    <select className="input-field-light" {...register("dropOffTime")}>
                      <option value="">{dict.forms.selectTime}</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label={dict.forms.instructions}>
                      <textarea
                        className="input-field-light min-h-[80px]"
                        placeholder={dict.forms.instructionsPlaceholder}
                        {...register("dropOffInstructions")}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </>
          )}

          <Field label={dict.forms.leaveMessage}>
            <textarea
              className="input-field-light min-h-[100px]"
              placeholder={dict.forms.leaveMessagePlaceholder}
              {...register("message")}
            />
          </Field>
        </div>
      </div>

      <label className="mt-8 flex cursor-pointer items-start gap-3 border border-mhero-fog p-4 text-sm text-mhero-steel">
        <input type="checkbox" className="checkbox-field-light mt-0.5" {...register("agreePrivacy")} />
        <span>
          {dict.forms.privacyAgreePrefix}{" "}
          <a href="/legal/privacy-policy" className="link-underline font-semibold text-mhero-black">
            {dict.forms.privacyPolicy}
          </a>
        </span>
      </label>
      {errors.agreePrivacy && (
        <p className="mt-1.5 text-xs text-mhero-accent-dark">{errors.agreePrivacy.message}</p>
      )}

      <div className="mt-6 border-t border-mhero-fog pt-6">
        <Field label={dict.forms.verificationCode} required error={codeError ? dict.forms.invalidCode : errors.verificationCode?.message}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-[46px] items-center justify-center border border-mhero-fog bg-mhero-fog/40 px-6 text-lg font-bold tracking-[0.3em] text-mhero-black">
              {code}
            </span>
            <button
              type="button"
              onClick={() => setCode(generateCode())}
              aria-label="Refresh code"
              className="flex h-[46px] w-[46px] items-center justify-center border border-mhero-fog text-mhero-steel hover:border-mhero-black hover:text-mhero-black"
            >
              ↻
            </button>
            <input
              className="input-field-light w-40"
              placeholder={dict.forms.enterCode}
              {...register("verificationCode")}
            />
          </div>
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? dict.forms.booking : dict.forms.submit}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setValue("requestPickupDropoff", false);
          }}
          className="btn-outline"
        >
          {dict.forms.cancel}
        </button>
      </div>
    </form>
  );
}
