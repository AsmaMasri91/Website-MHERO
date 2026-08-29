import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import modelsData from "@/data/models.json";
import { VehicleModel } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import ModelHero from "@/components/models/ModelHero";
import StatsBar from "@/components/models/StatsBar";
import HotspotFeature from "@/components/models/HotspotFeature";
import CabinTabs from "@/components/models/CabinTabs";
import UtilitySpecs from "@/components/models/UtilitySpecs";
import SpecsTable from "@/components/models/SpecsTable";
import ColourSwatches from "@/components/models/ColourSwatches";
import AccessoriesGrid from "@/components/models/AccessoriesGrid";
import NumberedSlider from "@/components/models/NumberedSlider";
import { getServerDictionary } from "@/lib/i18n/server";
import { getModels } from "@/lib/i18n/data";
import { formatCurrency } from "@/lib/financeMath";

const modelsEn = modelsData as VehicleModel[];

const hotspotImages: Record<string, string> = {
  "mhero-1": "/images/models/mhero-1-best-of-both.webp",
  "mhero-2": "/images/best-of-both-mhero-2.webp",
  "mhero-2-terrain": "/images/best-of-both-mhero-2.webp",
};

export function generateStaticParams() {
  return modelsEn.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const model = modelsEn.find((m) => m.slug === params.slug);
  if (!model) return {};
  return {
    title: model.name,
    description: model.shortDescription,
  };
}

export default function ModelDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const model = getModels(locale).find((m) => m.slug === params.slug);
  if (!model) notFound();

  const d = model.detailPage;

  return (
    <>
      {/* Hero */}
      <ModelHero model={model} dict={dict} />

      {/* Colours */}
      <Section eyebrow={dict.models.customize} title={dict.models.availableColours}>
        <ColourSwatches
          exteriorColours={model.colours}
          interiorColours={model.interiorColours}
          modelName={model.name}
        />
      </Section>

      {/* Stats */}
      <StatsBar eyebrow={d.statsEyebrow} stats={d.stats} />

      {/* Interactive exterior highlights */}
      <div className="container-mhero flex flex-wrap items-end justify-between gap-6 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{d.highlightsTitle}</h2>
        </div>
        <button className="btn-outline shrink-0" disabled title="Sample brochure — connect a real PDF">
          {dict.common.downloadBrochure}
        </button>
      </div>
      <div className="mt-8">
        <HotspotFeature
          image={hotspotImages[model.slug]}
          imageLabel={d.exteriorImageLabel}
          features={d.highlights}
        />
      </div>

      {/* Box highlighting exterior features (e.g. all-terrain performance) */}
      {d.terrainItems && d.terrainItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.terrainEyebrow ?? ""} items={d.terrainItems} />
        </Section>
      )}

      {/* Design gallery (not shown on MHERO I) */}
      {model.slug !== "mhero-1" && (
        <Section>
          <NumberedSlider
            badge={d.designEyebrow}
            eyebrow={d.designTitle}
            items={d.designGallery.map((slide) => ({
              title: slide.heading,
              body: slide.body,
              imageLabel: slide.imageLabel,
            }))}
          />
        </Section>
      )}

      {/* Additional exterior highlights */}
      {d.exteriorItems && d.exteriorItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.exteriorEyebrow ?? ""} items={d.exteriorItems} />
        </Section>
      )}

      {/* Box highlighting interior features (e.g. private jet cabin) */}
      {d.interiorItems && d.interiorItems.length > 0 && (
        <Section>
          <NumberedSlider eyebrow={d.interiorEyebrow ?? ""} items={d.interiorItems} />
        </Section>
      )}

      {/* Cabin */}
      <Section
        light={false}
        eyebrow={d.cabinEyebrow}
        title={d.cabinTitle}
        description={d.cabinIntro}
      >
        <CabinTabs tabs={d.cabinTabs} />
      </Section>

      {/* Utility (not shown on MHERO I) */}
      {model.slug !== "mhero-1" && (
        <Section light={false} eyebrow={dict.models.details} title={d.utilityTitle} description={d.utilityIntro} className="pt-0">
          <UtilitySpecs specs={d.utilitySpecs} />
        </Section>
      )}

      {/* Full specifications (The Numbers) */}
      <Section id="specifications" eyebrow={dict.models.specifications} title={dict.models.theNumbers}>
        <SpecsTable groups={model.specs} />
      </Section>

      {/* Accessories */}
      <Section eyebrow={dict.models.details} title={d.accessoriesTitle}>
        <AccessoriesGrid
          accessories={d.accessories}
          factoryOptionalEquipment={d.factoryOptionalEquipment}
          factoryOptionalEquipmentTabLabel={d.factoryOptionalEquipmentTitle}
        />
      </Section>

      {/* Final CTA */}
      <Section light={false} className="text-center">
        <h2 className="!text-center text-3xl font-bold tracking-tight md:text-5xl">
          {locale === "ar" ? `جاهز لتجربة ${model.name}؟` : `Ready to experience ${model.name}?`}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/models/test-drive" className="btn-primary">
            {dict.common.bookTestDrive}
          </Link>
          <Link
            href={`/models/finance-calculator?model=${model.slug}`}
            className="btn-outline-light"
          >
            {dict.nav.calculateFinance}
          </Link>
          <Link href="/models/compare" className="btn-outline-light">
            {dict.nav.compareModels}
          </Link>
        </div>
      </Section>
    </>
  );
}
