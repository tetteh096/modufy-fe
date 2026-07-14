"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { DashboardPreview } from "@/components/home/dashboard-preview";
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
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
            <FadeIn className="lg:col-span-6">
              <div className="mb-6 flex max-w-3xl flex-col gap-6">
                <HeroSlideCopy slide={activeSlide} />

                <div className="flex flex-wrap gap-2 text-xs font-semibold text-white/80">
                  {["CRM", "Invoicing", "Inventory", "Bookings"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-xl"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-tangerine" />
                      {item}
                    </span>
                  ))}
                </div>

                <HeroConfigBar />
              </div>
            </FadeIn>

            <FadeIn delay={0.12} direction="left" className="hidden lg:col-span-6 lg:block">
              <div className="relative ml-auto max-w-[620px]">
                <DashboardPreview className="rotate-[1.5deg]" />
                <div className="absolute -left-8 top-10 w-48 rounded-2xl border border-white/15 bg-white/12 p-4 text-white shadow-2xl shadow-black/25 backdrop-blur-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
                    Live modules
                  </p>
                  <div className="mt-3 space-y-2">
                    {["Sales synced", "Stock updated", "Tax ready"].map((item) => (
                      <div key={item} className="flex items-center justify-between text-xs font-semibold">
                        <span>{item}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/55" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-5 right-10 rounded-2xl border border-white/15 bg-[#fdfbf8]/95 px-5 py-4 text-brand-sea-grey shadow-2xl shadow-black/25">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    This month
                  </p>
                  <p className="mt-1 font-display text-3xl font-black tracking-tight">$128k</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.16} className="mt-4 lg:hidden">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-2xl">
              <DashboardPreview variant="compact" />
            </div>
          </FadeIn>
        </div>

        <div className="container-site mt-8">
          <HeroSliderDots activeIndex={activeIndex} onIndexChange={setActiveIndex} />
        </div>
      </div>
    </section>
  );
}

