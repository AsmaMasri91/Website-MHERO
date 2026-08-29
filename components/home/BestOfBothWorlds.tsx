"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { useLocale } from "@/components/i18n/LocaleProvider";

const carImages: Record<string, string> = {
  "mhero-1": "/images/best-of-both-mhero-1.webp",
  "mhero-2": "/images/models/mhero-2-best-of-both.webp",
};

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-[#d9d9d9] text-mhero-black" : "text-white hover:text-white/80"
      }`}
      style={{
        borderBottom: active ? "2px solid #8fb5a6" : "2px solid rgba(143,181,166,0.5)",
      }}
    >
      {children}
    </button>
  );
}

export default function BestOfBothWorlds() {
  const { dict } = useLocale();
  const [carIndex, setCarIndex] = useState(0);
  const [specIndex, setSpecIndex] = useState(0);

  const cars = [
    {
      slug: "mhero-1",
      name: "MHERO I",
      specs: [
        { label: dict.home.bestOfBoth.maxPower, value: "805 HP" },
        { label: dict.home.bestOfBoth.combinedRange, value: "834 KM" },
        { label: dict.home.bestOfBoth.torque, value: "1,050 NM" },
      ],
    },
    {
      slug: "mhero-2",
      name: "MHERO II",
      specs: [
        { label: dict.home.bestOfBoth.maxPower, value: "677 HP" },
        { label: dict.home.bestOfBoth.combinedRange, value: "1,300 KM" },
        { label: dict.home.bestOfBoth.torque, value: "848 NM" },
      ],
    },
  ];

  const car = cars[carIndex];
  const spec = car.specs[specIndex];

  return (
    <Section
      light={false}
      eyebrow={dict.home.rangeEyebrow}
      title={dict.home.bestOfBothTitle}
      className="!py-8 md:!py-10"
    >
      {/* Car select */}
      <div className="flex justify-center gap-1">
        {cars.map((c, i) => (
          <TabButton
            key={c.slug}
            active={i === carIndex}
            onClick={() => {
              setCarIndex(i);
              setSpecIndex(0);
            }}
          >
            {c.name}
          </TabButton>
        ))}
      </div>

      {/* Car image with highlighted spec callout */}
      <Link
        href={`/models/${car.slug}`}
        className="group relative mt-6 block overflow-hidden border border-white/10"
      >
        <div className="relative aspect-[24/9] w-full overflow-hidden bg-mhero-charcoal">
          <AnimatePresence mode="wait">
            <motion.div
              key={car.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={carImages[car.slug]}
                alt={car.name}
                fill
                className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/0 to-black/10" />
          <div className="absolute inset-x-0 top-6 flex justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${car.slug}-${spec.label}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest2 text-white/70">
                  {spec.label}
                </p>
                <p className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
                  {spec.value}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Link>

      {/* Spec select */}
      <div className="mt-4 flex justify-center gap-1">
        {car.specs.map((s, i) => (
          <TabButton key={s.label} active={i === specIndex} onClick={() => setSpecIndex(i)}>
            {s.label}
          </TabButton>
        ))}
      </div>
    </Section>
  );
}
