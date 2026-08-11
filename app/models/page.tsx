import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ModelsSection from "@/components/home/ModelsSection";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Models",
  description: "Explore the full MHERO model range.",
};

export default function ModelsOverviewPage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        eyebrow={dict.models.eyebrow}
        title={dict.models.listingTitle}
        imageLabel="MHERO model range"
      />
      <ModelsSection />
    </>
  );
}
