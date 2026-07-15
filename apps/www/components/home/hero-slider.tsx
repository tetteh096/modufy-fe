"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { homeImages } from "@/lib/home-images";

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow: string;
  headline: [string, string];
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    image: homeImages.hero.teamMeeting,
    alt: "Modufy team reviewing live business dashboards together",
    eyebrow: "Business management for growing teams",
    headline: ["Run it all.", "In one place."],
  },
  {
    image: homeImages.hero.systemsConnected,
    alt: "Operator connecting payments, orders, and accounting in Modufy",
    eyebrow: "Sales, ops, and finance connected",
    headline: ["One platform.", "Every module."],
  },
  {
    image: homeImages.hero.retailModules,
    alt: "Retailer managing inventory, invoices, and bookings on Modufy",
    eyebrow: "Inventory, invoices, and bookings",
    headline: ["Built in pieces.", "Runs as one."],
  },
];

const AUTOPLAY_MS = 6500;

type HeroSliderProps = {
  slides?: HeroSlide[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
};

export function HeroSliderBackground({
  slides = HERO_SLIDES,
  activeIndex,
}: Pick<HeroSliderProps, "slides" | "activeIndex">) {
  const slide = slides[activeIndex] ?? slides[0];

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={activeIndex === 0}
            className="object-cover object-center brightness-[1.08] contrast-[1.04] saturate-[1.05]"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
    </div>
  );
}

export function HeroSliderDots({
  slides = HERO_SLIDES,
  activeIndex,
  onIndexChange,
  autoplay = true,
}: HeroSliderProps & { autoplay?: boolean }) {
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (index: number) => {
      onIndexChange((index + count) % count);
    },
    [count, onIndexChange]
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (!autoplay || paused || count <= 1) return;

    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, count, next]);

  return (
    <div
      className="mx-auto flex h-14 max-w-3xl items-center justify-center gap-4 rounded-full border border-white/20 bg-white/10 px-5 backdrop-blur-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="tablist"
      aria-label="Hero slides"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={slide.image}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${index + 1}: ${slide.headline.join(" ")}`}
            onClick={() => goTo(index)}
            className="relative h-6 flex items-center justify-center transition-all focus:outline-none"
            style={{ width: isActive ? "2.5rem" : "0.625rem" }}
          >
            {isActive ? (
              <motion.div
                layoutId="active-dot"
                className="h-2.5 w-10 rounded-full bg-brand-tangerine shadow-[0_0_16px_rgba(245,143,32,0.65)]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            ) : (
              <div className="h-2.5 w-2.5 rounded-full bg-white/35 hover:bg-white/60 transition-colors" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function HeroSlideCopy({
  slide,
}: {
  slide: HeroSlide;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.image}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-tangerine drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-sm">
          {slide.eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.5rem] drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
          <span className="block text-white">{slide.headline[0]}</span>
          <span className="block text-gradient-tangerine leading-none">{slide.headline[1]}</span>
        </h1>
      </motion.div>
    </AnimatePresence>
  );
}

