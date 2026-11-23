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
    <div className="mx-auto max-w-6xl">
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
          <div className="flex flex-wrap justify-center gap-6">
            {colours.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-1"
                aria-label={`Select colour ${c.name}`}
                aria-current={i === active}
              >
                <span
                  className={`h-11 w-11 rounded-full transition-all ${
                    i === active ? "scale-110 ring-2 ring-mhero-black ring-offset-2" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    backgroundImage:
                      "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 42%), radial-gradient(circle at 72% 78%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 58%)",
                    boxShadow:
                      "0 6px 10px rgba(0,0,0,0.35), inset 0 -4px 6px rgba(0,0,0,0.35), inset 0 3px 4px rgba(255,255,255,0.55)",
                  }}
                />
                <span className="text-xs font-medium text-mhero-black">{c.name}</span>
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}
