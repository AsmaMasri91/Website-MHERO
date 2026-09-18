"use client";

import { useState } from "react";

function SelectChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDateDisplay(dateStr: string, locale: string): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function DateDropdown({
  value,
  onChange,
  placeholder,
  locale,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  locale: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initial = value ? new Date(`${value}T00:00:00`) : today;
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
    locale === "ar" ? ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  const toDateStr = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={`input-field-light flex w-full items-center justify-between bg-white text-start ${
          disabled ? "cursor-not-allowed bg-mhero-fog/20 text-mhero-steel" : ""
        }`}
      >
        <span className={value ? "text-mhero-black" : "text-mhero-ash"}>
          {value ? formatDateDisplay(value, locale) : placeholder}
        </span>
        <SelectChevron open={open} />
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 top-full z-20 mt-1 w-full min-w-[280px] border border-mhero-fog bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const m = viewMonth === 0 ? 11 : viewMonth - 1;
                  const y = viewMonth === 0 ? viewYear - 1 : viewYear;
                  setViewMonth(m);
                  setViewYear(y);
                }}
                className="flex h-7 w-7 items-center justify-center border border-mhero-fog text-mhero-black hover:bg-mhero-fog/30"
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
                className="flex h-7 w-7 items-center justify-center border border-mhero-fog text-mhero-black hover:bg-mhero-fog/30"
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-mhero-ash">
              {weekDayLabels.map((w, i) => (
                <div key={`${w}-${i}`}>{w}</div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <div key={`b-${i}`} />;
                const dateStr = toDateStr(d);
                const unavailable = d < today;
                const isSelected = dateStr === value;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={unavailable}
                    onClick={() => {
                      onChange(dateStr);
                      setOpen(false);
                    }}
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
          </div>
        </>
      )}
    </div>
  );
}
