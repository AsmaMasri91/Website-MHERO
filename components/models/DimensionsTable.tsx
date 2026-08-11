import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { DimensionRow } from "@/lib/types";

export default function DimensionsTable({
  rows,
  diagramLabel,
}: {
  rows: DimensionRow[];
  diagramLabel: string;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <dl className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-mhero-fog pb-3 text-sm"
          >
            <dt className="flex items-center gap-3 text-mhero-steel">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-mhero-fog text-xs text-mhero-steel">
                {i + 1}
              </span>
              {row.label}
            </dt>
            <dd className="font-semibold text-mhero-black">{row.value}</dd>
          </div>
        ))}
      </dl>
      <PlaceholderImage label={diagramLabel} aspect="aspect-[16/9]" tone="light" className="rounded-2xl" />
    </div>
  );
}
