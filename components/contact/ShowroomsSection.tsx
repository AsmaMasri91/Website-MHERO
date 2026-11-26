"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

type LocationType = "showroom" | "service";
type Filter = "all" | LocationType;

// Map positions taken from the Google Maps listings.
const LOCATIONS = [
  { id: "abuDhabi", type: "showroom", coords: "24.4917471,54.357316", image: "/images/al-ghurair-showroom.png" },
  { id: "dubai", type: "showroom", coords: "25.2570309,55.3329931", image: "/images/al-ghurair-showroom.png" },
  { id: "alQuoz", type: "service", coords: "25.1360183,55.2422688", image: "/images/models/service-maintenance.webp" },
] as const;

const FILTERS: Filter[] = ["all", "showroom", "service"];

const PHONE_HREF = "tel:80064370"; // 800 MHER0

export default function ShowroomsSection() {
  const { dict } = useLocale();
  const t = dict.showrooms;
  const [filter, setFilter] = useState<Filter>("all");
  const visible = LOCATIONS.filter((location) => filter === "all" || location.type === filter);

  return (
    <Section id="showrooms" tone="tint" className="!bg-mhero-white">
      <div className="mb-8 flex max-w-2xl flex-col gap-4 md:mb-10">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{t.title}</h2>
        <p className="text-base text-mhero-steel md:text-lg">
          {t.description} {t.callPrefix}{" "}
          <a href={PHONE_HREF} className="link-underline whitespace-nowrap font-semibold text-mhero-black">
            <bdi>{dict.contact.phoneValue}</bdi>
          </a>
          .
        </p>
      </div>

      <div role="group" aria-label={t.filterLabel} className="mb-8 flex flex-wrap gap-2 md:mb-10">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className={`border px-5 py-3 text-xs font-semibold uppercase leading-[1.4] tracking-[2px] transition-colors ${
              filter === option
                ? "border-mhero-black bg-mhero-black text-white"
                : "border-mhero-fog bg-white text-mhero-black hover:border-mhero-black"
            }`}
          >
            {t.filters[option]}
          </button>
        ))}
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((location) => {
          const { name, address, hours } = t.locations[location.id];
          return (
            <li key={location.id} className="flex flex-col border border-mhero-fog bg-white">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={location.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col items-start gap-2 p-6">
                <span
                  className={`mb-1 px-3 py-1.5 text-[11px] font-semibold uppercase leading-[1.4] tracking-[2px] ${
                    location.type === "service" ? "bg-mhero-black text-white" : "bg-mhero-primary text-mhero-black"
                  }`}
                >
                  {t.types[location.type]}
                </span>
                <h3 className="text-lg font-bold leading-[1.35]">{name}</h3>
                <p className="text-sm text-mhero-steel">{address}</p>
                <p className="mb-auto text-xs font-medium uppercase leading-[1.6] tracking-[2px] text-mhero-steel">
                  {hours}
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.coords}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.getDirections}: ${name}`}
                  className="link-underline mt-6 text-xs font-semibold uppercase tracking-[2px] text-mhero-black"
                >
                  {t.getDirections} <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
