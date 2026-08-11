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
        eyebrow={dict.models.eyebrow}
        title={dict.models.compareTitle}
        description={dict.models.compareDescription}
        imageLabel="Compare MHERO models"
        backHref="/models"
        backLabel={dict.common.backToModels}
      />
      <Section>
        <CompareDragDrop />
      </Section>
    </>
  );
}
