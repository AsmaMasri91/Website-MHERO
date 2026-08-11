import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/forms/ContactForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the MHERO team.",
};

export default function ContactPage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero title={dict.contact.heroTitle} imageLabel="MHERO showroom" />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-mhero-black md:text-3xl">
              {dict.contact.salesServiceEnquiries}
            </h2>

            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">
                  {dict.contact.phone}
                </dt>
                <dd className="mt-1.5 font-medium text-mhero-black">600 540045</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">
                  {dict.contact.whatsapp}
                </dt>
                <dd className="mt-1.5 font-medium text-mhero-black">{dict.contact.whatsappMessage}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">
                  {dict.contact.warranty}
                </dt>
                <dd className="mt-1.5 font-medium text-mhero-black">{dict.contact.warrantyValue}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-widest2 text-mhero-ash">
                  {dict.contact.location}
                </dt>
                <dd className="mt-1.5 font-medium text-mhero-black">{dict.contact.headOfficeAddress}</dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
