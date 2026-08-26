"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/financeMath";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d={direction === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HOMEPAGE_PRICE_OVERRIDES: Record<string, number> = {
  "mhero-1": 299900,
  "mhero-2": 199900,
};

export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const allModels = getModels(locale);
  const models = allModels.filter((m) => m.slug === "mhero-1" || m.slug === "mhero-2");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : 400;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.rangeTitle}
      description={dict.home.rangeDescription}
    >
      <div className="relative">
        <div
          ref={scrollRef}
          className="snap-row no-scrollbar -mx-6 flex gap-6 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10"
        >
          {models.map((model) => (
            <Link
              key={model.slug}
              href={`/models/${model.slug}`}
              data-card
              className="group snap-item relative block aspect-square w-[90%] shrink-0 overflow-hidden border border-white/10 sm:w-[75%] md:w-[58%] lg:w-[42%]"
            >
              {model.heroImage ? (
                <Image
                  src={model.heroImage}
                  alt={model.heroImageLabel}
                  fill
                  className="scale-110 object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.18]"
                />
              ) : (
                <PlaceholderImage
                  label={model.heroImageLabel}
                  aspect="aspect-square"
                  className="transition-transform duration-700 ease-premium group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">
                  {model.slug === "mhero-2" ? "MHERO II" : model.name}
                </h3>
                <p className="mt-1 text-sm text-white/70">{model.tagline}</p>
                <p className="mt-2 text-sm text-white/70">
                  {dict.common.startingFrom}{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(
                      HOMEPAGE_PRICE_OVERRIDES[model.slug] ?? model.startingPrice,
                      model.currency
                    )}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={locale === "ar" ? "السابق" : "Previous"}
            className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-mhero-black"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={locale === "ar" ? "التالي" : "Next"}
            className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-mhero-black"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </Section>
  );
}
