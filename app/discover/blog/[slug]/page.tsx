import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import blogData from "@/data/blog.json";
import { BlogPost } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import ShareButtons from "@/components/discover/ShareButtons";
import { getServerDictionary } from "@/lib/i18n/server";
import { getBlog } from "@/lib/i18n/data";

const postsEn = blogData as BlogPost[];

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
    <div className="pt-32">
      <Section>
        <Link href="/discover/blog" className="text-sm text-mhero-steel hover:text-mhero-black">
          {locale === "ar" ? "→" : "←"} {dict.discover.backToBlog}
        </Link>
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-mhero-steel md:text-sm">
            {post.author} ·{" "}
            {new Date(post.date).toLocaleDateString(
              locale === "ar" ? "ar-u-nu-latn" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-mhero-black md:text-4xl">
            {post.title}
          </h1>
          <PlaceholderImage
            label={post.imageLabel}
            aspect="aspect-[16/9]"
            className="my-8 rounded-2xl"
          />
          <div className="space-y-5 text-lg text-mhero-steel">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-mhero-fog pt-6">
            <ShareButtons title={post.title} />
          </div>
        </div>
      </Section>
    </div>
  );
}
