"use client";

import { useState } from "react";
import { HeroConfigBar } from "@/components/home/hero-config-bar";
import {
  HERO_SLIDES,
  HeroSlideCopy,
  HeroSliderBackground,
  HeroSliderDots,
} from "@/components/home/hero-slider";
import { FadeIn } from "@/components/ui/fade-in";

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = HERO_SLIDES[activeIndex] ?? HERO_SLIDES[0];

  return (
    <section
      data-hero-section
      className="relative -mt-[5.75rem] min-h-[100svh] overflow-hidden sm:-mt-[6.25rem]"
    >
      <HeroSliderBackground activeIndex={activeIndex} />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-28 sm:pb-10 sm:pt-32">
        <div className="container-site w-full">
          <FadeIn className="max-w-3xl">
            <div className="mb-2 flex flex-col gap-5">
              <HeroSlideCopy slide={activeSlide} />
              <p className="max-w-md text-base leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-lg">
                Customers, invoices, stock, and bookings — one place for teams that are done
                juggling apps.
              </p>
              <HeroConfigBar />
            </div>
          </FadeIn>
        </div>

        <div className="container-site mt-6 sm:mt-8">
          <HeroSliderDots activeIndex={activeIndex} onIndexChange={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}
