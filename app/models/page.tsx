import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
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
        compact
        title={dict.models.listingTitle}
        description={dict.models.listingDescription}
        image="/images/heroes/models-hero.png"
        imageLabel="MHERO model range"
      />
      <section data-tone="dark" className="section-y bg-[#0c0c0d] text-white">
        <div className="container-mhero">
          <div className="mb-10 flex flex-col gap-2.5 text-start">
            <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px]">
              {dict.home.rangeEyebrow}
            </p>
            <h2 className="text-4xl font-bold leading-[1.2] tracking-[-0.9px]">{dict.home.rangeTitle}</h2>
            <p className="max-w-[640px] text-base">{dict.home.rangeDescription}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="group relative flex h-[440px] flex-col items-start justify-end gap-2 overflow-hidden p-6"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  {model.heroImage ? (
                    <Image
                      src={model.heroImage}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderImage
                      label={model.heroImageLabel}
                      aspect="aspect-auto"
                      className="h-full w-full transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85" />
                </div>
                {model.powertrain && (
                  <span className="relative bg-mhero-primary px-3 py-2 text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-black">
                    {model.powertrain}
                  </span>
                )}
                <h3 className="relative text-2xl font-bold leading-[1.3] text-white">{model.name}</h3>
                <p className="relative text-sm text-white">{model.tagline}</p>
                <p className="relative text-sm text-white">
                  {dict.common.startingFrom} {formatCurrency(model.startingPrice, model.currency)}
                </p>
                {model.variants.length > 0 && (
                  <ul className="relative flex gap-2" aria-label={dict.models.variant}>
                    {model.variants.map((v) => (
                      <li
                        key={v.id}
                        className="border border-mhero-fog bg-white px-4 py-2.5 text-sm font-semibold leading-[1.4] text-mhero-black"
                      >
                        {v.name}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
