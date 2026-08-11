import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and announcements from MHERO.",
};

export default function NewsListPage() {
  const { locale, dict } = getServerDictionary();
  const news = getNews(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.discover.newsEyebrow}
        title={dict.discover.newsTitle}
        imageLabel="MHERO newsroom"
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {news.map((article) => (
            <Card key={article.slug}>
              <PlaceholderImage label={article.imageLabel} aspect="aspect-[4/3]" showLabel={false} />
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-widest2 text-mhero-steel">
                  {new Date(article.date).toLocaleDateString(
                    locale === "ar" ? "ar-u-nu-latn" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <h3 className="mt-3 text-lg font-bold text-mhero-black">{article.title}</h3>
                <p className="mt-2 text-sm text-mhero-steel">{article.excerpt}</p>
                <Link
                  href={`/discover/news/${article.slug}`}
                  className="link-underline mt-5 inline-block text-xs font-semibold uppercase tracking-widest2 text-mhero-black"
                >
                  {dict.common.readMore} ›
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
