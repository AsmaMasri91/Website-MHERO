import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { PolicySection } from "@/data/privacy-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "How MHERO uses cookies across this website.",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CookiesPolicyPage() {
  const { dict } = getServerDictionary();

  const sections: PolicySection[] = dict.legal.cookiesSections.map((s) => ({
    id: slugify(s.heading),
    title: s.heading,
    blocks: [{ type: "p", text: s.body }],
  }));

  return (
    <>
      <PageHero eyebrow={dict.legal.eyebrow} title={dict.legal.cookies} imageLabel="MHERO legal" />
      <Section>
        <TabbedPolicy
          introTitle="Introduction"
          introBlocks={[{ type: "p", text: dict.legal.cookiesIntro }]}
          sections={sections}
          contentsLabel="Table of Contents"
        />
      </Section>
    </>
  );
}
