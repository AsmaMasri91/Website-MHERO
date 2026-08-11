"use client";

import Image from "next/image";

const CARDS = [
  { src: "/images/heroes/heroes-h1.png", alt: "High-Tech — pioneering cutting-edge innovation" },
  { src: "/images/heroes/heroes-h2.png", alt: "Electric — state-of-the-art performance" },
  { src: "/images/heroes/heroes-h3.png", alt: "Revolution — setting new standards" },
  { src: "/images/heroes/heroes-h4.png", alt: "Off-Road — redefining adventure" },
];

export default function StackingHeroCards() {
  return (
    <section className="relative bg-mhero-black">
      {CARDS.map((card, i) => (
        <div
          key={card.src}
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          <div className="relative aspect-video w-full">
            <Image
              src={card.src}
              alt={card.alt}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
