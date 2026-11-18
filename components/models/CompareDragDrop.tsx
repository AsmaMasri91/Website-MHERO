"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { VehicleModel } from "@/lib/types";
import { formatCurrency } from "@/lib/financeMath";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  "mhero-1": "/images/models/mhero-1-campaign.png",
  "mhero-2": "/images/models/mhero-2-campaign.png",
  "mhero-2-terrain": "/images/models/mhero-2-campaign.png",
};

function comparePrice(model: VehicleModel): number {
  return model.startingPrice;
}

interface SlotEntry {
  model: VehicleModel;
  variantId: string;
}

type Slot = SlotEntry | null;

function variantOf(entry: SlotEntry) {
  return entry.model.variants.find((v) => v.id === entry.variantId) ?? entry.model.variants[0];
}

function entryPrice(entry: SlotEntry): number {
  return comparePrice(entry.model) + (variantOf(entry)?.priceDelta ?? 0);
}

function testDriveHref(entry: SlotEntry): string {
  return `/models/test-drive?model=${entry.model.slug}&variant=${entry.variantId}`;
}

interface SpecRow {
  label: string;
  values: (string | null)[];
}

interface SpecGroup {
  label: string;
  rows: SpecRow[];
}

export default function CompareDragDrop() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const slotCount = Math.min(models.length, 3);

  const [entries, setEntries] = useState<Slot[]>(
    Array.from({ length: slotCount }, () => null)
  );
  // Model-level view of the slots; variant-level data comes from `entries`.
  const slots: (VehicleModel | null)[] = entries.map((e) => e?.model ?? null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const placeInSlot = (model: VehicleModel, index: number) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { model, variantId: model.variants[0]?.id ?? "" };
      return next;
    });
  };

  const setVariant = (index: number, variantId: string) => {
    setEntries((prev) => {
      const next = [...prev];
      const current = next[index];
      if (current) next[index] = { ...current, variantId };
      return next;
    });
  };

  const clearSlot = (index: number) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  // Tapping a model always fills the next free slot, so the same model can be added
  // more than once to compare its variants side by side.
  const handleCardClick = (model: VehicleModel) => {
    const emptyIndex = entries.findIndex((s) => s === null);
    placeInSlot(model, emptyIndex !== -1 ? emptyIndex : entries.length - 1);
  };

  const activeEntries = entries.filter((e): e is SlotEntry => e !== null);
  const activeSlots = activeEntries.map((e) => e.model);

  const prices = activeEntries.map((e) => entryPrice(e));
  const lowestPrice = prices.length > 1 ? Math.min(...prices) : null;

  // Build spec groups: Pricing & Body (synthetic) + each spec group from data (assumed aligned across models)
  const groups: SpecGroup[] = [];

  groups.push({
    label: dict.models.pricingAndBody,
    rows: [
      {
        label: dict.models.variant,
        values: entries.map((e) => (e ? variantOf(e)?.name ?? null : null)),
      },
      {
        label: dict.models.price,
        values: entries.map((e) => (e ? formatCurrency(entryPrice(e), e.model.currency) : null)),
      },
      {
        label: dict.models.overview,
        values: slots.map((s) => s?.tagline ?? null),
      },
    ],
  });

  const groupCount = Math.max(...slots.map((s) => s?.specs.length ?? 0));
  for (let g = 0; g < groupCount; g++) {
    const groupLabel = slots.find((s) => s?.specs[g])?.specs[g]?.label ?? "";
    const itemCount = Math.max(...slots.map((s) => s?.specs[g]?.items.length ?? 0));
    const rows: SpecRow[] = [];
    for (let i = 0; i < itemCount; i++) {
      const itemLabel = slots.find((s) => s?.specs[g]?.items[i])?.specs[g]?.items[i]?.label ?? "";
      rows.push({
        label: itemLabel,
        values: entries.map((e) => {
          if (!e) return null;
          // Horsepower (Performance group, item 2) and Range (Range & Battery group, item 0)
          // depend on the selected variant; everything else is model-level.
          const v = variantOf(e);
          if (v && g === 0 && i === 2) return v.powerHp;
          if (v && g === 1 && i === 0) return v.rangeKm;
          return e.model.specs[g]?.items[i]?.value ?? null;
        }),
      });
    }
    groups.push({ label: groupLabel, rows });
  }

  groups.push({
    label: locale === "ar" ? "الملكية" : "Ownership",
    rows: [
      {
        label: locale === "ar" ? "الضمان" : "Warranty",
        values: slots.map((s) => (s ? (locale === "ar" ? "10 سنوات / بدون حد للكيلومترات" : "10 years / Unlimited km") : null)),
      },
      {
        label: locale === "ar" ? "المساعدة على الطريق" : "Roadside Assistance",
        values: slots.map((s) => (s ? (locale === "ar" ? "5 سنوات" : "5 years") : null)),
      },
      {
        label: locale === "ar" ? "عقد الصيانة" : "Service Maintenance Contract",
        values: slots.map((s) => (s ? (locale === "ar" ? "سنة واحدة" : "1 year") : null)),
      },
    ],
  });

  function rowHasDifferences(row: SpecRow): boolean {
    const present = row.values.filter((v) => v !== null);
    return new Set(present).size > 1;
  }

  let visibleGroups: SpecGroup[] = groups;
  if (showDifferencesOnly) {
    visibleGroups = [];
    for (const g of groups) {
      const filteredRows = g.rows.filter(rowHasDifferences);
      if (filteredRows.length > 0) {
        visibleGroups.push({ label: g.label, rows: filteredRows });
      }
    }
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* All models tray */}
        <div>
          <p className="eyebrow mb-1">{dict.models.allModels}</p>
          <p className="mb-4 text-xs text-mhero-steel">{dict.models.allModelsHint}</p>
          <div className="flex flex-col gap-3 lg:max-h-[420px] lg:overflow-y-auto lg:pe-1">
            {models.map((model) => {
              const isPlaced = slots.some((s) => s?.slug === model.slug);
              return (
                <div
                  key={model.slug}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", model.slug);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onClick={() => handleCardClick(model)}
                  className={`flex cursor-grab select-none items-center gap-3 border p-3 text-mhero-black transition-all active:cursor-grabbing ${
                    isPlaced
                      ? "border-mhero-fog bg-mhero-fog/40 opacity-50"
                      : "border-mhero-fog bg-white hover:border-mhero-black/40"
                  }`}
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden">
                    <Image src={modelImages[model.slug]} alt={model.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{model.name}</p>
                    <p className="text-xs text-mhero-steel">
                      {dict.common.startingFrom} {formatCurrency(comparePrice(model), model.currency)}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-widest2 text-mhero-steel">
                      {isPlaced ? dict.models.inComparison : dict.models.dragOrTap}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compare slots */}
        <div>
          <p className="eyebrow mb-1">{dict.models.compareUpTo.replace("{n}", String(slotCount))}</p>
          <p className="mb-4 text-xs text-mhero-steel">{dict.models.compareHint}</p>
          <div className={`grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {entries.map((entry, index) => (
              <DropSlot
                key={index}
                index={index}
                entry={entry}
                isDragOver={dragOverSlot === index}
                label={index === 0 ? dict.models.yourModel : dict.models.compareWith.replace("{n}", String(index))}
                dropLabel={dict.models.dropCarHere.replace("{n}", String(index + 1))}
                bestPrice={lowestPrice !== null && entry !== null && entryPrice(entry) === lowestPrice}
                onVariantChange={(id) => setVariant(index, id)}
                bestPriceLabel={dict.models.bestPrice}
                removeLabel={dict.models.remove}
                onDragOver={() => setDragOverSlot(index)}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(slug) => {
                  const found = models.find((m) => m.slug === slug);
                  if (found) placeInSlot(found, index);
                  setDragOverSlot(null);
                }}
                onClear={() => clearSlot(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      {activeSlots.length > 0 && (
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mhero-fog pb-4">
            <h3 className="text-xl font-bold text-mhero-black md:text-2xl">{dict.models.specComparison}</h3>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-mhero-steel">
              {dict.models.showDifferencesOnly}
              <span
                onClick={() => setShowDifferencesOnly((v) => !v)}
                role="switch"
                aria-checked={showDifferencesOnly}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  showDifferencesOnly ? "bg-mhero-black" : "bg-mhero-fog"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showDifferencesOnly ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-start text-sm text-mhero-black">
              <thead>
                <tr className="border-b border-mhero-fog">
                  <th className="w-40 px-4 py-4 text-start text-xs font-medium uppercase tracking-widest2 text-mhero-steel">
                    {dict.models.specification}
                  </th>
                  {entries.map((e, i) => (
                    <th key={i} className="px-4 py-4 text-start align-bottom">
                      {e ? (
                        <span className="font-semibold">
                          {e.model.name}
                          {variantOf(e) && (
                            <span className="block text-xs font-normal text-mhero-steel">
                              {variantOf(e).name}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-mhero-steel">—</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleGroups.map((group) => (
                  <Fragment key={group.label}>
                    <tr>
                      <td
                        colSpan={slots.length + 1}
                        className="bg-mhero-fog/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest2 text-mhero-steel"
                      >
                        {group.label}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={`${group.label}-${row.label}`} className="border-b border-mhero-fog">
                        <td className="px-4 py-4 text-start text-mhero-steel">{row.label}</td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={`px-4 py-4 text-start font-semibold text-mhero-black ${
                              lowestPrice !== null &&
                              row.label === dict.models.price &&
                              (entries[i] ? entryPrice(entries[i] as SlotEntry) : null) === lowestPrice
                                ? "underline decoration-2 underline-offset-4"
                                : ""
                            }`}
                          >
                            {v ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-3xl text-xs text-mhero-steel">
            {locale === "ar"
              ? "المواصفات إرشادية وتم تجميعها لأغراض المقارنة فقط. قد تختلف الأرقام حسب الفئة؛ يرجى تأكيد المواصفات النهائية مع ممثل المبيعات."
              : "Specifications are indicative and compiled for comparison only. Figures may vary by trim; please confirm final specifications with a sales representative."}
          </p>

          <div className={`mt-8 grid gap-4 ${slotCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {entries.map((e, i) =>
              e ? (
                <div key={i} className="flex flex-col gap-2">
                  <Link href={testDriveHref(e)} className="btn-dark w-full">
                    {dict.models.bookTestDriveFor} — {e.model.name}
                    {variantOf(e) ? ` · ${variantOf(e).name}` : ""}
                  </Link>
                  <Link href={`/models/${e.model.slug}`} className="btn-outline w-full">
                    {dict.common.exploreModel} — {e.model.name}
                  </Link>
                  <Link
                    href={`/models/finance-calculator?model=${e.model.slug}`}
                    className="link-underline text-center text-sm font-semibold text-mhero-black"
                  >
                    {dict.nav.calculateFinance} <span className="inline-block rtl:rotate-180">→</span>
                  </Link>
                </div>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DropSlot({
  index,
  entry,
  isDragOver,
  label,
  dropLabel,
  bestPrice,
  bestPriceLabel,
  removeLabel,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
  onVariantChange,
}: {
  index: number;
  entry: Slot;
  isDragOver: boolean;
  label: string;
  dropLabel: string;
  bestPrice: boolean;
  bestPriceLabel: string;
  removeLabel: string;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (slug: string) => void;
  onClear: () => void;
  onVariantChange: (id: string) => void;
}) {
  const { dict } = useLocale();
  const model = entry?.model ?? null;
  const variant = entry ? variantOf(entry) : undefined;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer.getData("text/plain"));
      }}
      className={`relative flex min-h-[260px] w-full flex-col border p-4 text-start transition-colors ${
        isDragOver ? "border-mhero-black bg-mhero-fog" : "border-mhero-fog bg-white"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest2 text-mhero-steel">
          {index === 0 ? `1 · ${label}` : `${index + 1} · ${label}`}
        </p>
        {model && (
          <button
            onClick={onClear}
            aria-label={`${removeLabel} ${model.name}`}
            className="flex h-7 w-7 items-center justify-center border border-mhero-fog text-mhero-steel hover:border-mhero-black hover:text-mhero-black"
          >
            ✕
          </button>
        )}
      </div>

      {model ? (
        <div className="flex flex-1 flex-col text-mhero-black">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image src={modelImages[model.slug]} alt={model.name} fill className="object-cover" />
          </div>
          <h3 className="mt-4 text-lg font-bold">{model.name}</h3>
          <p className="text-sm text-mhero-steel">{model.tagline}</p>

          {model.colours.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {model.colours.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="h-4 w-4 rounded-full border border-mhero-fog"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}

          {model.variants.length > 0 && entry && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest2 text-mhero-steel">
                {dict.models.selectVariant}
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={dict.models.selectVariant}>
                {model.variants.map((v) => {
                  const active = v.id === entry.variantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onVariantChange(v.id)}
                      className={`border px-3 py-2 text-xs font-semibold transition-colors ${
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
              {variant && (
                <p className="mt-2 text-xs text-mhero-steel">
                  {variant.powerHp} · {variant.rangeKm}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            {bestPrice && (
              <span className="bg-mhero-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest2 text-white">
                {bestPriceLabel}
              </span>
            )}
            <p className="text-sm font-semibold">
              {entry ? formatCurrency(entryPrice(entry), model.currency) : ""}
            </p>
          </div>

        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm font-medium uppercase tracking-widest2 text-mhero-steel">{dropLabel}</p>
        </div>
      )}
    </div>
  );
}
