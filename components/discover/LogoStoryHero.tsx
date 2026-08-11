"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LogoStoryHero({
  headlineLine1,
  headlineLine2,
  body,
}: {
  headlineLine1: string;
  headlineLine2: string;
  body: string;
}) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-mhero-black text-white">
      <div className="absolute inset-0">
        <PlaceholderImage
          label="MHERO off-road silhouette against mountain skyline"
          aspect="aspect-auto"
          className="h-full w-full"
          showLabel={false}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

      <div className="container-mhero relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="flex items-center gap-8 md:gap-10"
        >
          <div className="relative h-16 w-16 md:h-24 md:w-24">
            <Image
              src="/images/about-logo-statue.png"
              alt="MHERO heritage emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative h-12 w-12 md:h-16 md:w-16">
            <Image
              src="/images/about-logo-m.png"
              alt="MHERO M mark"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-10 text-3xl font-bold leading-tight tracking-tight md:text-5xl"
        >
          <span className="block font-extrabold">{headlineLine1}</span>
          <span className="block font-normal">{headlineLine2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
          className="mx-auto mt-8 max-w-2xl text-base text-white/70 md:text-lg"
        >
          {body}
        </motion.p>
      </div>
    </section>
  );
}
