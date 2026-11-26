import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

/** Figma article layout: compact photo hero (title + meta line) and a narrow body column with a Back button. */
export default function ArticleLayout({
  title,
  meta,
  image,
  imageLabel,
  body,
  backHref,
  backLabel,
  rtl,
}: {
  title: string;
  meta: string;
  image?: string;
  imageLabel: string;
  body: string[];
  backHref: string;
  backLabel: string;
  rtl?: boolean;
}) {
  return (
    <>
      <PageHero compact title={title} description={meta} image={image} imageLabel={imageLabel} />
      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero">
          <div className="mx-auto flex max-w-[880px] flex-col items-start gap-6">
            {body.map((para, i) => (
              <p key={i} className="text-lg leading-[1.6] text-mhero-steel">
                {para}
              </p>
            ))}
            <Link href={backHref} className="btn-outline">
              {rtl ? "→" : "←"} {backLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
