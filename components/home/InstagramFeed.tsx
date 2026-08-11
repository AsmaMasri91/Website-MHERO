"use client";

import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

const tiles = Array.from({ length: 6 }, (_, i) => `Instagram post ${i + 1}`);

export default function InstagramFeed() {
  const { dict } = useLocale();

  return (
    <Section
      eyebrow={dict.home.instagramEyebrow}
      title={dict.home.instagramTitle}
      description={dict.home.instagramDescription}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {tiles.map((label) => (
          <a
            key={label}
            href="https://instagram.com/mherouae/"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl"
          >
            <PlaceholderImage
              label={label}
              aspect="aspect-square"
              className="transition-transform duration-500 hover:scale-110"
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
