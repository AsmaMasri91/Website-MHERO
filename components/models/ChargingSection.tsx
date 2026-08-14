import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function ChargingSection({
  body,
  imageLabel,
}: {
  body: string;
  imageLabel: string;
}) {
  return (
    <div>
      <p className="max-w-2xl text-mhero-steel">{body}</p>
      <div className="relative mt-8 overflow-hidden rounded-2xl">
        <PlaceholderImage label={imageLabel} aspect="aspect-[21/9]" tone="dark" />
      </div>
    </div>
  );
}
