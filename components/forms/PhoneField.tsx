"use client";

import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

export const DIAL_CODES = [
  { code: "+971", iso: "AE" },
  { code: "+966", iso: "SA" },
  { code: "+968", iso: "OM" },
  { code: "+974", iso: "QA" },
  { code: "+965", iso: "KW" },
  { code: "+973", iso: "BH" },
] as const;

function UaeFlag() {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 shrink-0 border border-mhero-fog" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.33" fill="#00732f" />
      <rect y="10.67" width="24" height="5.33" fill="#000" />
      <rect width="6" height="16" fill="#f00" />
    </svg>
  );
}

interface PhoneFieldProps {
  dialCode: string;
  dialCodeLabel: string;
  dialCodeProps: SelectHTMLAttributes<HTMLSelectElement>;
}

/** Country-code picker joined to a phone number input. Digits always read left to right. */
const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps & InputHTMLAttributes<HTMLInputElement>>(
  function PhoneField({ dialCode, dialCodeLabel, dialCodeProps, ...inputProps }, ref) {
    const country = DIAL_CODES.find((d) => d.code === dialCode) ?? DIAL_CODES[0];

    return (
      <div dir="ltr" className="flex border border-mhero-fog bg-white focus-within:border-mhero-black">
        {/* The native select sits invisibly over the flag + code, so it stays keyboard and touch friendly. */}
        <div className="relative flex shrink-0 items-center gap-2 border-r border-mhero-fog px-3 text-sm text-mhero-black focus-within:bg-mhero-primary/15">
          {country.iso === "AE" ? (
            <UaeFlag />
          ) : (
            <span aria-hidden="true" className="text-xs font-semibold text-mhero-steel">
              {country.iso}
            </span>
          )}
          <span aria-hidden="true">{country.code}</span>
          <svg width="10" height="7" viewBox="0 0 12 8" fill="none" aria-hidden="true">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <select
            aria-label={dialCodeLabel}
            autoComplete="tel-country-code"
            className="absolute inset-0 w-full cursor-pointer opacity-0"
            {...dialCodeProps}
          >
            {DIAL_CODES.map((d) => (
              <option key={d.code} value={d.code}>
                {d.iso} {d.code}
              </option>
            ))}
          </select>
        </div>
        <input
          ref={ref}
          type="tel"
          autoComplete="tel-national"
          placeholder="50 123 4567"
          className="min-w-0 flex-1 bg-white px-4 py-[14px] text-sm text-mhero-black outline-none placeholder:text-mhero-ash"
          {...inputProps}
        />
      </div>
    );
  }
);

export default PhoneField;
