"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

const LINKABLE = new Set([
  "/models",
  "/offers",
  "/after-sales",
  "/pre-owned",
  "/discover/news",
  "/discover/blog",
  "/discover/about",
]);

export default function Breadcrumbs({ current }: { current?: string }) {
  const pathname = usePathname() ?? "/";
  const { dict } = useLocale();

  const labels: Record<string, string> = {
    models: dict.nav.models,
    offers: dict.nav.offers,
    "after-sales": dict.nav.afterSales,
    "pre-owned": dict.nav.preOwned,
    discover: dict.nav.discover,
    about: dict.nav.discoverLinks.about,
    news: dict.nav.discoverLinks.news,
    blog: dict.nav.discoverLinks.blog,
    compare: dict.nav.compareModels,
    "finance-calculator": dict.nav.financeCalculator,
    "test-drive": dict.nav.bookTestDrive,
    "book-service": dict.afterSales.bookService,
    contact: dict.footer.contactUs,
    faqs: dict.footer.faqs,
    "cookies-policy": dict.footer.cookiesPolicy,
    "privacy-policy": dict.footer.privacyPolicy,
    terms: dict.footer.terms,
  };

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label = labels[seg] ?? (isLast && current ? current : seg);
    return { label, href, isLast };
  });

  const items = [{ label: "MHERO UAE", href: "/", isLast: false }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((c, i) => (
          <li key={c.href + i} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-white/50 rtl:rotate-180">
                ›
              </span>
            )}
            {c.isLast ? (
              <span aria-current="page" className="font-medium text-white">
                {c.label}
              </span>
            ) : c.href === "/" || LINKABLE.has(c.href) ? (
              <Link href={c.href} className="text-white/70 transition-colors hover:text-white">
                {c.label}
              </Link>
            ) : (
              <span className="text-white/70">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
