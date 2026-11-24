import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { getServerDictionary } from "@/lib/i18n/server";
import { getServices } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "After Sales",
  description: "MHERO after sales services — maintenance, parts, warranty and software updates.",
};

// Photos supplied in the Figma design; the other two cards use a plain tinted block.
const SERVICE_IMAGES: Record<string, string> = {
  "scheduled-maintenance": "/images/models/service-maintenance.webp",
  "software-updates": "/images/models/service-software.webp",
};

export default function AfterSalesPage() {
  const { locale, dict } = getServerDictionary();
  const services = getServices(locale);

  return (
    <>
      <PageHero
        compact
        title={dict.afterSales.title}
        description={dict.afterSales.description}
        image="/images/heroes/after-sales-hero.webp"
        imageLabel="MHERO after sales service centre"
      />

      <section className="bg-white py-20">
        <div className="container-mhero flex flex-col gap-8">
          <div className="flex flex-col gap-2.5 text-start">
            <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-steel">
              {dict.afterSales.eyebrow}
            </p>
            <h2 className="text-4xl font-bold leading-[1.2] tracking-[-0.9px] text-mhero-black">
              {dict.afterSales.servicesTitle}
            </h2>
            <p className="max-w-[640px] text-base text-mhero-steel">{dict.afterSales.servicesDescription}</p>
          </div>

          <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col border border-mhero-fog bg-white">
                <div className="relative h-[232px] w-full bg-mhero-white">
                  {SERVICE_IMAGES[service.id] && (
                    <Image
                      src={SERVICE_IMAGES[service.id]}
                      alt={service.imageLabel}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2.5 p-6">
                  <h3 className="text-lg font-bold leading-[1.35] text-mhero-black">{service.title}</h3>
                  <p className="text-sm text-mhero-steel">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0c0c0d] py-24 text-center text-white">
        <div className="container-mhero flex flex-col items-center gap-5">
          <h2 className="text-4xl font-bold leading-[1.2] tracking-[-0.9px]">{dict.afterSales.bookServiceCtaTitle}</h2>
          <p className="text-lg leading-[1.6]">{dict.afterSales.bookServiceCtaDescription}</p>
          <Link href="/after-sales/book-service" className="btn-primary">
            {dict.afterSales.bookService}
          </Link>
        </div>
      </section>
    </>
  );
}
