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
      className="relative -mt-[5.75rem] px-3 pb-3 pt-3 sm:-mt-[6.25rem] sm:px-4 sm:pb-4 sm:pt-4"
    >
      <div className="relative isolate min-h-[calc(100svh-0.75rem)] overflow-hidden rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:min-h-[calc(100svh-1rem)] sm:rounded-[2.5rem] lg:rounded-[3rem]">
        <HeroSliderBackground activeIndex={activeIndex} />
        <div className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-white/10" />

        <div className="relative z-10 flex min-h-[calc(100svh-0.75rem)] flex-col justify-end pb-8 pt-28 sm:min-h-[calc(100svh-1rem)] sm:pb-10 sm:pt-32">
          <div className="container-site w-full">
            <FadeIn className="max-w-3xl">
              <div className="mb-2 flex flex-col gap-5">
                <HeroSlideCopy slide={activeSlide} />
                <p className="max-w-md text-base leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-lg">
                  Customers, invoices, stock, and bookings, one place for teams that are done
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
      </div>
    </section>
  );
}
