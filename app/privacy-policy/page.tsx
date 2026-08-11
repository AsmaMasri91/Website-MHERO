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
      <PageHero eyebrow={dict.legal.eyebrow} title={dict.legal.privacy} imageLabel="MHERO legal" />
      <Section>
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
