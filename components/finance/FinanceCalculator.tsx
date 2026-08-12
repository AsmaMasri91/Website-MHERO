"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { VehicleModel } from "@/lib/types";
import { calculateLoan, formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  "mhero-1": "/images/best-of-both-mhero-1.webp",
  "mhero-2": "/images/best-of-both-mhero-2.webp",
  "mhero-2-terrain": "/images/best-of-both-mhero-2.webp",
};

interface Selection {
  model: VehicleModel;
  variant: VehicleModel["variants"][number];
}

export default function FinanceCalculator({
  initialSlug,
}: {
  initialSlug?: string;
}) {
  const { locale, dict } = useLocale();
  const models = getModels(locale);

  const options: Selection[] = useMemo(
    () => models.map((model) => ({ model, variant: model.variants[0] })),
    [models]
  );

  const initialOption =
    options.find((o) => o.model.slug === initialSlug) ?? options[0];

  const [selectedKey, setSelectedKey] = useState(initialOption.model.slug);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [durationMonths, setDurationMonths] = useState(60);

  const selected =
    options.find((o) => o.model.slug === selectedKey) ?? initialOption;

  const vehiclePrice = selected.model.startingPrice + selected.variant.priceDelta;
  const downPayment = Math.round(vehiclePrice * (downPaymentPct / 100));

  const result = useMemo(
    () =>
      calculateLoan({
        vehiclePrice,
        downPayment,
        annualInterestRate: 3.5,
        durationMonths,
      }),
    [vehiclePrice, downPayment, durationMonths]
  );

  const lowestPrice = Math.min(...options.map((o) => o.model.startingPrice + o.variant.priceDelta));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      {/* Left: select vehicle */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-bold">{dict.finance.selectVehicleHeading}</h3>
          <p className="text-sm text-mhero-steel">
            {dict.common.startingFrom} <span className="font-semibold text-mhero-black">{formatCurrency(lowestPrice, selected.model.currency)}</span>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {options.map((o) => {
            const price = o.model.startingPrice + o.variant.priceDelta;
            const isActive = o.model.slug === selectedKey;
            return (
              <button
                key={o.model.slug}
                onClick={() => setSelectedKey(o.model.slug)}
                className={`overflow-hidden rounded-2xl border text-start transition-colors ${
                  isActive ? "border-mhero-black" : "border-mhero-fog hover:border-mhero-black/30"
                }`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-mhero-fog">
                  <Image
                    src={modelImages[o.model.slug]}
                    alt={o.model.name}
                    fill
                    className="object-cover"
                  />
                  {isActive && (
                    <span className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-mhero-black text-white">
                      ✓
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-mhero-black">{o.model.name}</p>
                  <p className="mt-1 text-xs text-mhero-steel">
                    {dict.common.startingFrom} {formatCurrency(price, o.model.currency)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected vehicle showcase */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-mhero-black">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={modelImages[selected.model.slug]}
              alt={selected.model.name}
              fill
              className="object-cover opacity-90"
            />
          </div>
          <div className="relative bg-mhero-black p-6 text-white">
            <p className="text-lg font-bold">{selected.model.name}</p>
            <p className="mt-1 text-sm text-white/50">
              {dict.common.startingFrom} {formatCurrency(vehiclePrice, selected.model.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Right: configure plan + summary */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-mhero-fog bg-white p-8 shadow-sm">
          <h3 className="text-xl font-bold text-mhero-black">{dict.finance.configurePlan}</h3>
          <p className="mt-1 text-sm text-mhero-steel">{dict.finance.configurePlanDescription}</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium text-mhero-black">{dict.finance.downPayment}</label>
              <div className="text-right">
                <p className="text-lg font-bold text-mhero-black">{downPaymentPct}%</p>
                <p className="text-xs text-mhero-steel">{formatCurrency(downPayment, selected.model.currency)}</p>
              </div>
            </div>
            <input
              type="range"
              min={20}
              max={80}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="range-field-light mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-mhero-steel">
              <span>20%</span>
              <span>80%</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label className="text-sm font-medium text-mhero-black">{dict.finance.financeTerm}</label>
              <div className="text-right">
                <p className="text-lg font-bold text-mhero-black">{durationMonths}</p>
                <p className="text-xs text-mhero-steel">{dict.finance.months}</p>
              </div>
            </div>
            <input
              type="range"
              min={12}
              max={60}
              step={6}
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="range-field-light mt-3"
            />
            <div className="mt-1 flex justify-between text-xs text-mhero-steel">
              <span>12 {dict.finance.monthsAbbrev}</span>
              <span>60 {dict.finance.monthsAbbrev}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-mhero-black p-8 text-white">
          <p className="eyebrow mb-2">{dict.finance.estimatedMonthlyPayment}</p>
          <p className="text-4xl font-extrabold text-mhero-accent-light">
            {formatCurrency(result.monthlyPayment, selected.model.currency)}
          </p>
          <p className="mt-1 text-sm text-white/60">
            {dict.finance.perMonthDuration.replace("{n}", String(durationMonths))}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/60">{dict.finance.vehiclePrice}</p>
              <p className="mt-1 font-semibold">{formatCurrency(vehiclePrice, selected.model.currency)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/60">{dict.finance.downPayment}</p>
              <p className="mt-1 font-semibold">{formatCurrency(downPayment, selected.model.currency)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest2 text-white/60">{dict.finance.amountFinanced}</p>
              <p className="mt-1 font-semibold">{formatCurrency(result.loanAmount, selected.model.currency)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest2 text-mhero-accent-light">
              {dict.finance.includedOffer}
            </p>
            <p className="mt-2 text-sm text-white/60">{dict.finance.includedOfferBody}</p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-white/60">{dict.finance.disclaimer}</p>

          <Link href={`/models/${selected.model.slug}`} className="btn-outline-light mt-6 w-full">
            {dict.common.exploreModel} {selected.model.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
