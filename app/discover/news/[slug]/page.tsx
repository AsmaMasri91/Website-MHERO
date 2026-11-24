import { notFound } from "next/navigation";
import type { Metadata } from "next";
import newsData from "@/data/news.json";
import { NewsArticle } from "@/lib/types";
import ArticleLayout from "@/components/discover/ArticleLayout";
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
    <ArticleLayout
      title={article.title}
      meta={new Date(article.date).toLocaleDateString(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      image="/images/gallery/blog-life-with-mhero.webp"
      imageLabel={article.imageLabel}
      body={article.body}
      backHref="/discover/news"
      backLabel={dict.common.back}
      rtl={locale === "ar"}
    />
  );
}
