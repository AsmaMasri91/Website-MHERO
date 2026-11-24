import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import modelsData from "@/data/models.json";
import { VehicleModel } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import ModelHero from "@/components/models/ModelHero";
import ModelSpecStrip from "@/components/models/ModelSpecStrip";
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
  const brochureHref = `/brochures/${model.slug}.pdf`;
  const hasBrochure = fs.existsSync(path.join(process.cwd(), "public", "brochures", `${model.slug}.pdf`));

  return (
    <>
      {/* Hero */}
      <ModelHero model={model} dict={dict} />
      <ModelSpecStrip model={model} />

      {/* Colours */}
      <Section
        compact
        showEyebrow
        eyebrow={dict.models.customize}
        title={dict.models.availableColours}
        action={
          hasBrochure ? (
            <a href={brochureHref} download className="btn-primary">
              {dict.common.downloadBrochure}
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Brochure coming soon"
              className="btn-primary cursor-default hover:scale-100"
            >
              {dict.common.downloadBrochure}
            </button>
          )
        }
      >
        <ColourSwatches
          exteriorColours={model.colours}
          interiorColours={model.interiorColours}
          modelName={model.name}
        />
      </Section>

      {/* Stats */}
      <StatsBar eyebrow={d.statsEyebrow} stats={d.stats} />

      {/* Interactive exterior highlights */}
      <section className="bg-white py-[72px]">
        <div className="container-mhero">
          <h2 className="mb-10 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{d.highlightsTitle}</h2>
          <HotspotFeature
            image={hotspotImages[model.slug]}
            imageLabel={d.exteriorImageLabel}
            features={d.highlights}
          />
        </div>
      </section>

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
        showEyebrow
        className="!bg-[#0c0c0d] !py-20"
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
      <Section showEyebrow className="!py-20" eyebrow={dict.models.details} title={d.accessoriesTitle}>
        <AccessoriesGrid
          accessories={d.accessories}
          factoryOptionalEquipment={d.factoryOptionalEquipment}
          factoryOptionalEquipmentTabLabel={d.factoryOptionalEquipmentTitle}
        />
      </Section>

      {/* Final CTA */}
      <Section className="!bg-mhero-white !py-24 text-center">
        <h2 className="!text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {locale === "ar" ? `جاهز لتجربة ${model.name}؟` : `Ready to experience ${model.name}?`}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/models/test-drive" className="btn-primary">
            {dict.common.bookTestDrive}
          </Link>
          <Link href="/models/compare" className="btn-outline">
            {dict.nav.compareModels}
          </Link>
        </div>
      </Section>
    </>
  );
}
