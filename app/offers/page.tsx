import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import OffersHeroForm from "@/components/forms/OffersHeroForm";
import { getServerDictionary } from "@/lib/i18n/server";
import { getOffers } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Offers",
  description: "Explore current MHERO offers and promotions.",
};

export default function OffersPage() {
  const { locale, dict } = getServerDictionary();
  const offers = getOffers(locale);

  return (
    <>
      <PageHero
        tall
        title={dict.offers.title}
        description={dict.offers.description}
        image="/images/heroes/offers-hero.webp"
        imageLabel="MHERO current offers"
        aside={<OffersHeroForm />}
      />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero grid gap-8 md:grid-cols-2">
          {offers.map((offer) => (
            <Link
              key={offer.slug}
              href={`/offers/${offer.slug}`}
              className="group flex flex-col overflow-hidden border border-mhero-fog bg-white transition-shadow duration-300 hover:shadow-xl focus-visible:outline-offset-4"
            >
              <div className="relative h-[560px] w-full overflow-hidden">
                {offer.image ? (
                  <Image
                    src={offer.image}
                    alt={offer.imageLabel}
                    fill
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderImage label={offer.imageLabel} aspect="aspect-auto h-full" className="h-full" tone="accent" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-8">
                {offer.cardEyebrow && (
                  <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-[#174D56]">
                    {offer.cardEyebrow}
                  </p>
                )}
                <h3 className="text-2xl font-bold leading-[1.3] text-mhero-black">
                  {offer.cardTitle ?? offer.title}
                </h3>
                <div className="mb-auto flex flex-col gap-3 text-base text-mhero-steel">
                  {offer.cardHighlights ? (
                    offer.cardHighlights.map((line) => <p key={line}>{line}</p>)
                  ) : (
                    <p>{offer.shortDescription}</p>
                  )}
                </div>
                <span className="inline-block text-sm font-semibold leading-[1.4] text-mhero-black">
                  {dict.common.viewOffer}{" "}
                  <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
