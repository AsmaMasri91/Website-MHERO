import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatCurrency } from "@/lib/financeMath";
import { getServerDictionary } from "@/lib/i18n/server";
import { getModels } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Models",
  description: "Explore the full MHERO model range.",
};

export default function ModelsOverviewPage() {
  const { locale, dict } = getServerDictionary();
  const models = getModels(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.models.eyebrow}
        title={dict.models.listingTitle}
        imageLabel="MHERO model range"
      />
      <Section
        light={false}
        eyebrow={dict.home.rangeEyebrow}
        title={dict.home.rangeTitle}
        description={dict.home.rangeDescription}
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
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
      </Section>
    </>
  );
}
