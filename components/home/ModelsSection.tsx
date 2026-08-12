"use client";

import { useRef } from "react";
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

export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);
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
              className="group snap-item relative block w-[85%] shrink-0 overflow-hidden border border-white/10 sm:w-[60%] md:w-[45%] lg:w-[32%]"
            >
              <PlaceholderImage
                label={model.heroImageLabel}
                aspect="aspect-[3/4]"
                className="transition-transform duration-700 ease-premium group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-bold text-white">{model.name}</h3>
                <p className="mt-1 text-sm text-white/70">{model.tagline}</p>
                <p className="mt-2 text-sm text-white/70">
                  {dict.common.startingFrom}{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(model.startingPrice, model.currency)}
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
