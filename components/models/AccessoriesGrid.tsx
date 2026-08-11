"use client";

import { useState } from "react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((name) => (
          <div
            key={name}
            className="overflow-hidden rounded-2xl border border-mhero-fog bg-white shadow-sm transition-all duration-500 ease-premium hover:-translate-y-1 hover:shadow-md"
          >
            <PlaceholderImage label={name} aspect="aspect-square" tone="light" />
            <p className="p-4 text-sm font-medium text-mhero-black">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
