import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import ShowroomsSection from "@/components/contact/ShowroomsSection";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the MHERO team.",
};

export default function ContactPage() {
  const { dict } = getServerDictionary();
  const rows = [
    [dict.contact.headOffice, dict.contact.headOfficeAddress],
    [dict.contact.phone, dict.contact.phoneValue],
    [dict.contact.emailLabel, dict.contact.emailValue],
    [dict.contact.whatsapp, dict.contact.whatsappMessage],
    [dict.contact.warranty, dict.contact.warrantyValue],
  ];

  return (
    <>
      <PageHero
        compact
        title={dict.contact.heroTitle}
        description={dict.contact.intro}
        image="/images/heroes/contact-hero.webp"
        imageLabel="MHERO off-road"
      />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero flex flex-col gap-16 lg:flex-row">
          <div className="flex w-full flex-col gap-6 lg:w-[420px] lg:shrink-0">
            <h2 className="text-2xl font-bold leading-[1.3] text-mhero-black">
              {dict.contact.salesServiceEnquiries}
            </h2>
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-mhero-fog py-3">
                <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-steel">{label}</p>
                <p className="text-base text-mhero-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <ContactForm />
          </div>
        </div>
      </section>
      <ShowroomsSection dict={dict} />
    </>
  );
}
