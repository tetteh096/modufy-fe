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

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-8 pt-28 sm:pb-12 sm:pt-32">
        <div className="container-site w-full">
          <FadeIn>
            <div className="mb-8 flex max-w-3xl flex-col gap-6">
              <HeroSlideCopy slide={activeSlide} />

              <HeroConfigBar />
            </div>
          </FadeIn>
        </div>

        <div className="container-site mt-10">
          <HeroSliderDots activeIndex={activeIndex} onIndexChange={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}

