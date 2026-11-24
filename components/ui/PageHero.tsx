"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function PageHero({
  title,
  description,
  imageLabel,
  image,
  aside,
  compact,
  tall,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  imageLabel: string;
  image?: string;
  aside?: ReactNode;
  /** Figma "Hero/Page" layout: 560px visible below the header, photo fills with object-cover. */
  compact?: boolean;
  /** Figma Offers hero: 760px below the header with the form aside. */
  tall?: boolean;
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-mhero-black ${tall ? "min-h-[840px]" : compact ? "min-h-[640px]" : "min-h-[88vh]"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full"
      >
        {image ? (
          <div className="relative h-full w-full bg-mhero-black">
            <Image
              src={image}
              alt={imageLabel}
              fill
              className={compact || tall ? "object-cover" : "object-contain"}
              priority
            />
          </div>
        ) : (
          <PlaceholderImage label={imageLabel} aspect="aspect-auto" className="h-full w-full" />
        )}
      </motion.div>
      {tall ? (
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/[0.15]" />
      ) : compact ? (
        <div className="absolute inset-0 bg-gradient-to-r from-black/[0.78] to-black/10" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        </>
      )}

      <div
        className={`container-mhero relative text-white ${compact && !tall ? "pb-[72px]" : "pb-20"} ${
          aside ? "grid items-end gap-10 pt-32 lg:grid-cols-[1fr_440px] lg:gap-16" : ""
        }`}
      >
        <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Breadcrumbs current={title} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-3xl text-start text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className={`mt-4 ${compact || tall ? "max-w-[640px] text-lg text-white" : "max-w-xl text-white/70"}`}
          >
            {description}
          </motion.p>
        )}
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
