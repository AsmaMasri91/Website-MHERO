"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function FaqsPage() {
  const { dict } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        compact
        title={dict.faqs.title}
        description={dict.faqs.eyebrow}
        image="/images/heroes/contact-hero.webp"
        imageLabel="MHERO support"
      />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero">
          <div className="mx-auto max-w-[880px]">
            {dict.faqs.items.map((faq, i) => (
              <div key={faq.q} className="border-b border-mhero-fog">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className={`flex w-full items-center justify-between gap-4 pt-6 text-start ${open === i ? "pb-3" : "pb-6"}`}
                >
                  <span className="text-lg font-bold leading-[1.35] text-mhero-black">{faq.q}</span>
                  <span className="text-2xl font-bold leading-[1.3] text-mhero-black">{open === i ? "–" : "+"}</span>
                </button>
                {open === i && <p className="pb-6 text-base leading-[1.5] text-mhero-steel">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
