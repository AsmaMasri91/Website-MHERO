import type { Metadata } from "next";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import LogoStoryHero from "@/components/discover/LogoStoryHero";
import StackingHeroCards from "@/components/discover/StackingHeroCards";
import NumberedSlider from "@/components/models/NumberedSlider";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about MHERO's brand story, mission, and vision.",
};

export default function AboutPage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        eyebrow={dict.discover.aboutEyebrow}
        title={dict.discover.aboutTitle}
        imageLabel="MHERO brand studio"
      />

      <LogoStoryHero
        headlineLine1={dict.discover.legacyHeadlineLine1}
        headlineLine2={dict.discover.legacyHeadlineLine2}
        body={dict.discover.legacyBody}
      />

      <Section title={dict.discover.aboutMheroTitle}>
        <p className="max-w-4xl text-lg text-mhero-steel">{dict.discover.aboutMheroBody}</p>
      </Section>

      <Section light={false} title={dict.discover.technologyParkTitle}>
        <p className="max-w-4xl text-lg text-white/70">{dict.discover.technologyParkBody}</p>
        <div className="relative mt-12 aspect-[3/2] w-full overflow-hidden md:aspect-[21/9]">
          <Image
            src="/images/mhero-technology-park.png"
            alt="MHERO Technology Park aerial view"
            fill
            className="object-cover"
          />
        </div>
      </Section>

      <Section title={dict.discover.alGhurairTitle}>
        <div className="max-w-4xl space-y-5 text-lg text-mhero-steel">
          <p>{dict.discover.alGhurairBody1}</p>
          <p>{dict.discover.alGhurairBody2}</p>
          <p>{dict.discover.alGhurairBody3}</p>
        </div>
        <div className="mt-12">
          <PlaceholderImage
            label="Night exterior lighting signature"
            aspect="aspect-[21/9]"
            showLabel={false}
          />
        </div>
      </Section>

      <Section>
        <NumberedSlider eyebrow={dict.discover.heroesTitle} items={dict.discover.heroesItems} />
      </Section>

      <StackingHeroCards />
    </>
  );
}
