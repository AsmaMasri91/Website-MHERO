"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { CabinTab } from "@/lib/types";

export default function CabinTabs({ tabs, image }: { tabs: CabinTab[]; image?: string }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
      {/* Vertical pill tabs */}
      <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={`shrink-0 px-5 py-3 text-start text-sm font-semibold transition-colors ${
              i === active
                ? "bg-white text-mhero-black"
                : "bg-mhero-graphite text-white hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Image with overlaid caption */}
      <div className="relative h-[560px] overflow-hidden">
        {image && active === 0 ? (
          <Image src={image} alt={tab.imageLabel} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover" />
        ) : (
          <PlaceholderImage label={tab.imageLabel} aspect="aspect-auto h-full" className="h-full" showLabel={false} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85" />
        <div className="absolute inset-x-0 bottom-0 p-8">
          <h3 className="text-2xl font-bold leading-[1.3] text-white">{tab.heading}</h3>
          <p className="mt-2 max-w-xl text-white/80">{tab.body}</p>
        </div>
      </div>
    </div>
  );
}
