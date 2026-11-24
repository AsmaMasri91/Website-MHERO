import { notFound } from "next/navigation";
import type { Metadata } from "next";
import blogData from "@/data/blog.json";
import { BlogPost } from "@/lib/types";
import ArticleLayout from "@/components/discover/ArticleLayout";
import { getServerDictionary } from "@/lib/i18n/server";
import { getBlog } from "@/lib/i18n/data";

const postsEn = blogData as BlogPost[];

// Hero photos from the Figma design (the first article uses the photo drawn in its frame).
const POST_HERO_IMAGES: Record<string, string> = {
  "life-with-mhero-model-1": "/images/gallery/blog-battery-care.webp",
  "understanding-battery-care": "/images/gallery/blog-battery-care.webp",
  "design-philosophy-behind-mhero": "/images/gallery/blog-design-philosophy.webp",
};

export function generateStaticParams() {
  return postsEn.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = postsEn.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { locale, dict } = getServerDictionary();
  const post = getBlog(locale).find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <ArticleLayout
      title={post.title}
      meta={`${new Date(post.date).toLocaleDateString(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} · ${post.author}`}
      image={POST_HERO_IMAGES[post.slug]}
      imageLabel={post.imageLabel}
      body={post.body}
      backHref="/discover/blog"
      backLabel={dict.common.back}
      rtl={locale === "ar"}
    />
  );
}
