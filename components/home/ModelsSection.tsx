"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/financeMath";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getModels } from "@/lib/i18n/data";

export default function ModelsSection() {
  const { locale, dict } = useLocale();
  const models = getModels(locale);

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.rangeTitle}
      description={dict.home.rangeDescription}
    >
      <div className="grid gap-8 md:grid-cols-2">
        {models.map((model) => (
          <Card key={model.slug} className="!border-white/10 !bg-mhero-charcoal !text-white !shadow-none">
            <PlaceholderImage
              label={model.heroImageLabel}
              aspect="aspect-[16/10]"
              className="transition-transform duration-700 ease-premium group-hover:scale-105"
            />
            <div className="p-7 md:p-8">
              <h3 className="text-2xl font-bold text-white">{model.name}</h3>
              <p className="mt-2 text-sm text-white/60">
                {model.shortDescription}
              </p>
              <p className="mt-4 text-sm text-white/60">
                {dict.common.startingFrom}{" "}
                <span className="font-semibold text-white">
                  {formatCurrency(model.startingPrice, model.currency)}
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/models/${model.slug}`} className="btn-primary">
                  {dict.common.exploreModel}
                </Link>
                <Link href="/models/test-drive" className="btn-outline-light">
                  {dict.common.bookTestDrive}
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
