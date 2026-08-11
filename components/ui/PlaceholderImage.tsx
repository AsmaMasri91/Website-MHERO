interface PlaceholderImageProps {
  label: string;
  className?: string;
  aspect?: string;
  tone?: "dark" | "light" | "accent";
  fit?: "cover" | "contain";
  showLabel?: boolean;
}

const tones = {
  dark: "from-mhero-graphite via-mhero-charcoal to-mhero-black text-white/40",
  light: "from-mhero-fog via-white to-mhero-fog text-mhero-black/30",
  accent: "from-mhero-accent-dark via-mhero-accent to-mhero-accent-light text-white/60",
};

const GALLERY_COUNT = 45;

function hashToIndex(label: string, count: number) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return (hash % count) + 1;
}

export default function PlaceholderImage({
  label,
  className = "",
  aspect = "aspect-[4/3]",
  tone = "dark",
  fit = "cover",
  showLabel = true,
}: PlaceholderImageProps) {
  const index = hashToIndex(label, GALLERY_COUNT);
  const src = `/images/gallery/mhero-photo-${String(index).padStart(2, "0")}.webp`;

  return (
    <div
      className={`relative flex ${aspect} w-full items-center justify-center overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        loading="lazy"
      />
      {showLabel && (
        <span className="absolute bottom-2 end-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}
