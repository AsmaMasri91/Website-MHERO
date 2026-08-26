import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
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
        eyebrow={dict.offers.eyebrow}
        title={dict.offers.title}
        description={dict.offers.description}
        imageLabel="MHERO current offers"
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {offers.map((offer) => (
            <Card key={offer.slug}>
              {offer.image ? (
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src={offer.image} alt={offer.imageLabel} fill className="object-cover" />
                </div>
              ) : (
                <PlaceholderImage label={offer.imageLabel} aspect="aspect-square" tone="accent" />
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-mhero-black">{offer.title}</h3>
                <p className="mt-2 text-sm text-mhero-steel">{offer.shortDescription}</p>
                <p className="mt-3 text-xs text-mhero-steel">
                  {dict.offers.validUntil}{" "}
                  {new Date(offer.validUntil).toLocaleDateString(
                    locale === "ar" ? "ar-u-nu-latn" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <Link
                  href={`/offers/${offer.slug}`}
                  className="link-underline mt-5 inline-block text-sm font-semibold text-mhero-black"
                >
                  {dict.common.viewOffer} →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
