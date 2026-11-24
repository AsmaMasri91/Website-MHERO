import Image from "next/image";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

/** Figma "Card/News": bordered card, 315px image, meta eyebrow, title, excerpt and a Read More link. */
export default function ArticleCard({
  href,
  image,
  imageLabel,
  meta,
  title,
  excerpt,
  cta,
}: {
  href: string;
  image?: string;
  imageLabel: string;
  meta: string;
  title: string;
  excerpt: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-mhero-fog bg-white transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative h-[315px] w-full overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={imageLabel}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage label={imageLabel} aspect="aspect-auto h-full" className="h-full" showLabel={false} />
        )}
      </div>
      <div className="flex flex-col gap-3 p-6">
        <p className="text-xs font-semibold uppercase leading-[1.4] tracking-[3px] text-mhero-steel">{meta}</p>
        <h3 className="text-lg font-bold leading-[1.35] text-mhero-black">{title}</h3>
        <p className="text-sm text-mhero-steel">{excerpt}</p>
        <span className="text-sm font-semibold leading-[1.4] text-mhero-black">
          {cta}{" "}
          <span aria-hidden="true" className="inline-block rtl:rotate-180">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
