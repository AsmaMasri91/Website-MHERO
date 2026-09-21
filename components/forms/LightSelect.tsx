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
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LightSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  openUpward,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean; badge?: string }[];
  placeholder: string;
  disabled?: boolean;
  openUpward?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

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
          {selected?.label || placeholder}
        </span>
        <SelectChevron open={open} />
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute inset-x-0 z-20 max-h-64 overflow-y-auto border border-mhero-fog bg-white shadow-lg ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                disabled={o.disabled}
                onClick={() => {
                  if (o.disabled) return;
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-start text-sm transition-colors ${
                  o.disabled
                    ? "cursor-not-allowed text-mhero-fog line-through"
                    : value === o.value
                    ? "bg-mhero-primary text-mhero-black"
                    : "text-mhero-black hover:bg-mhero-primary/15"
                }`}
              >
                <span>{o.label}</span>
                {o.badge && (
                  <span className="ms-3 shrink-0 text-[10px] font-semibold uppercase tracking-widest2 text-mhero-steel">
                    {o.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
