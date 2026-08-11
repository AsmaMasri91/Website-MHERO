import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { PolicySection } from "@/data/privacy-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the MHERO website.",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function TermsPage() {
  const { dict } = getServerDictionary();

  const sections: PolicySection[] = dict.legal.termsSections.map((s) => ({
    id: slugify(s.heading),
    title: s.heading,
    blocks: [{ type: "p", text: s.body }],
  }));

  return (
    <>
      <PageHero eyebrow={dict.legal.eyebrow} title={dict.legal.terms} imageLabel="MHERO legal" />
      <Section>
        <TabbedPolicy
          introTitle="Introduction"
          introBlocks={[{ type: "p", text: dict.legal.termsIntro }]}
          sections={sections}
          contentsLabel="Table of Contents"
        />
      </Section>
    </>
  );
}
