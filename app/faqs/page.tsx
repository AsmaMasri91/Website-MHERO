"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function FaqsPage() {
  const { dict } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero eyebrow={dict.faqs.eyebrow} title={dict.faqs.title} imageLabel="MHERO support" />
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-mhero-fog border-y border-mhero-fog">
          {dict.faqs.items.map((faq, i) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between py-6 text-start"
              >
                <span className="font-semibold text-mhero-black">{faq.q}</span>
                <span
                  className={`text-mhero-black transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-6 text-mhero-steel">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
