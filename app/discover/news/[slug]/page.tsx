import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import newsData from "@/data/news.json";
import { NewsArticle } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import ShareButtons from "@/components/discover/ShareButtons";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews } from "@/lib/i18n/data";

const newsEn = newsData as NewsArticle[];

export function generateStaticParams() {
  return newsEn.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = newsEn.find((n) => n.slug === params.slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const article = getNews(locale).find((n) => n.slug === params.slug);
  if (!article) notFound();

  return (
    <div className="pt-32">
      <Section>
        <Link href="/discover/news" className="text-sm text-mhero-steel hover:text-mhero-black">
          {locale === "ar" ? "→" : "←"} {dict.discover.backToNews}
        </Link>
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-steel md:text-sm">
            {new Date(article.date).toLocaleDateString(
              locale === "ar" ? "ar-u-nu-latn" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-mhero-black md:text-4xl">
            {article.title}
          </h1>
          <PlaceholderImage
            label={article.imageLabel}
            aspect="aspect-[16/9]"
            className="my-8 rounded-2xl"
          />
          <div className="space-y-5 text-lg text-mhero-steel">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-mhero-fog pt-6">
            <ShareButtons title={article.title} />
          </div>
        </div>
      </Section>
    </div>
  );
}
