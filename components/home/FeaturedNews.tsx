"use client";

import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getNews } from "@/lib/i18n/data";

export default function FeaturedNews() {
  const { locale, dict } = useLocale();
  const news = getNews(locale).slice(0, 3);

  return (
    <Section eyebrow={dict.home.newsEyebrow} title={dict.home.newsTitle} light>
      <div className="grid gap-8 md:grid-cols-3">
        {news.map((article) => (
          <Card key={article.slug}>
            <PlaceholderImage
              label={article.imageLabel}
              aspect="aspect-[4/3]"
              tone="light"
              showLabel={false}
            />
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-widest2 text-mhero-steel">
                {new Date(article.date).toLocaleDateString(
                  locale === "ar" ? "ar-u-nu-latn" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </p>
              <h3 className="mt-3 text-lg font-bold text-mhero-black">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-mhero-steel">
                {article.excerpt}
              </p>
              <Link
                href={`/discover/news/${article.slug}`}
                className="link-underline mt-5 inline-block text-sm font-semibold text-mhero-black"
              >
                {dict.common.readMore} →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
