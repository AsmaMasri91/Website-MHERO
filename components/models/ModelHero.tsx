"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
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
    <section className="relative flex h-[88vh] min-h-[640px] items-end overflow-hidden bg-mhero-black md:h-[800px]">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/85" />

      <div className="container-mhero relative pb-24 text-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Breadcrumbs current={model.name} />
        </motion.div>
        {model.powertrain && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mb-5 inline-flex items-stretch border border-white"
          >
            <span className="bg-mhero-primary px-3 py-2 text-xs font-semibold uppercase tracking-[3px] text-mhero-black">
              {model.powertrain}
            </span>
            <span className="px-4 py-2 text-sm text-white">
              {dict.models.powertrainNames[model.powertrain]}
            </span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="max-w-[900px] text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          {d.heroHeadline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="mt-5 max-w-[680px] text-lg leading-[1.6] text-white"
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
          className="mt-5 text-xs font-semibold uppercase tracking-[3px] text-white"
        >
          {dict.common.startingFrom} {formatCurrency(model.startingPrice, model.currency)}
        </motion.p>
      </div>
    </section>
  );
}
