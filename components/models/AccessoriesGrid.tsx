"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

// Photos supplied in the Figma design, keyed by accessory name.
const ACCESSORY_IMAGES: Record<string, string> = {
  "Roof-Mount Expedition Rack": "/images/models/accessory-roof-rack.webp",
  "2.5t Towing System": "/images/models/accessory-towing.webp",
  "Expansion Roof Platform": "/images/models/accessory-roof-platform.webp",
  "Expansion Roof Platform*": "/images/models/accessory-roof-platform.webp",
  "Side-Mounted Cargo Net": "/images/models/accessory-cargo-net.webp",
  "Electronic Winches": "/images/models/accessory-cargo-net.webp",
};

interface AccessoriesGridProps {
  accessories: string[];
  accessoriesTabLabel?: string;
  factoryOptionalEquipment?: string[];
  factoryOptionalEquipmentTabLabel?: string;
}

export default function AccessoriesGrid({
  accessories,
  accessoriesTabLabel = "Accessories",
  factoryOptionalEquipment,
  factoryOptionalEquipmentTabLabel = "Factory Optional Equipment",
}: AccessoriesGridProps) {
  const hasTabs = !!factoryOptionalEquipment && factoryOptionalEquipment.length > 0;
  const [active, setActive] = useState<"accessories" | "factory">("accessories");

  const items = active === "accessories" ? accessories : factoryOptionalEquipment ?? [];

  return (
    <div>
      {hasTabs && (
        <div className="mb-8 flex gap-8 border-b border-mhero-fog">
          <button
            onClick={() => setActive("accessories")}
            aria-current={active === "accessories"}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
              active === "accessories"
                ? "border-mhero-black text-mhero-black"
                : "border-transparent text-mhero-steel hover:text-mhero-black"
            }`}
          >
            {accessoriesTabLabel}
          </button>
          <button
            onClick={() => setActive("factory")}
            aria-current={active === "factory"}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
              active === "factory"
                ? "border-mhero-black text-mhero-black"
                : "border-transparent text-mhero-steel hover:text-mhero-black"
            }`}
          >
            {factoryOptionalEquipmentTabLabel}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {items.map((name) => (
          <div
            key={name}
            className="overflow-hidden border border-mhero-fog bg-white transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-md"
          >
            {ACCESSORY_IMAGES[name] ? (
              <div className="relative h-[232px] w-full">
                <Image src={ACCESSORY_IMAGES[name]} alt={name} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
            ) : (
              <PlaceholderImage label={name} aspect="aspect-auto h-[232px]" className="h-[232px]" tone="light" />
            )}
            <p className="p-6 text-lg font-bold leading-[1.35] text-mhero-black">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
