"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

const modelImages: Record<string, string> = {
  "mhero-1": "/images/models/mhero-1-campaign.png",
  "mhero-2": "/images/models/mhero-2-campaign.png",
  "mhero-2-terrain": "/images/models/mhero-2-campaign.png",
};

export default function ModelsMegaMenu({
  open,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  onNavigate: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
  const mhero1 = models.find((m) => m.slug === "mhero-1");
  const mhero2Prime = models.find((m) => m.slug === "mhero-2");
  const mhero2Terrain = models.find((m) => m.slug === "mhero-2-terrain");

  const ctas = [
    { label: dict.nav.compareModels, href: "/models/compare", primary: false },
    { label: dict.nav.financeCalculator, href: "/models/finance-calculator", primary: false },
    { label: dict.nav.bookTestDrive, href: "/models/test-drive", primary: true },
  ];

  if (!open) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed inset-0 top-20 z-40"
    >
      {/* Scrim separating the menu from page content behind it */}
      <div className="absolute inset-0 bg-black/70" onClick={onMouseLeave} />

      <div className="relative border-t border-white/10 bg-mhero-charcoal text-white shadow-2xl">
        <div className="container-mhero grid grid-cols-12 gap-8 py-8">
          {/* Left rail */}
          <div className="col-span-3 flex flex-col border-e border-white/10 pe-8">
            <p className="eyebrow mb-3">{dict.nav.modelsRange}</p>
            <h3 className="text-xl font-bold leading-tight text-white">
              {dict.nav.exploreEveryModel}
            </h3>
            <p className="mt-3 text-sm text-white/50">
              {dict.nav.exploreEveryModelDesc}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  onClick={onNavigate}
                  className={
                    cta.primary
                      ? "btn-primary w-full justify-between"
                      : "flex w-full items-center justify-between rounded-none border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/90 transition-colors hover:border-white hover:text-white"
                  }
                >
                  {cta.label}
                  <ArrowRight />
                </Link>
              ))}
            </div>
          </div>

          {/* Model cards */}
          <div className="col-span-9 grid grid-cols-2 gap-4">
            {mhero1 && (
              <Link
                href={`/models/${mhero1.slug}`}
                onClick={onNavigate}
                className="group/card overflow-hidden rounded-2xl border border-white/10 bg-mhero-black transition-colors hover:border-white/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={modelImages[mhero1.slug]}
                    alt={mhero1.name}
                    fill
                    className="scale-110 object-cover transition-transform duration-700 ease-premium group-hover/card:scale-[1.18]"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold">{mhero1.name}</h4>
                  <p className="mt-1 text-xs text-white/50">{mhero1.shortDescription}</p>
                </div>
              </Link>
            )}

            {mhero2Prime && mhero2Terrain && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-mhero-black">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={modelImages[mhero2Prime.slug]}
                    alt="MHERO II"
                    fill
                    className="scale-110 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold">MHERO II</h4>
                  <p className="mt-1 text-xs text-white/50">
                    {locale === "ar" ? "اختر الفئة" : "Choose your variant"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/models/${mhero2Prime.slug}`}
                      onClick={onNavigate}
                      className="flex-1 border border-white/15 px-3 py-2 text-center text-xs font-semibold text-white/90 transition-colors hover:border-white hover:text-white"
                    >
                      {locale === "ar" ? "برايم" : "Prime"}
                    </Link>
                    <Link
                      href={`/models/${mhero2Terrain.slug}`}
                      onClick={onNavigate}
                      className="flex-1 border border-white/15 px-3 py-2 text-center text-xs font-semibold text-white/90 transition-colors hover:border-white hover:text-white"
                    >
                      {locale === "ar" ? "تيرين" : "Terrain"}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path
        d="M9.5 1L15 6M15 6L9.5 11M15 6H1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
