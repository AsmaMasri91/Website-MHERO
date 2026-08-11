"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const slideLinks = [
  {
    primaryHref: "/models/mhero-1",
    secondaryHref: "/models/test-drive",
  },
  {
    primaryHref: "/models/mhero-2",
    secondaryHref: "/models/test-drive",
  },
  {
    primaryHref: "/offers/0-percent-finance",
    secondaryHref: "/models/test-drive",
  },
  {
    primaryHref: "/after-sales",
    secondaryHref: "/models/test-drive",
  },
];

const SLIDE_DURATION = 6000;
const HERO_VIDEO_SRC = "/videos/hero-video.mp4";

export default function HeroSlider() {
  const { dict } = useLocale();
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const slides = dict.home.heroSlides.map((slide, i) => ({
    ...slide,
    primaryCta: {
      label: i === 2 ? dict.common.viewOffer : i === 3 ? dict.afterSales.title : dict.common.learnMore,
      href: slideLinks[i].primaryHref,
    },
    secondaryCta: { label: dict.common.bookTestDrive, href: slideLinks[i].secondaryHref },
  }));

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setCycle((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
    setCycle((c) => c + 1);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, cycle]);

  const slide = slides[index];

  return (
    <section
      className="relative h-[82vh] min-h-[500px] w-full overflow-hidden bg-mhero-black"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      {/* Full-width video background, shared across all slides */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

      <div className="container-mhero relative flex h-full flex-col justify-end pb-24 pt-32 md:justify-center md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-5 text-base text-white/70 md:text-lg">
              {slide.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={slide.primaryCta.href} className="btn-primary">
                {slide.primaryCta.label}
              </Link>
              <Link href={slide.secondaryCta.href} className="btn-outline-light">
                {slide.secondaryCta.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Circular loading indicators only — no arrows */}
      <div className="container-mhero absolute inset-x-0 bottom-8 flex items-center justify-start">
        <div className="flex items-center gap-4">
          {slides.map((s, i) => (
            <button
              key={s.title}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className="relative flex h-6 w-6 items-center justify-center"
            >
              <span className="absolute h-2 w-2 rounded-full bg-white/30" />
              {i === index && (
                <svg viewBox="0 0 24 24" className="absolute h-6 w-6 -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                  />
                  <circle
                    key={cycle}
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={62.8}
                    strokeDashoffset={62.8}
                    className="animate-[hero-ring_var(--hero-duration)_linear_forwards]"
                    style={{ ["--hero-duration" as string]: `${SLIDE_DURATION}ms` }}
                  />
                </svg>
              )}
              {i === index && <span className="absolute h-2 w-2 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
