import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import CompareDragDrop from "@/components/models/CompareDragDrop";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Compare Models",
  description: "Compare MHERO Model 1 and Model 2 side by side.",
};

export default function ComparePage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        compact
        title={dict.models.compareTitle}
        description={dict.models.compareDescription}
        image="/images/heroes/contact-hero.webp"
        imageLabel="Compare MHERO models"
      />
      <Section>
        <CompareDragDrop />
      </Section>
    </>
  );
}
