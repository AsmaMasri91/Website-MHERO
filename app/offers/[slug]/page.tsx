import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import offersData from "@/data/offers.json";
import { Offer } from "@/lib/types";
import PageHero from "@/components/ui/PageHero";
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
  const heroDescription = offer.description.split(", arranged")[0].replace(/\.$/, "") + ".";

  return (
    <>
      <PageHero
        compact
        title={offer.title}
        description={heroDescription}
        image={offer.image}
        imageLabel={offer.imageLabel}
      />

      <section className="bg-white py-20">
        <div className="container-mhero grid gap-16 lg:grid-cols-[1fr_560px] lg:items-start">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
              {dict.offers.detailsEyebrow}
            </p>
            <h2 className="text-4xl font-bold leading-[1.2] tracking-[-0.9px] text-mhero-black">
              {dict.offers.aboutThisOffer}
            </h2>
            <p className="text-lg leading-[1.6] text-mhero-steel">{offer.description}</p>

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold leading-[1.3] text-mhero-black">{dict.offers.termsAndConditions}</h3>

              {offer.termsSections ? (
                <div className="flex flex-col gap-6">
                  {offer.termsSections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="text-sm font-semibold leading-[1.4] text-mhero-black">{section.heading}</h4>
                      {section.body && (
                        <p className="mt-1.5 text-sm text-mhero-steel">{section.body}</p>
                      )}
                      {section.items && (
                        <ul className="mt-2 space-y-3">
                          {section.items.map((item) => (
                            <li key={item.text} className="text-sm leading-relaxed text-mhero-steel">
                              <div className="flex gap-3">
                                <span className="mt-1 text-mhero-black">—</span>
                                <span>{item.text}</span>
                              </div>
                              {item.subItems && (
                                <ul className="ms-6 mt-2 space-y-2">
                                  {item.subItems.map((sub) => (
                                    <li key={sub} className="flex gap-3 text-sm text-mhero-steel">
                                      <span className="mt-1 text-mhero-black">·</span>
                                      {sub}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {offer.terms.map((term) => (
                    <li key={term} className="flex gap-3 text-sm text-mhero-steel">
                      <span className="mt-1 text-mhero-black">—</span>
                      {term}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-sm font-semibold leading-[1.4] text-mhero-black">
              {dict.offers.validUntil}{" "}
              {new Date(offer.validUntil).toLocaleDateString(
                locale === "ar" ? "ar-u-nu-latn" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </p>

            <div>
              <Link href="/models/test-drive" className="btn-primary">
                {dict.common.bookTestDrive}
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            {offer.image ? (
              <div className="relative aspect-square w-full overflow-hidden">
                <Image src={offer.image} alt={offer.imageLabel} fill sizes="560px" className="object-cover" />
              </div>
            ) : (
              <PlaceholderImage label={offer.imageLabel} aspect="aspect-square" showLabel={false} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
