"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import LightSelect from "@/components/forms/LightSelect";

type Loc = { value: string; en: string; ar: string };

const COUNTRIES: Loc[] = [
  { value: "uae", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  { value: "saudi-arabia", en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  { value: "kuwait", en: "Kuwait", ar: "الكويت" },
  { value: "qatar", en: "Qatar", ar: "قطر" },
  { value: "bahrain", en: "Bahrain", ar: "البحرين" },
  { value: "oman", en: "Oman", ar: "عُمان" },
];

const CITIES_BY_COUNTRY: Record<string, Loc[]> = {
  uae: [
    { value: "dubai", en: "Dubai", ar: "دبي" },
    { value: "abu-dhabi", en: "Abu Dhabi", ar: "أبوظبي" },
    { value: "sharjah", en: "Sharjah", ar: "الشارقة" },
    { value: "ajman", en: "Ajman", ar: "عجمان" },
    { value: "ras-al-khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
    { value: "fujairah", en: "Fujairah", ar: "الفجيرة" },
    { value: "umm-al-quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
  ],
  "saudi-arabia": [
    { value: "riyadh", en: "Riyadh", ar: "الرياض" },
    { value: "jeddah", en: "Jeddah", ar: "جدة" },
    { value: "dammam", en: "Dammam", ar: "الدمام" },
  ],
  kuwait: [{ value: "kuwait-city", en: "Kuwait City", ar: "مدينة الكويت" }],
  qatar: [{ value: "doha", en: "Doha", ar: "الدوحة" }],
  bahrain: [{ value: "manama", en: "Manama", ar: "المنامة" }],
  oman: [{ value: "muscat", en: "Muscat", ar: "مسقط" }],
};

const SERVICE_CENTERS = [
  { value: "al-quoz", labelKey: "centerAlQuoz" as const, address: "MHERO Service Center — Al Quoz, Dubai" },
  { value: "abu-dhabi", labelKey: "centerAbuDhabi" as const, address: "MHERO Service Center — Abu Dhabi" },
];

const SERVICE_INTERVAL_OPTIONS = ["km5000", "km10000", "km20000", "km30000", "km40000", "km50000"] as const;
const SERVICE_INTERVAL_KMS: Record<(typeof SERVICE_INTERVAL_OPTIONS)[number], number> = {
  km5000: 5000,
  km10000: 10000,
  km20000: 20000,
  km30000: 30000,
  km40000: 40000,
  km50000: 50000,
};

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];
const LATE_SLOTS = ["15:00", "15:30", "16:00"];

const PICKUP_BUFFER_MINS = 60;

const REGISTERED_VEHICLES = [
  { id: "v1", model: "MHERO I", country: "uae", city: "dubai", plateCode: "A", plateNumber: "12345", lastCompletedKm: 10000 },
  { id: "v2", model: "MHERO II - Prime", country: "uae", city: "abu-dhabi", plateCode: "BC", plateNumber: "67890", lastCompletedKm: 0 },
];

const TRANSPORT_CHARGES: Record<string, { pickup: number; dropoff: number }> = {
  "al-quoz": { pickup: 50, dropoff: 50 },
  "abu-dhabi": { pickup: 120, dropoff: 120 },
};

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const dotIdx = domain.lastIndexOf(".");
  const ext = dotIdx >= 0 ? domain.slice(dotIdx) : "";
  return `${local[0]}***@xxx${ext}`;
}

function maskPhone(digits: string): string {
  const d = digits.replace(/[^0-9]/g, "");
  if (d.length < 7) return d;
  const g1 = d.slice(0, 2);
  const g2 = d.slice(2, 5);
  const g3 = d.slice(5);
  const g3Masked = g3.length > 2 ? "X".repeat(g3.length - 2) + g3.slice(-2) : g3;
  return `+971 ${g1} ${"X".repeat(g2.length)} ${g3Masked}`;
}

function maskPlateNumber(n: string): string {
  return "X".repeat(n.length);
}

function generateCaptcha(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return `MH-${Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function minutesFromTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function timeFromMinutes(mins: number): string {
  return `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`;
}

const schema = z
  .object({
    title: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email(),
    country: z.string().min(1),
    city: z.string().min(1),
    plateCode: z.string().min(1),
    plateNumber: z.string().min(1),
    purpose: z.string().min(1),
    purposeDetails: z.string().optional(),
    serviceInterval: z.string().optional(),
    serviceCenter: z.string().min(1),
    appointmentDate: z.string().min(1),
    appointmentTime: z.string().min(1),
    waitAtReception: z.boolean(),
    message: z.string().optional(),
    pickupType: z.enum(["not-required", "pickup", "dropoff", "both"]),
    tcAcknowledged: z.boolean(),
    pickUpAddress: z.string().optional(),
    pickupSectionDropOffAddress: z.string().optional(),
    dropOffAddress: z.string().optional(),
    pickUpTime: z.string().optional(),
    pickUpInstructions: z.string().optional(),
    dropOffInstructions: z.string().optional(),
    agreePrivacy: z.boolean(),
    captchaInput: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.purpose === "service" && !data.serviceInterval) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["serviceInterval"], message: "Required" });
    }
    if (data.purpose !== "service" && !data.purposeDetails?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["purposeDetails"], message: "Required" });
    }
    if (data.pickupType !== "not-required") {
      if (!data.tcAcknowledged) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["tcAcknowledged"], message: "Required" });
      }
      if ((data.pickupType === "pickup" || data.pickupType === "both") && !data.pickUpAddress?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickUpAddress"], message: "Required" });
      }
      if ((data.pickupType === "dropoff" || data.pickupType === "both") && !data.dropOffAddress?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dropOffAddress"], message: "Required" });
      }
      if ((data.pickupType === "pickup" || data.pickupType === "both") && !data.pickUpTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickUpTime"], message: "Required" });
      }
    }
    if (!data.agreePrivacy) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["agreePrivacy"], message: "Required" });
    }
  });

type FormValues = z.infer<typeof schema>;

function LockIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 6V4a3 3 0 116 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1 1.5L7 7.5L13 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1 text-xs font-medium uppercase tracking-widest2 text-mhero-ash">
        {label}
        {required && <span className="text-mhero-primary">*</span>}
        {hint && <span className="ms-auto flex items-center gap-1 text-[10px] normal-case text-mhero-steel"><LockIcon />{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-mhero-accent-dark">{error}</p>}
    </div>
  );
}

function Accordion({
  index,
  title,
  open,
  onToggle,
  children,
}: {
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-mhero-fog bg-mhero-fog">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-6 text-start"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mhero-black text-xs font-bold text-white">
          {index}
        </span>
        <h3 className="flex-1 text-sm font-semibold uppercase tracking-widest2 text-mhero-black">{title}</h3>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="border-t border-mhero-fog p-6 pt-6">{children}</div>}
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

function RadioDot({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-mhero-black" : "border-mhero-fog"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-mhero-primary" />}
      </span>
      <span className={`text-sm ${selected ? "font-semibold text-mhero-black" : "text-mhero-steel"}`}>{label}</span>
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
  highlighted,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border p-4 text-sm transition-colors ${
        checked ? "border-mhero-primary bg-mhero-primary/10" : "border-mhero-fog bg-mhero-fog/20"
      } ${highlighted ? "" : ""}`}
    >
      <input
        type="checkbox"
        className="checkbox-field-light mt-0.5"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-mhero-steel">{children}</span>
    </label>
  );
}

function MapPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-48 items-center justify-center border border-mhero-fog bg-mhero-fog/30 text-xs uppercase tracking-widest2 text-mhero-steel lg:h-full lg:min-h-[220px]">
      <div className="flex flex-col items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 20l-6-2V6l6 2m0 12l6-2m-6 2V8m6 10l6 2V6l-6-2m0 16V6m0 0L9 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </div>
    </div>
  );
}

function Calendar({
  selected,
  onSelect,
  locale,
  legendSelected,
  legendUnavailable,
}: {
  selected: string;
  onSelect: (d: string) => void;
  locale: string;
  legendSelected: string;
  legendUnavailable: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initial = selected ? new Date(`${selected}T00:00:00`) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const weekDayLabels =
    locale === "ar"
      ? ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  const isUnavailable = (d: Date) => d < today;

  return (
    <div className="border border-mhero-fog bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            const m = viewMonth === 0 ? 11 : viewMonth - 1;
            const y = viewMonth === 0 ? viewYear - 1 : viewYear;
            setViewMonth(m);
            setViewYear(y);
          }}
          className="flex h-8 w-8 items-center justify-center border border-mhero-fog text-mhero-black hover:bg-mhero-fog/30"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-mhero-black">{monthLabel}</p>
        <button
          type="button"
          onClick={() => {
            const m = viewMonth === 11 ? 0 : viewMonth + 1;
            const y = viewMonth === 11 ? viewYear + 1 : viewYear;
            setViewMonth(m);
            setViewYear(y);
          }}
          className="flex h-8 w-8 items-center justify-center border border-mhero-fog text-mhero-black hover:bg-mhero-fog/30"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-mhero-ash">
        {weekDayLabels.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`b-${i}`} />;
          const dateStr = toDateStr(d);
          const unavailable = isUnavailable(d);
          const isSelected = dateStr === selected;
          return (
            <button
              key={dateStr}
              type="button"
              disabled={unavailable}
              onClick={() => onSelect(dateStr)}
              className={`aspect-square text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-mhero-primary text-mhero-black"
                  : unavailable
                  ? "cursor-not-allowed text-mhero-fog line-through"
                  : "text-mhero-black hover:bg-mhero-fog/40"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-mhero-fog pt-3 text-[11px] text-mhero-steel">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-mhero-primary" /> {legendSelected}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-mhero-fog" /> {legendUnavailable}
        </span>
      </div>
    </div>
  );
}

function TermsModal({ open, onClose, title, body, closeLabel }: { open: boolean; onClose: () => void; title: string; body: string; closeLabel: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="max-h-[80vh] w-full max-w-[480px] overflow-y-auto border border-mhero-fog bg-white p-6">
        <h3 className="text-lg font-bold text-mhero-black">{title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-mhero-steel">{body}</p>
        <button type="button" onClick={onClose} className="btn-outline mt-6 w-full">
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

export default function ServiceBookingForm() {
  const { locale, dict } = useLocale();
  const sb = dict.serviceBooking;

  const [submitted, setSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean | null>(null);
  const [lookupPhone, setLookupPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<"invalid" | "incomplete" | null>(null);
  const [otpResentNotice, setOtpResentNotice] = useState(false);
  const [lookedUp, setLookedUp] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const [openPersonal, setOpenPersonal] = useState(true);
  const [openVehicle, setOpenVehicle] = useState(true);
  const [openAppointment, setOpenAppointment] = useState(true);

  const [tcModalOpen, setTcModalOpen] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaError, setCaptchaError] = useState(false);

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
      title: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      country: "",
      city: "",
      plateCode: "",
      plateNumber: "",
      purpose: "",
      purposeDetails: "",
      serviceInterval: "",
      serviceCenter: "",
      appointmentDate: "",
      appointmentTime: "",
      waitAtReception: false,
      message: "",
      pickupType: "not-required",
      tcAcknowledged: false,
      pickUpAddress: "",
      pickupSectionDropOffAddress: "",
      dropOffAddress: "",
      pickUpTime: "",
      pickUpInstructions: "",
      dropOffInstructions: "",
      agreePrivacy: false,
      captchaInput: "",
    },
  });

  const isMaskedLookup = hasVisitedBefore === true && lookedUp;

  const country = watch("country");
  const purpose = watch("purpose");
  const serviceCenter = watch("serviceCenter");
  const appointmentDate = watch("appointmentDate");
  const appointmentTime = watch("appointmentTime");
  const pickupType = watch("pickupType");
  const tcAcknowledged = watch("tcAcknowledged");
  const agreePrivacy = watch("agreePrivacy");
  const waitAtReception = watch("waitAtReception");
  const pickUpTime = watch("pickUpTime");

  const cityOptions = useMemo(
    () => (CITIES_BY_COUNTRY[country] ?? []).map((c) => ({ value: c.value, label: locale === "ar" ? c.ar : c.en })),
    [country, locale]
  );

  const pickupDropoffEnabled = Boolean(serviceCenter && appointmentDate && appointmentTime);
  const selectedCenter = SERVICE_CENTERS.find((c) => c.value === serviceCenter);
  const centerCharges = selectedCenter ? TRANSPORT_CHARGES[selectedCenter.value] : undefined;
  const transportCharge =
    centerCharges &&
    (pickupType === "pickup"
      ? centerCharges.pickup
      : pickupType === "dropoff"
      ? centerCharges.dropoff
      : pickupType === "both"
      ? centerCharges.pickup + centerCharges.dropoff
      : 0);

  const pickupSectionDropOffAddress = watch("pickupSectionDropOffAddress");
  const autoFilledDropOffRef = useRef("");
  useEffect(() => {
    if (!selectedCenter) return;
    if (
      (pickupType === "pickup" || pickupType === "both") &&
      (!pickupSectionDropOffAddress || pickupSectionDropOffAddress === autoFilledDropOffRef.current)
    ) {
      autoFilledDropOffRef.current = selectedCenter.address;
      setValue("pickupSectionDropOffAddress", selectedCenter.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupType, selectedCenter?.address]);

  const latestPickupMins = appointmentTime ? minutesFromTime(appointmentTime) - PICKUP_BUFFER_MINS : null;
  const pickupTimeOptions = useMemo(() => {
    if (latestPickupMins === null) return [];
    return TIME_SLOTS.filter((t) => minutesFromTime(t) <= latestPickupMins).map((t) => ({ value: t, label: t }));
  }, [latestPickupMins]);

  useEffect(() => {
    if (latestPickupMins === null) {
      setValue("pickUpTime", "");
      return;
    }
    const options = TIME_SLOTS.filter((t) => minutesFromTime(t) <= latestPickupMins);
    const defaultTime = options.length > 0 ? options[options.length - 1] : "";
    setValue("pickUpTime", defaultTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentTime]);

  const sendOtp = async () => {
    if (!lookupPhone.trim()) return;
    setSendingOtp(true);
    setOtpResentNotice(false);
    await new Promise((r) => setTimeout(r, 700));
    setGeneratedOtp(generateOtp());
    setOtpInput("");
    setOtpError(null);
    setSendingOtp(false);
    setOtpSent(true);
  };

  const resendOtp = async () => {
    setSendingOtp(true);
    await new Promise((r) => setTimeout(r, 500));
    setGeneratedOtp(generateOtp());
    setOtpInput("");
    setOtpError(null);
    setSendingOtp(false);
    setOtpResentNotice(true);
  };

  const verifyOtp = async () => {
    if (otpInput.trim().length < 6) {
      setOtpError("incomplete");
      return;
    }
    setVerifyingOtp(true);
    await new Promise((r) => setTimeout(r, 600));
    if (otpInput.trim() !== generatedOtp) {
      setOtpError("invalid");
      setVerifyingOtp(false);
      return;
    }
    setOtpError(null);
    setValue("title", "mr");
    setValue("firstName", "Ahmed");
    setValue("lastName", "Al Mansoori");
    setValue("phone", lookupPhone.trim());
    setValue("email", "ahmed.almansoori@example.com");
    setVerifyingOtp(false);
    setLookedUp(true);
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtpInput("");
    setOtpError(null);
    setOtpResentNotice(false);
  };

  const selectRegisteredVehicle = (id: string) => {
    const v = REGISTERED_VEHICLES.find((x) => x.id === id);
    if (!v) return;
    setSelectedVehicleId(id);
    setValue("country", v.country);
    setValue("city", v.city);
    setValue("plateCode", v.plateCode);
    setValue("plateNumber", v.plateNumber);
  };

  const changeVehicle = () => {
    setSelectedVehicleId(null);
  };

  const showFormBody = hasVisitedBefore === false || (hasVisitedBefore === true && lookedUp && selectedVehicleId);

  const onSubmit = async (data: FormValues) => {
    if (data.captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    await new Promise((r) => setTimeout(r, 700));
    setBookingReference(generateBookingReference());
    setSubmitted(true);
    setCaptcha(generateCaptcha());
  };

  const resetAll = () => {
    setSubmitted(false);
    setHasVisitedBefore(null);
    setLookupPhone("");
    setOtpSent(false);
    setOtpInput("");
    setOtpError(null);
    setOtpResentNotice(false);
    setLookedUp(false);
    setSelectedVehicleId(null);
    setCaptcha(generateCaptcha());
    reset();
  };

  const selectedVehicle = REGISTERED_VEHICLES.find((v) => v.id === selectedVehicleId);

  if (submitted) {
    const values = watch();
    const centerLabel = selectedCenter ? sb[selectedCenter.labelKey] : "";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
        <div className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto border border-mhero-fog bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mhero-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-mhero-black">{sb.bookingConfirmed}</h3>

          <dl className="mt-6 space-y-2 text-start text-sm">
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.bookingReference}</dt>
              <dd className="font-semibold text-mhero-black">{bookingReference}</dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{dict.forms.fullName}</dt>
              <dd className="font-semibold text-mhero-black">{values.firstName} {values.lastName}</dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.vehicleLabel}</dt>
              <dd className="font-semibold text-mhero-black">
                {selectedVehicle ? selectedVehicle.model : `${values.plateCode} ${values.plateNumber}`}
              </dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.serviceCenterLabel}</dt>
              <dd className="font-semibold text-mhero-black">{centerLabel}</dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.appointmentDate}</dt>
              <dd className="font-semibold text-mhero-black">{values.appointmentDate}</dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.appointmentTime}</dt>
              <dd className="font-semibold text-mhero-black">{values.appointmentTime}</dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.purposeLabel}</dt>
              <dd className="font-semibold text-mhero-black">
                {values.purpose === "service"
                  ? sb.serviceIntervalOptions[values.serviceInterval as keyof typeof sb.serviceIntervalOptions] ?? ""
                  : values.purpose === "collision"
                  ? sb.purposeCollision
                  : sb.purposeReportFault}
              </dd>
            </div>
            <div className="flex justify-between border-b border-mhero-fog pb-2">
              <dt className="text-mhero-steel">{sb.receptionLabel}</dt>
              <dd className="font-semibold text-mhero-black">{values.waitAtReception ? dict.forms.yes : dict.forms.no}</dd>
            </div>
            {values.pickupType !== "not-required" && (
              <div className="flex justify-between border-b border-mhero-fog pb-2">
                <dt className="text-mhero-steel">{sb.pickupDropoffHeading}</dt>
                <dd className="font-semibold text-mhero-black">
                  {values.pickupType === "pickup"
                    ? sb.pickupOptionPickUp
                    : values.pickupType === "dropoff"
                    ? sb.pickupOptionDropOff
                    : sb.pickupOptionBoth}
                </dd>
              </div>
            )}
            {values.pickupType !== "not-required" && transportCharge ? (
              <div className="flex justify-between pb-2">
                <dt className="text-mhero-steel">{sb.transportChargeTitle}</dt>
                <dd className="font-semibold text-mhero-black">AED {transportCharge}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-6 border border-mhero-primary bg-mhero-primary/15 p-3 text-xs text-mhero-black">
            {sb.sentNotice}
          </p>

          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-mhero-steel">
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mhero-primary text-[9px] text-white">✓</span>
              {sb.emailSent}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mhero-primary text-[9px] text-white">✓</span>
              {sb.whatsappSent}
            </span>
          </div>

          <button onClick={resetAll} className="btn-primary mt-6 w-full">
            {sb.done}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="border border-mhero-fog bg-white p-6 md:p-8">
        <h2 className="text-2xl font-bold leading-tight text-mhero-black md:text-3xl">
          {sb.pageTitleLine1}
          <br />
          {sb.pageTitleLine2}
        </h2>
        <p className="mt-2 text-sm text-mhero-steel">
          {sb.pageSubtitle.replace("*", "")} <span className="text-mhero-primary">*</span>
        </p>
      </div>

      <div>
        <YesNoRow
          label={dict.forms.existingCustomerQuestion}
          value={hasVisitedBefore ?? false}
          onChange={(v) => {
            setHasVisitedBefore(v);
            setLookedUp(false);
            setLookupPhone("");
            setOtpSent(false);
            setOtpInput("");
            setOtpError(null);
            setOtpResentNotice(false);
            setSelectedVehicleId(null);
            if (!v) {
              setValue("title", "");
              setValue("firstName", "");
              setValue("lastName", "");
              setValue("phone", "");
              setValue("email", "");
              setValue("country", "");
              setValue("city", "");
              setValue("plateCode", "");
              setValue("plateNumber", "");
            }
          }}
          yesLabel={dict.forms.yes}
          noLabel={dict.forms.no}
        />
        <p className="mt-1.5 text-xs text-mhero-ash">{dict.forms.existingCustomerHint}</p>

        {hasVisitedBefore === true && !otpSent && !lookedUp && (
          <div className="mt-4 border border-mhero-fog p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.verifyMobileTitle}</p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1" style={{ minWidth: 220 }}>
                <div className="flex">
                  <span className="flex items-center border border-e-0 border-mhero-fog bg-mhero-fog/40 px-3 text-sm text-mhero-steel">
                    🇦🇪 +971
                  </span>
                  <input
                    className="input-field-light"
                    type="tel"
                    placeholder="50 123 4567"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp || !lookupPhone.trim()}
                className="btn-primary shrink-0"
              >
                {sendingOtp ? sb.sendingOtp : sb.sendOtp}
              </button>
            </div>
          </div>
        )}

        {hasVisitedBefore === true && otpSent && !lookedUp && (
          <div className="mt-4 border border-mhero-fog p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.otpEnterTitle}</p>
            <p className="mb-3 text-sm text-mhero-steel">{maskPhone(lookupPhone)}</p>
            <p className="mb-3 border border-mhero-primary bg-mhero-primary/15 px-3 py-2 text-xs text-mhero-black">
              {sb.otpDemoHintPrefix} <span className="font-mono font-bold tracking-[3px]">{generatedOtp}</span>
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <input
                className="input-field-light max-w-[160px] tracking-[4px]"
                inputMode="numeric"
                maxLength={6}
                placeholder={sb.otpPlaceholder}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value.replace(/[^0-9]/g, ""));
                  setOtpError(null);
                }}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifyingOtp || !otpInput.trim()}
                className="btn-primary shrink-0"
              >
                {verifyingOtp ? sb.verifyingOtp : sb.verifyOtp}
              </button>
              <button type="button" onClick={resendOtp} disabled={sendingOtp} className="link-underline shrink-0 text-sm font-semibold text-mhero-black">
                {sb.resendOtp}
              </button>
              <button type="button" onClick={changeNumber} className="link-underline shrink-0 text-sm text-mhero-steel">
                {sb.changeNumber}
              </button>
            </div>
            {otpError === "invalid" && <p className="mt-2 text-xs text-mhero-accent-dark">{sb.otpInvalid}</p>}
            {otpError === "incomplete" && <p className="mt-2 text-xs text-mhero-accent-dark">{sb.otpIncomplete}</p>}
            {!otpError && otpResentNotice && <p className="mt-2 text-xs text-mhero-steel">{sb.otpResent}</p>}
          </div>
        )}

        {hasVisitedBefore === true && lookedUp && !selectedVehicleId && (
          <div className="mt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.yourVehicles}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {REGISTERED_VEHICLES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectRegisteredVehicle(v.id)}
                  className="border border-mhero-fog bg-white p-4 text-start transition-colors hover:border-mhero-black/40"
                >
                  <p className="text-sm font-bold text-mhero-black">{v.model}</p>
                  <p className="mt-1 text-xs text-mhero-steel">
                    {v.plateCode} {maskPlateNumber(v.plateNumber)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {hasVisitedBefore === true && lookedUp && selectedVehicleId && selectedVehicle && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-mhero-primary bg-mhero-primary/15 p-4">
            <p className="text-sm text-mhero-black">
              <span className="font-semibold">{sb.vehicleSelectedBanner}</span>{" "}
              {selectedVehicle.model} — {selectedVehicle.plateCode} {maskPlateNumber(selectedVehicle.plateNumber)}
            </p>
            <button type="button" onClick={changeVehicle} className="link-underline shrink-0 text-sm font-semibold text-mhero-black">
              {sb.change}
            </button>
          </div>
        )}
      </div>

      {showFormBody && !isMaskedLookup && (
        <>
          <Accordion index={1} title={dict.forms.personalInformation} open={openPersonal} onToggle={() => setOpenPersonal((v) => !v)}>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={dict.forms.title} required error={errors.title?.message}>
                <LightSelect
                  value={watch("title")}
                  onChange={(v) => setValue("title", v, { shouldValidate: true })}
                  placeholder="—"
                  disabled={isMaskedLookup}
                  options={[
                    { value: "mr", label: dict.forms.titleMr },
                    { value: "mrs", label: dict.forms.titleMrs },
                    { value: "ms", label: dict.forms.titleMs },
                    { value: "dr", label: dict.forms.titleDr },
                  ]}
                />
              </Field>
              <Field label={dict.forms.firstName} required error={errors.firstName?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                <input
                  className={`input-field-light ${isMaskedLookup ? "cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" : ""}`}
                  readOnly={isMaskedLookup}
                  {...register("firstName")}
                />
              </Field>
              <Field label={dict.forms.lastName} required error={errors.lastName?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                <input
                  className={`input-field-light ${isMaskedLookup ? "cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" : ""}`}
                  readOnly={isMaskedLookup}
                  {...register("lastName")}
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label={dict.forms.phoneNumber} error={errors.phone?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                {isMaskedLookup ? (
                  <>
                    <input
                      className="input-field-light cursor-not-allowed bg-mhero-fog/20 text-mhero-steel"
                      type="text"
                      value={maskPhone(watch("phone") || "")}
                      readOnly
                    />
                    <input type="hidden" {...register("phone")} />
                  </>
                ) : (
                  <div className="flex">
                    <span className="flex items-center border border-e-0 border-mhero-fog bg-mhero-fog/40 px-3 text-sm text-mhero-steel">
                      🇦🇪 +971
                    </span>
                    <input className="input-field-light" type="tel" placeholder="50 123 4567" {...register("phone")} />
                  </div>
                )}
              </Field>
              <Field label={dict.forms.emailAddress} required error={errors.email?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                {isMaskedLookup ? (
                  <>
                    <input
                      className="input-field-light cursor-not-allowed bg-mhero-fog/20 text-mhero-steel"
                      type="text"
                      value={maskEmail(watch("email") || "")}
                      readOnly
                    />
                    <input type="hidden" {...register("email")} />
                  </>
                ) : (
                  <input className="input-field-light" type="email" {...register("email")} />
                )}
              </Field>
            </div>
          </Accordion>

          <Accordion index={2} title={dict.forms.vehicleDetails} open={openVehicle} onToggle={() => setOpenVehicle((v) => !v)}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={sb.country} required error={errors.country?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                <LightSelect
                  value={watch("country")}
                  onChange={(v) => {
                    setValue("country", v, { shouldValidate: true });
                    setValue("city", "");
                  }}
                  placeholder={sb.selectCountry}
                  disabled={isMaskedLookup}
                  options={COUNTRIES.map((c) => ({ value: c.value, label: locale === "ar" ? c.ar : c.en }))}
                />
              </Field>
              <Field label={sb.city} required error={errors.city?.message} hint={isMaskedLookup ? sb.lockedFieldHint : undefined}>
                <LightSelect
                  value={watch("city")}
                  onChange={(v) => setValue("city", v, { shouldValidate: true })}
                  placeholder={sb.selectCity}
                  disabled={isMaskedLookup || !country}
                  options={cityOptions}
                />
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_1fr_auto] gap-5">
              <Field label={dict.forms.plateCode} required error={errors.plateCode?.message} hint={isMaskedLookup ? sb.lockedFieldHint : sb.plateLettersHint}>
                <input
                  className={`input-field-light text-center uppercase ${isMaskedLookup ? "cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" : ""}`}
                  maxLength={3}
                  placeholder="ABC"
                  readOnly={isMaskedLookup}
                  value={watch("plateCode")}
                  onChange={(e) => setValue("plateCode", e.target.value.toUpperCase().replace(/[^A-Z]/g, ""), { shouldValidate: true })}
                />
              </Field>
              <Field label={dict.forms.plateNumber} required error={errors.plateNumber?.message} hint={isMaskedLookup ? sb.lockedFieldHint : dict.forms.plateDigitsHint}>
                <input
                  className={`input-field-light ${isMaskedLookup ? "cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" : ""}`}
                  inputMode="numeric"
                  maxLength={5}
                  readOnly={isMaskedLookup}
                  value={isMaskedLookup ? maskPlateNumber(watch("plateNumber")) : watch("plateNumber")}
                  onChange={(e) => setValue("plateNumber", e.target.value.replace(/[^0-9]/g, ""), { shouldValidate: true })}
                />
              </Field>
              <div>
                <p className="mb-2 block text-xs font-medium uppercase tracking-widest2 text-mhero-ash">{dict.forms.platePreview}</p>
                <div className="flex h-[46px] w-32 items-stretch overflow-hidden border border-mhero-black bg-white text-mhero-black">
                  <div className="flex flex-1 items-center justify-center px-2 text-sm font-bold tracking-wide">
                    {watch("plateCode") || "•"}
                  </div>
                  <div className="flex flex-[1.4] items-center justify-center px-2 text-base font-extrabold tracking-widest">
                    {(isMaskedLookup ? maskPlateNumber(watch("plateNumber")) : watch("plateNumber")) || "•••••"}
                  </div>
                  <div className="w-2 shrink-0 bg-mhero-primary" />
                </div>
              </div>
            </div>
          </Accordion>
        </>
      )}

      {showFormBody && (
        <>
          <Accordion
            index={isMaskedLookup ? 1 : 3}
            title={dict.forms.appointmentDetails}
            open={openAppointment}
            onToggle={() => setOpenAppointment((v) => !v)}
          >
            <div className="space-y-5">
              <Field label={dict.forms.purposeOfVisit} required error={errors.purpose?.message}>
                <LightSelect
                  value={purpose}
                  onChange={(v) => setValue("purpose", v, { shouldValidate: true })}
                  placeholder={dict.forms.selectPurpose}
                  options={[
                    { value: "service", label: sb.purposeService },
                    { value: "collision", label: sb.purposeCollision },
                    { value: "report-fault", label: sb.purposeReportFault },
                  ]}
                />
              </Field>

              {purpose === "service" && (
                <Field label={sb.serviceInterval} required error={errors.serviceInterval?.message}>
                  <LightSelect
                    value={watch("serviceInterval") || ""}
                    onChange={(v) => setValue("serviceInterval", v, { shouldValidate: true })}
                    placeholder={sb.selectServiceInterval}
                    options={SERVICE_INTERVAL_OPTIONS.map((k) => {
                      const completed = isMaskedLookup && !!selectedVehicle && SERVICE_INTERVAL_KMS[k] <= selectedVehicle.lastCompletedKm;
                      return {
                        value: k,
                        label: sb.serviceIntervalOptions[k],
                        disabled: completed,
                        badge: completed ? sb.serviceIntervalCompleted : undefined,
                      };
                    })}
                  />
                </Field>
              )}

              {purpose && purpose !== "service" && (
                <Field label={sb.pleaseSpecify} required error={errors.purposeDetails?.message}>
                  <textarea
                    className="input-field-light min-h-[90px]"
                    placeholder={
                      purpose === "collision" ? sb.pleaseSpecifyPlaceholderCollision : sb.pleaseSpecifyPlaceholderFault
                    }
                    {...register("purposeDetails")}
                  />
                </Field>
              )}

              <Field label={sb.serviceCenter} required error={errors.serviceCenter?.message}>
                <LightSelect
                  value={serviceCenter}
                  onChange={(v) => setValue("serviceCenter", v, { shouldValidate: true })}
                  placeholder={sb.selectServiceCenter}
                  options={SERVICE_CENTERS.map((c) => ({ value: c.value, label: sb[c.labelKey] }))}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={sb.appointmentDate} required error={errors.appointmentDate?.message}>
                  <Calendar
                    selected={appointmentDate}
                    onSelect={(d) => setValue("appointmentDate", d, { shouldValidate: true })}
                    locale={locale}
                    legendSelected={sb.calendarLegendSelected}
                    legendUnavailable={sb.calendarLegendUnavailable}
                  />
                </Field>
                <Field label={sb.appointmentTime} required error={errors.appointmentTime?.message}>
                  <LightSelect
                    value={appointmentTime}
                    onChange={(v) => setValue("appointmentTime", v, { shouldValidate: true })}
                    placeholder={appointmentDate ? dict.forms.selectTime : sb.selectDateFirst}
                    disabled={!appointmentDate}
                    options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
                  />
                  {LATE_SLOTS.includes(appointmentTime) && (
                    <p className="mt-2 border border-mhero-primary bg-mhero-primary/15 px-3 py-2 text-xs text-mhero-black">
                      {sb.lateAppointmentNotice}
                    </p>
                  )}
                </Field>
              </div>

              <YesNoRow
                label={sb.waitAtReception}
                value={waitAtReception}
                onChange={(v) => setValue("waitAtReception", v, { shouldValidate: true })}
                yesLabel={dict.forms.yes}
                noLabel={dict.forms.no}
              />

              <Field label={sb.additionalMessage}>
                <textarea
                  className="input-field-light min-h-[100px]"
                  placeholder={sb.additionalMessagePlaceholder}
                  {...register("message")}
                />
              </Field>
            </div>
          </Accordion>
        </>
      )}

      {showFormBody && (
        <div>
          <h3 className="mb-4 border-b border-mhero-fog pb-4 text-sm font-semibold uppercase tracking-widest2 text-mhero-black">
            {sb.pickupDropoffHeading}
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            <RadioDot
              selected={pickupType === "not-required"}
              label={sb.pickupOptionNotRequired}
              onClick={() => setValue("pickupType", "not-required", { shouldValidate: true })}
            />
            <RadioDot
              selected={pickupType === "pickup"}
              label={sb.pickupOptionPickUp}
              onClick={() => pickupDropoffEnabled && setValue("pickupType", "pickup", { shouldValidate: true })}
            />
            <RadioDot
              selected={pickupType === "dropoff"}
              label={sb.pickupOptionDropOff}
              onClick={() => pickupDropoffEnabled && setValue("pickupType", "dropoff", { shouldValidate: true })}
            />
            <RadioDot
              selected={pickupType === "both"}
              label={sb.pickupOptionBoth}
              onClick={() => pickupDropoffEnabled && setValue("pickupType", "both", { shouldValidate: true })}
            />
          </div>
          {!pickupDropoffEnabled && <p className="mt-3 text-xs text-mhero-ash">{sb.pickupDropoffDisabledHint}</p>}

          {pickupType !== "not-required" && (
            <div className="mt-5">
              <p className="mb-4 border border-mhero-primary bg-mhero-primary/15 px-3 py-2 text-xs text-mhero-black">
                {sb.transportServiceNotice}
              </p>
              <Checkbox checked={tcAcknowledged} onChange={(v) => setValue("tcAcknowledged", v, { shouldValidate: true })}>
                {sb.tcAcknowledgePrefix}{" "}
                <button type="button" onClick={() => setTcModalOpen(true)} className="link-underline font-semibold text-mhero-black">
                  {sb.tcLinkLabel}
                </button>
              </Checkbox>
              {errors.tcAcknowledged && <p className="mt-1.5 text-xs text-mhero-accent-dark">{errors.tcAcknowledged.message}</p>}
            </div>
          )}

          {pickupType !== "not-required" && tcAcknowledged && centerCharges && (
            <div className="mt-5 border border-mhero-fog bg-white p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.transportChargeTitle}</p>
              <dl className="space-y-2 text-sm">
                {(pickupType === "pickup" || pickupType === "both") && (
                  <div className="flex justify-between border-b border-mhero-fog pb-2">
                    <dt className="text-mhero-steel">{sb.transportPickupChargeLabel}</dt>
                    <dd className="font-semibold text-mhero-black">AED {centerCharges.pickup}</dd>
                  </div>
                )}
                {(pickupType === "dropoff" || pickupType === "both") && (
                  <div className="flex justify-between border-b border-mhero-fog pb-2">
                    <dt className="text-mhero-steel">{sb.transportDropoffChargeLabel}</dt>
                    <dd className="font-semibold text-mhero-black">AED {centerCharges.dropoff}</dd>
                  </div>
                )}
                {pickupType === "both" && (
                  <div className="flex justify-between pb-1">
                    <dt className="font-semibold text-mhero-black">{sb.transportTotalChargeLabel}</dt>
                    <dd className="font-bold text-mhero-black">AED {centerCharges.pickup + centerCharges.dropoff}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-mhero-steel">{sb.transportChargeDisclaimer}</p>
            </div>
          )}

          {(pickupType === "pickup" || pickupType === "both") && tcAcknowledged && (
            <div className="mt-6 border border-mhero-fog bg-white p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.pickupOptionPickUp}</p>
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={sb.pickUpAddress} required error={errors.pickUpAddress?.message}>
                      <input className="input-field-light" placeholder={sb.pickUpAddressPlaceholder} {...register("pickUpAddress")} />
                    </Field>
                    <Field label={sb.dropOffAddress} hint={sb.autoFilledFromCenter} error={errors.pickupSectionDropOffAddress?.message}>
                      <input className="input-field-light" {...register("pickupSectionDropOffAddress")} />
                    </Field>
                  </div>

                  <p className="border border-mhero-primary bg-mhero-primary/15 px-3 py-2 text-xs text-mhero-black">
                    {sb.pickupDateMatchNotice}
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={sb.preferredPickUpDate}>
                      <input className="input-field-light cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" readOnly value={appointmentDate} />
                    </Field>
                    <Field label={sb.preferredPickUpTime} required error={errors.pickUpTime?.message} hint={sb.pickupBufferHint}>
                      <LightSelect
                        value={pickUpTime || ""}
                        onChange={(v) => setValue("pickUpTime", v, { shouldValidate: true })}
                        placeholder={dict.forms.selectTime}
                        options={pickupTimeOptions}
                      />
                    </Field>
                  </div>

                  <Field label={dict.forms.instructions}>
                    <textarea
                      className="input-field-light min-h-[80px]"
                      placeholder={dict.forms.instructionsPlaceholder}
                      {...register("pickUpInstructions")}
                    />
                  </Field>
                </div>
                <MapPlaceholder label={sb.mapPlaceholder} />
              </div>
            </div>
          )}

          {(pickupType === "dropoff" || pickupType === "both") && tcAcknowledged && (
            <div className="mt-6 border border-mhero-fog bg-white p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.pickupOptionDropOff}</p>
              <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={sb.pickUpAddress} hint={sb.autoFilledFromCenter}>
                      <input className="input-field-light cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" readOnly value={selectedCenter?.address ?? ""} />
                    </Field>
                    <Field label={sb.dropOffAddress} required error={errors.dropOffAddress?.message}>
                      <input className="input-field-light" placeholder={sb.dropOffAddressPlaceholder} {...register("dropOffAddress")} />
                    </Field>
                  </div>

                  <Field label={sb.preferredDropOffDate}>
                    <input className="input-field-light cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" readOnly value={appointmentDate} />
                  </Field>

                  <Field label={dict.forms.instructions}>
                    <textarea
                      className="input-field-light min-h-[80px]"
                      placeholder={dict.forms.instructionsPlaceholder}
                      {...register("dropOffInstructions")}
                    />
                  </Field>
                </div>
                <MapPlaceholder label={sb.mapPlaceholder} />
              </div>
            </div>
          )}
        </div>
      )}

      {showFormBody && (
        <>
          <Checkbox checked={agreePrivacy} onChange={(v) => setValue("agreePrivacy", v, { shouldValidate: true })}>
            {dict.forms.privacyAgreePrefix}{" "}
            <Link href="/privacy-policy" className="link-underline font-semibold text-mhero-primary">
              {dict.forms.privacyPolicy}
            </Link>
          </Checkbox>
          {errors.agreePrivacy && <p className="text-xs text-mhero-accent-dark">{errors.agreePrivacy.message}</p>}

          <div className="border border-mhero-fog bg-white p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">{sb.captchaLabel}</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 border-y-2 border-mhero-primary bg-mhero-fog/20 px-6 py-3">
                <span className="font-mono text-xl font-bold tracking-[6px] text-mhero-black">{captcha}</span>
                <button
                  type="button"
                  onClick={() => setCaptcha(generateCaptcha())}
                  aria-label={sb.captchaRefresh}
                  className="text-mhero-steel hover:text-mhero-black"
                >
                  ↻
                </button>
              </div>
              <input
                className="input-field-light max-w-[200px] uppercase"
                placeholder={sb.captchaPlaceholder}
                {...register("captchaInput")}
              />
            </div>
            {captchaError && <p className="mt-2 text-xs text-mhero-accent-dark">{sb.captchaInvalid}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? sb.submitting : sb.submitBooking}
          </button>
        </>
      )}

      <TermsModal
        open={tcModalOpen}
        onClose={() => setTcModalOpen(false)}
        title={sb.tcModalTitle}
        body={sb.tcModalBody}
        closeLabel={sb.tcModalClose}
      />
    </form>
  );
}
