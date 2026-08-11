import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import TestDriveForm from "@/components/forms/TestDriveForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Book a Test Drive",
  description: "Book a test drive for any MHERO model at your nearest showroom.",
};

export default function TestDrivePage() {
  const { dict } = getServerDictionary();

  const stats = [
    { title: dict.testDrive.privateSessionTitle, body: dict.testDrive.privateSessionBody },
    { title: dict.testDrive.preferredModelTitle, body: dict.testDrive.preferredModelBody },
    { title: dict.testDrive.showroomTitle, body: dict.testDrive.showroomBody },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.testDrive.eyebrow}
        title={dict.common.bookTestDrive}
        description={dict.testDrive.description}
        imageLabel="Book a MHERO test drive"
        backHref="/models"
        backLabel={dict.common.backToModels}
      />

      <div className="border-b border-mhero-fog bg-white">
        <div className="container-mhero grid gap-8 py-12 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={stat.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mhero-black text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-semibold text-mhero-black">{stat.title}</p>
                <p className="mt-1 text-sm text-mhero-steel">{stat.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Section light title={dict.testDrive.requestPrivateDrive} description={dict.testDrive.requestPrivateDriveDescription}>
        <div className="mx-auto max-w-3xl">
          <TestDriveForm />
        </div>
      </Section>
    </>
  );
}
