import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import FinanceCalculator from "@/components/finance/FinanceCalculator";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Finance Calculator",
  description: "Estimate your monthly payments for any MHERO model.",
};

export default function FinanceCalculatorPage({
  searchParams,
}: {
  searchParams: { model?: string };
}) {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero
        eyebrow={dict.finance.eyebrow}
        title={dict.finance.title}
        description={dict.finance.description}
        imageLabel="MHERO finance calculator"
        backHref="/models"
        backLabel={dict.common.backToModels}
      />
      <Section>
        <FinanceCalculator initialSlug={searchParams.model} />
      </Section>
    </>
  );
}
