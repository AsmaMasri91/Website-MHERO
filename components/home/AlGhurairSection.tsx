"use client";

import Image from "next/image";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function AlGhurairSection() {
  const { dict } = useLocale();

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src="/images/al-ghurair-showroom.png"
            alt="Al Ghurair Mobility and MHERO showroom"
            fill
            className="object-cover object-top"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-mhero-black md:text-5xl">
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
