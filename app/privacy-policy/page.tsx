import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TabbedPolicy from "@/components/legal/TabbedPolicy";
import { privacyPolicyIntro, privacyPolicySections } from "@/data/privacy-policy";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MHERO collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  const { dict } = getServerDictionary();

  return (
    <>
      <PageHero compact title={dict.legal.privacy} image="/images/heroes/legal-hero.webp" imageLabel="MHERO legal" />
      <Section className="!py-20">
        <TabbedPolicy
          introTitle="Introduction"
          introBlocks={privacyPolicyIntro}
          sections={privacyPolicySections}
          contentsLabel="Table of Contents"
        />
      </Section>
    </>
  );
}
