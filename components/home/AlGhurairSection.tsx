"use client";

import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AlGhurairSection() {
  const { dict } = useLocale();

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <PlaceholderImage
          label="Al Ghurair Mobility showroom"
          aspect="aspect-[4/3]"
          showLabel={false}
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-mhero-black md:text-4xl">
            {dict.discover.alGhurairTitle}
          </h2>
          <div className="mt-6 space-y-5 text-lg text-mhero-steel">
            <p>{dict.discover.alGhurairBody1}</p>
            <p>{dict.discover.alGhurairBody2}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
