"use client";

import { useState } from "react";
import { ModelColour } from "@/lib/types";
import Spin360Viewer from "@/components/models/Spin360Viewer";

export default function ColourSwatches({
  colours,
  modelName,
}: {
  colours: ModelColour[];
  modelName: string;
}) {
  const [active, setActive] = useState(0);
  const colour = colours[active];

  return (
    <div>
      <Spin360Viewer
        key={colour.name}
        frames={colour.image ? [colour.image] : []}
        alt={`${modelName} in ${colour.name}`}
      />
      <div className="mt-6 flex flex-wrap gap-4">
        {colours.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setActive(i)}
            className="flex flex-col items-center gap-2"
            aria-label={`Select colour ${c.name}`}
            aria-current={i === active}
          >
            <span
              className={`h-10 w-10 rounded-full border-2 transition-all ${
                i === active ? "border-mhero-black scale-110" : "border-mhero-fog"
              }`}
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-xs text-mhero-steel">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
