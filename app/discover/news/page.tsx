import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ArticleCard from "@/components/ui/ArticleCard";
import { getServerDictionary } from "@/lib/i18n/server";
import { getNews } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and announcements from MHERO.",
};

// Photo from the Figma news article frame.
const NEWS_IMAGES: Record<string, string> = {
  "mhero-opens-flagship-showroom": "/images/gallery/blog-life-with-mhero.webp",
};

export default function NewsListPage() {
  const { locale, dict } = getServerDictionary();
  const news = getNews(locale);

  return (
    <>
      <PageHero
        compact
        title={dict.discover.newsTitle}
        description={dict.discover.newsDescription}
        image="/images/gallery/blog-life-with-mhero.webp"
        imageLabel="MHERO newsroom"
      />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero grid gap-6 md:grid-cols-3">
          {news.map((article) => (
            <ArticleCard
              key={article.slug}
              href={`/discover/news/${article.slug}`}
              image={NEWS_IMAGES[article.slug]}
              imageLabel={article.imageLabel}
              meta={new Date(article.date).toLocaleDateString(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              title={article.title}
              excerpt={article.excerpt}
              cta={dict.common.readMore}
            />
          ))}
        </div>
      </section>
    </>
  );
}
