"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { SectionLabel } from "@/components/home/section-label";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 22 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
      return;
    }
    // Fallback: animate to target value after 1.2s if scroll viewport intersection is delayed
    const timeout = setTimeout(() => {
      motionValue.set(value);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [inView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplay(Number.isInteger(value) ? Math.round(latest).toString() : latest.toFixed(1));
    });
  }, [spring, value]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5 sm:p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:-translate-y-1 shadow-lg shadow-black/10"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-tangerine to-transparent" />
      <p className="font-display text-5xl font-black tracking-tight text-brand-tangerine sm:text-6xl">
        {display}
        <span className="text-brand-leaf-green font-bold text-3xl sm:text-4xl ml-1">{suffix}</span>
      </p>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/60">{label}</p>
    </div>
  );
}

export function HomeStorySection() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-sea-grey text-white">
        <div className="texture-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-leaf-green/20 blur-[100px]" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-brand-tangerine/15 blur-[90px]" />

        <div className="container-site relative section-padding">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-5 lg:col-start-1">
              <SectionLabel light>Customer care</SectionLabel>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
                Every conversation,
                <span className="block text-gradient-tangerine leading-none mt-1">in context.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                Support teams see the full picture - orders, invoices, notes, and history - so
                replies feel personal, not scripted.
              </p>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <AnimatedStat value={99} suffix="%" label="Customer satisfaction across active teams" />
                <AnimatedStat value={3.5} suffix="x" label="Faster deal closure with unified CRM" />
              </div>
            </FadeIn>

            <FadeIn delay={0.12} direction="left" className="relative lg:col-span-7 group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/45">
                <Image
                  src={homeImages.story.support}
                  alt="Customer support professional helping a client"
                  fill
                  className="object-cover object-[50%_38%] transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
              </div>
              <div className="absolute -bottom-6 -left-4 max-w-[220px] rounded-2xl border border-white/15 bg-[#181818]/90 p-4 backdrop-blur-xl sm:-left-8 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="pulse-dot-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-tangerine">
                    Live now
                  </p>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-white/90">847 conversations handled today</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f0ebe3]">
        <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-site relative section-padding">
          <div className="grid items-center gap-14 lg:grid-cols-12">
            <FadeIn className="relative order-2 lg:order-1 lg:col-span-6">
              <div className="grid grid-cols-12 gap-3">
                <div className="relative col-span-8 aspect-[4/5] overflow-hidden rounded-[1.75rem] group/sales">
                  <Image
                    src={homeImages.story.salesTeam}
                    alt="Sales team collaborating in the office"
                    fill
                    className="object-cover object-[48%_35%] transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/sales:scale-[1.04]"
                    sizes="40vw"
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-3 pt-8">
                  <div className="relative aspect-square overflow-hidden rounded-[1.25rem] group/pipe">
                    <Image
                      src={homeImages.story.pipeline}
                      alt="Lead pipeline analytics on screen"
                      fill
                      className="object-cover transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/pipe:scale-[1.06]"
                      sizes="20vw"
                    />
                  </div>
                  <div className="rounded-[1.25rem] border border-brand-leaf-green/20 bg-white/90 p-5 shadow-[0_10px_30px_rgba(70,116,52,0.06)] hover:border-brand-leaf-green/30 transition-all duration-300">
                    <p className="font-display text-3xl font-black text-brand-leaf-green tracking-tight">12k+</p>
                    <p className="mt-1.5 text-[11px] font-medium leading-normal text-muted-foreground">
                      leads tracked this quarter
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
              <SectionLabel>Lead management</SectionLabel>
              <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
                One pipeline.
                <span className="block text-gradient-leaf mt-1">Zero spreadsheet chaos.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Capture leads from your site, email, and POS. Automate follow-ups, assign owners,
                and watch deals move - without switching tabs.
              </p>

              <ul className="mt-8 space-y-5 border-t border-border/80 pt-8">
                {[
                  "Team inbox with assignments and SLAs",
                  "Email campaigns tied to pipeline stages",
                  "Revenue forecasting from live deal data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-brand-sea-grey">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-tangerine" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="/demo" size="lg">
                  See it in action
                </Button>
                <Link
                  href="/modules"
                  className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-brand-leaf-green transition hover:text-brand-tangerine hover:translate-x-1 duration-300"
                >
                  Explore modules <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

