"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatCurrency } from "@/lib/financeMath";
import { VehicleModel } from "@/lib/types";
import { Dictionary } from "@/lib/i18n";

export default function ModelHero({
  model,
  dict,
}: {
  model: VehicleModel;
  dict: Dictionary;
}) {
  const d = model.detailPage;

  return (
    <section className="relative flex h-[88vh] min-h-[640px] items-end overflow-hidden bg-mhero-black">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 h-full w-full"
      >
        {model.heroImage ? (
          <Image
            src={model.heroImage}
            alt={model.heroImageLabel}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <PlaceholderImage
            label={model.heroImageLabel}
            aspect="aspect-auto"
            className="h-full w-full"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="container-mhero relative pb-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/models"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-white/70 hover:text-white"
          >
            <span aria-hidden="true" className="rtl:rotate-180">←</span>
            {dict.common.backToModels}
          </Link>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-2xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {d.heroHeadline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-4 max-w-xl text-white/70"
        >
          {d.heroSubcopy}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link href="/models/test-drive" className="btn-primary text-center">
            {dict.common.bookTestDrive}
          </Link>
          <Link
            href={`/models/finance-calculator?model=${model.slug}`}
            className="btn-outline-light text-center"
          >
            {dict.nav.calculateFinance}
          </Link>
          <Link href="/models/compare" className="btn-outline-light text-center">
            {dict.nav.compareModels}
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          className="mt-6 text-sm uppercase tracking-widest2 text-white/50"
        >
          {dict.common.startingFrom} {formatCurrency(model.startingPrice, model.currency)}
        </motion.p>
      </div>
    </section>
  );
}
