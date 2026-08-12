import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import offersData from "@/data/offers.json";
import { Offer } from "@/lib/types";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { getServerDictionary } from "@/lib/i18n/server";
import { getOffers } from "@/lib/i18n/data";

const offersEn = offersData as Offer[];

export function generateStaticParams() {
  return offersEn.map((o) => ({ slug: o.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const offer = offersEn.find((o) => o.slug === params.slug);
  if (!offer) return {};
  return { title: offer.title, description: offer.shortDescription };
}

export default function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const offer = getOffers(locale).find((o) => o.slug === params.slug);
  if (!offer) notFound();

  return (
    <>
      <PageHero
        title={offer.title}
        imageLabel={offer.imageLabel}
        backHref="/offers"
        backLabel={dict.offers.backToOffers}
      />

      <Section eyebrow={dict.offers.detailsEyebrow} title={dict.offers.aboutThisOffer}>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <p className="text-lg text-mhero-steel">{offer.description}</p>

            <div className="mt-10">
              <h3 className="text-lg font-bold text-mhero-black">{dict.offers.termsAndConditions}</h3>
              <ul className="mt-4 space-y-3">
                {offer.terms.map((term) => (
                  <li key={term} className="flex gap-3 text-sm text-mhero-steel">
                    <span className="mt-1 text-mhero-black">—</span>
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-10 text-sm text-mhero-steel">
              {dict.offers.validUntil}{" "}
              <span className="font-semibold text-mhero-black">
                {new Date(offer.validUntil).toLocaleDateString(
                  locale === "ar" ? "ar-u-nu-latn" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </span>
            </p>

            <div className="mt-6">
              <Link href="/models/test-drive" className="btn-primary">
                {dict.common.bookTestDrive}
              </Link>
            </div>
          </div>

          <PlaceholderImage label={offer.imageLabel} aspect="aspect-square" showLabel={false} />
        </div>
      </Section>
    </>
  );
}
