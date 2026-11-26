import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TestDriveForm from "@/components/forms/TestDriveForm";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Book a Test Drive",
  description: "Book a test drive for any MHERO model at your nearest showroom.",
};

export default function TestDrivePage() {
  const { dict } = getServerDictionary();

  const steps = [
    { title: dict.testDrive.privateSessionTitle, body: dict.testDrive.privateSessionBody },
    { title: dict.testDrive.preferredModelTitle, body: dict.testDrive.preferredModelBody },
    { title: dict.testDrive.showroomTitle, body: dict.testDrive.showroomBody },
  ];

  return (
    <>
      <PageHero
        compact
        title={dict.common.bookTestDrive}
        description={dict.testDrive.description}
        image="/images/heroes/test-drive-hero.webp"
        imageLabel="Book a MHERO test drive"
      />

      <div className="border-b border-mhero-fog bg-white">
        <div className="container-mhero grid gap-12 py-12 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="bg-mhero-black px-2 py-1 text-[11px] font-medium uppercase leading-[1.4] tracking-widest2 text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-[1.4] text-mhero-black">{step.title}</p>
              </div>
              <p className="text-sm text-mhero-steel">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <section data-tone="light" className="section-y bg-white">
        <div className="container-mhero">
          <TestDriveForm />
        </div>
      </section>
    </>
  );
}
