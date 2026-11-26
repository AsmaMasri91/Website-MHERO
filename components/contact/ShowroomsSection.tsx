import Image from "next/image";
import Section from "@/components/ui/Section";
import type { Dictionary } from "@/lib/i18n";

// Map positions taken from the two Google Maps listings.
const LOCATIONS = [
  { id: "abuDhabi", coords: "24.4917471,54.357316" },
  { id: "dubai", coords: "25.2570309,55.3329931" },
] as const;

const PHONE_HREF = "tel:80064376"; // 800 MHERO

function MapLink({ href, label, name }: { href: string; label: string; name: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${name}`}
      className="link-underline text-xs font-semibold uppercase tracking-[2px] text-mhero-black"
    >
      {label} <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
    </a>
  );
}

export default function ShowroomsSection({ dict }: { dict: Dictionary }) {
  const t = dict.showrooms;

  return (
    <Section id="showrooms" tone="tint" className="!bg-mhero-white">
      <div className="mb-12 flex max-w-2xl flex-col gap-4 md:mb-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{t.title}</h2>
        <p className="text-base text-mhero-steel md:text-lg">
          {t.description} {t.callPrefix}{" "}
          <a href={PHONE_HREF} className="link-underline font-semibold text-mhero-black">
            <bdi>{dict.contact.phoneValue}</bdi>
          </a>
          .
        </p>
      </div>

      <ul className="grid gap-6 md:grid-cols-2">
        {LOCATIONS.map((location) => {
          const { name, address } = t.locations[location.id];
          return (
            <li key={location.id} className="flex flex-col border border-mhero-fog bg-white">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src="/images/al-ghurair-showroom.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h3 className="text-lg font-bold leading-[1.35]">{name}</h3>
                <p className="text-sm text-mhero-steel">{address}</p>
                <p className="mb-auto text-xs font-medium uppercase leading-[1.6] tracking-[2px] text-mhero-steel">
                  {t.hours}
                </p>
                <div className="mt-6">
                  <MapLink
                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.coords}`}
                    label={t.getDirections}
                    name={name}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
