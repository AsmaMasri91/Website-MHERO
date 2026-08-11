import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function ChargingSection({
  label,
  body,
  imageLabel,
}: {
  label: string;
  body: string;
  imageLabel: string;
}) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl">
        <PlaceholderImage label={imageLabel} aspect="aspect-[21/9]" tone="dark" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute start-8 top-8">
          <h3 className="text-2xl font-bold text-white">{label}</h3>
        </div>
      </div>
      <p className="mt-6 max-w-2xl text-mhero-steel">{body}</p>
    </div>
  );
}
