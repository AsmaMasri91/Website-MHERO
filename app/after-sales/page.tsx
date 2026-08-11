import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { getServerDictionary } from "@/lib/i18n/server";
import { getServices } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "After Sales",
  description: "MHERO after sales services — maintenance, parts, warranty and software updates.",
};

export default function AfterSalesPage() {
  const { locale, dict } = getServerDictionary();
  const services = getServices(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.afterSales.eyebrow}
        title={dict.afterSales.title}
        description={dict.afterSales.description}
        imageLabel="MHERO after sales service centre"
      />
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.id}>
              <PlaceholderImage label={service.imageLabel} aspect="aspect-[4/3]" />
              <div className="p-6">
                <h3 className="text-base font-bold text-mhero-black">{service.title}</h3>
                <p className="mt-2 text-sm text-mhero-steel">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section light={false} className="text-center">
        <h2 className="!text-center text-3xl font-bold tracking-tight md:text-4xl">
          {dict.afterSales.bookServiceCtaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          {dict.afterSales.bookServiceCtaDescription}
        </p>
        <div className="mt-8">
          <Link href="/after-sales/book-service" className="btn-primary">
            {dict.afterSales.bookService}
          </Link>
        </div>
      </Section>
    </>
  );
}
