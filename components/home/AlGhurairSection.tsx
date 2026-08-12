"use client";

import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AlGhurairSection() {
  const { dict } = useLocale();

  return (
    <Section title={dict.discover.alGhurairTitle}>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <PlaceholderImage
          label="Al Ghurair Mobility showroom"
          aspect="aspect-[4/3]"
          showLabel={false}
        />
        <div className="space-y-5 text-lg text-mhero-steel">
          <p>{dict.discover.alGhurairBody1}</p>
          <p>{dict.discover.alGhurairBody2}</p>
        </div>
      </div>
    </Section>
  );
}
