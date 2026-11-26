import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ArticleCard from "@/components/ui/ArticleCard";
import { getServerDictionary } from "@/lib/i18n/server";
import { getBlog } from "@/lib/i18n/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, guides, and insights from the MHERO team.",
};

// Photos supplied in the Figma design.
const POST_IMAGES: Record<string, string> = {
  "life-with-mhero-model-1": "/images/gallery/blog-life-with-mhero.webp",
  "understanding-battery-care": "/images/gallery/blog-battery-care.webp",
  "design-philosophy-behind-mhero": "/images/gallery/blog-design-philosophy.webp",
};

export default function BlogListPage() {
  const { locale, dict } = getServerDictionary();
  const posts = getBlog(locale);

  return (
    <>
      <PageHero
        compact
        title={dict.discover.blogTitle}
        description={dict.discover.blogDescription}
        image="/images/heroes/blog-hero.webp"
        imageLabel="MHERO blog"
      />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard
              key={post.slug}
              href={`/discover/blog/${post.slug}`}
              image={POST_IMAGES[post.slug]}
              imageLabel={post.imageLabel}
              meta={`${new Date(post.date).toLocaleDateString(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} · ${post.author}`}
              title={post.title}
              excerpt={post.excerpt}
              cta={dict.common.readMore}
            />
          ))}
        </div>
      </section>
    </>
  );
}
