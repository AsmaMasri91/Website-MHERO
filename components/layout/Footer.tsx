"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SocialIcons from "@/components/layout/SocialIcons";

export default function Footer() {
  const { dict } = useLocale();

  const columns = [
    {
      title: dict.nav.models,
      links: [
        { label: dict.nav.modelsLinks.model1, href: "/models/mhero-1" },
        { label: dict.nav.modelsLinks.model2, href: "/models/mhero-2" },
        { label: dict.nav.bookTestDrive, href: "/models/test-drive" },
        { label: dict.nav.compareModels, href: "/models/compare" },
        { label: dict.nav.financeCalculator, href: "/models/finance-calculator" },
      ],
    },
    {
      title: dict.footer.explore,
      links: [
        { label: dict.nav.offers, href: "/offers" },
        { label: dict.nav.afterSales, href: "/after-sales" },
        { label: dict.nav.preOwned, href: "/pre-owned" },
      ],
    },
    {
      title: dict.footer.discover,
      links: [
        { label: dict.nav.discoverLinks.about, href: "/discover/about" },
        { label: dict.nav.discoverLinks.news, href: "/discover/news" },
        { label: dict.nav.discoverLinks.blog, href: "/discover/blog" },
      ],
    },
    {
      title: dict.footer.support,
      links: [
        { label: dict.footer.contactUs, href: "/contact" },
        { label: dict.footer.faqs, href: "/faqs" },
      ],
    },
    {
      title: dict.legal.eyebrow,
      links: [
        { label: dict.footer.privacyPolicy, href: "/privacy-policy" },
        { label: dict.footer.cookiesPolicy, href: "/cookies-policy" },
        { label: dict.footer.terms, href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-mhero-black text-white">
      <div className="container-mhero py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-[200px_repeat(5,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/mhero-logo.png"
              alt="MHERO"
              width={392}
              height={79}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-[170px] text-sm text-white/50">
              {dict.footer.tagline}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest2 text-white/60">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} MHERO. {dict.footer.rights}
          </p>
          <SocialIcons />
        </div>
      </div>
    </footer>
  );
}
