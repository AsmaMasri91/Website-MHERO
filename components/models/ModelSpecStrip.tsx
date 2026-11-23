"use client";

import { useState, type ReactNode } from "react";
import { VehicleModel } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-white/80"
    >
      {children}
    </svg>
  );
}

const icons = {
  speed: (
    <Icon>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </Icon>
  ),
  drive: (
    <Icon>
      <rect x="4" y="4" width="4" height="4" rx="1" />
      <rect x="16" y="4" width="4" height="4" rx="1" />
      <rect x="4" y="16" width="4" height="4" rx="1" />
      <rect x="16" y="16" width="4" height="4" rx="1" />
      <path d="M8 6h8M8 18h8M6 8v8M18 8v8" />
    </Icon>
  ),
  range: (
    <Icon>
      <path d="M3 17l5-6 4 3 5-8 4 4" />
    </Icon>
  ),
  power: (
    <Icon>
      <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
    </Icon>
  ),
};

/** Variant-tabbed spec strip shown directly under the model hero. */
export default function ModelSpecStrip({ model }: { model: VehicleModel }) {
  const { dict } = useLocale();
  const [active, setActive] = useState(0);
  if (model.variants.length === 0) return null;

  const variant = model.variants[active] ?? model.variants[0];
  const drivetrain = variant.name.match(/\b(AWD|RWD|FWD|4WD)\b/i)?.[1].toUpperCase() ?? "—";
  const accel = model.specs[0]?.items[0]?.value ?? "—";

  const stats: { label: string; value: string; icon?: ReactNode }[] = [
    { label: dict.models.zeroToHundred, value: accel, icon: icons.speed },
    { label: dict.models.drivetrain, value: drivetrain, icon: icons.drive },
    { label: dict.models.range, value: variant.rangeKm, icon: icons.range },
    { label: dict.models.power, value: variant.powerHp, icon: icons.power },
    {
      label: dict.models.price,
      value: `${dict.common.startingFrom} ${formatCurrency(model.startingPrice + variant.priceDelta, model.currency)}`,
    },
  ];

  return (
    <section className="bg-[#0c0c0d] text-white" aria-label={dict.models.variant}>
      <div className="container-mhero py-10 md:py-12">
        <div role="tablist" aria-label={dict.models.variant} className="flex gap-8 border-b border-white/15">
          {model.variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              id={`spec-tab-${v.id}`}
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`-mb-px border-b-2 pb-4 text-xs font-medium uppercase tracking-widest2 transition-colors md:text-sm ${
                i === active
                  ? "border-[#8fb5a6] text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        <dl
          role="tabpanel"
          aria-labelledby={`spec-tab-${variant.id}`}
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-[11px] font-medium uppercase tracking-widest2 text-white/60 md:text-xs">
                {s.label}
              </dt>
              <dd className="mt-3 flex items-center gap-2 text-xl font-medium md:text-2xl">
                {s.icon}
                <span>{s.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
