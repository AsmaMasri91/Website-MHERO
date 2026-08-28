"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/financeMath";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const allModels = getModels(locale);
  const models = allModels.filter((m) => m.slug === "mhero-1" || m.slug === "mhero-2");

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.rangeTitle}
      description={dict.home.rangeDescription}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {models.map((model) => (
          <Link
            key={model.slug}
            href={`/models/${model.slug}`}
            className="group relative block aspect-square overflow-hidden border border-white/10"
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
                  {formatCurrency(model.startingPrice, model.currency)}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
