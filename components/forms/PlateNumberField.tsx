"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

const EMIRATES = [
  { value: "dubai", en: "Dubai", ar: "دبي" },
  { value: "abu-dhabi", en: "Abu Dhabi", ar: "أبوظبي" },
  { value: "sharjah", en: "Sharjah", ar: "الشارقة" },
  { value: "ajman", en: "Ajman", ar: "عجمان" },
  { value: "ras-al-khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { value: "fujairah", en: "Fujairah", ar: "الفجيرة" },
  { value: "umm-al-quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
];

function Field({
  label,
  error,
  light,
  children,
}: {
  label: string;
  error?: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className={`mb-2 block text-xs font-medium uppercase tracking-widest2 ${
          light ? "text-mhero-ash" : "text-white/70"
        }`}
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-mhero-accent-light">{error}</p>}
    </div>
  );
}

export default function PlateNumberField({
  emirate,
  onEmirateChange,
  code,
  onCodeChange,
  number,
  onNumberChange,
  emirateError,
  codeError,
  numberError,
  light,
}: {
  emirate: string;
  onEmirateChange: (v: string) => void;
  code: string;
  onCodeChange: (v: string) => void;
  number: string;
  onNumberChange: (v: string) => void;
  emirateError?: string;
  codeError?: string;
  numberError?: string;
  light?: boolean;
}) {
  const { locale, dict } = useLocale();
  const selectedEmirate = EMIRATES.find((e) => e.value === emirate);
  const inputClass = light ? "input-field-light" : "input-field";

  return (
    <div className="grid gap-5 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <Field label={dict.forms.emirate} error={emirateError} light={light}>
        <select
          className={inputClass}
          value={emirate}
          onChange={(e) => onEmirateChange(e.target.value)}
        >
          <option value="">{dict.forms.selectEmirate}</option>
          {EMIRATES.map((e) => (
            <option key={e.value} value={e.value}>
              {locale === "ar" ? e.ar : e.en}
            </option>
          ))}
        </select>
      </Field>

      <Field label={dict.forms.plateCode} error={codeError} light={light}>
        <input
          className={`${inputClass} text-center uppercase`}
          maxLength={2}
          placeholder="A"
          value={code}
          onChange={(e) => onCodeChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
        />
      </Field>

      <Field label={dict.forms.plateNumber} error={numberError} light={light}>
        <input
          className={inputClass}
          inputMode="numeric"
          maxLength={5}
          placeholder={dict.forms.plateDigitsHint}
          value={number}
          onChange={(e) => onNumberChange(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </Field>

      <div>
        <p
          className={`mb-2 block text-xs font-medium uppercase tracking-widest2 ${
            light ? "text-mhero-ash" : "text-white/70"
          }`}
        >
          {dict.forms.platePreview}
        </p>
        <div className="flex h-[46px] w-40 items-stretch overflow-hidden border border-mhero-black bg-white text-mhero-black">
          <div className="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 border-e border-mhero-fog bg-mhero-fog/60 px-1 text-center text-[8px] font-bold leading-tight">
            <span>UAE</span>
            <span>{selectedEmirate ? (locale === "ar" ? selectedEmirate.ar : selectedEmirate.en) : "—"}</span>
          </div>
          <div className="flex flex-1 items-center justify-center px-2 text-sm font-bold tracking-wide">
            {code || "•"}
          </div>
          <div className="flex flex-[1.4] items-center justify-center px-2 text-base font-extrabold tracking-widest">
            {number || "•••••"}
          </div>
          <div className="w-2 shrink-0 bg-mhero-accent-dark" />
        </div>
      </div>
    </div>
  );
}
