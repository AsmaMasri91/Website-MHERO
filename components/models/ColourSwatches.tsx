"use client";

import { useState } from "react";
import { ModelColour } from "@/lib/types";
import Spin360Viewer from "@/components/models/Spin360Viewer";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function ColourSwatches({
  exteriorColours,
  interiorColours,
  modelName,
}: {
  exteriorColours: ModelColour[];
  interiorColours: ModelColour[];
  modelName: string;
}) {
  const { dict } = useLocale();
  const [tab, setTab] = useState<"exterior" | "interior">("exterior");
  const [active, setActive] = useState(0);

  const colours = tab === "exterior" ? exteriorColours : interiorColours;
  const colour = colours[active];

  const selectTab = (next: "exterior" | "interior") => {
    setTab(next);
    setActive(0);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex gap-8 border-b border-mhero-fog">
        <button
          type="button"
          onClick={() => selectTab("exterior")}
          aria-current={tab === "exterior"}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            tab === "exterior"
              ? "border-mhero-black text-mhero-black"
              : "border-transparent text-mhero-steel hover:text-mhero-black"
          }`}
        >
          {dict.models.exterior}
        </button>
        <button
          type="button"
          onClick={() => selectTab("interior")}
          aria-current={tab === "interior"}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            tab === "interior"
              ? "border-mhero-black text-mhero-black"
              : "border-transparent text-mhero-steel hover:text-mhero-black"
          }`}
        >
          {dict.models.interior}
        </button>
      </div>

      <Spin360Viewer
        frames={colour.image ? [colour.image] : []}
        alt={`${modelName} in ${colour.name}`}
        overlay={
          <div className="flex flex-wrap justify-center gap-3">
            {colours.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-1"
                aria-label={`Select colour ${c.name}`}
                aria-current={i === active}
              >
                <span
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    i === active ? "border-mhero-black scale-110" : "border-white/60"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-medium text-mhero-black">{c.name}</span>
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
