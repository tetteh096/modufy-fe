"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "customers",
    number: "01",
    title: "Add your first customers",
    blurb: "Import or create contacts: every sale starts from one shared book.",
    image: homeImages.pages.testimonials,
    imageAlt: "Small business owner getting started with Modufy",
  },
  {
    id: "catalog",
    number: "02",
    title: "Set up products and services",
    blurb: "One catalog for stock and bookable work, ready for POS and invoices.",
    image: homeImages.features.inventoryPhoto,
    imageAlt: "Inventory and product catalog in Modufy",
  },
  {
    id: "sell",
    number: "03",
    title: "Take your first sale",
    blurb: "Ring it up, send an invoice, or collect a deposit: books update live.",
    image: homeImages.features.payments,
    imageAlt: "Payments and till with Modufy",
  },
] as const;

export function BuildFastSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = STEPS[active];

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  return (
    <section className="relative overflow-hidden bg-[#111111] py-20 text-white sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(70,116,52,0.14),transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col justify-center">
            <FadeIn>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-leaf-green">
                From zero to first sale
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem]">
                Build fast on Modufy
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
                Go from empty account to first sale in three steps, then keep layering
                modules as you grow.
              </p>
            </FadeIn>
            <ol
              className="mt-10 space-y-1"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {STEPS.map((item, index) => {
                const isActive = index === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onFocus={() => {
                        setPaused(true);
                        setActive(index);
                      }}
                      className={cn(
                        "group relative w-full rounded-2xl border px-4 py-5 text-left transition sm:px-5",
                        isActive
                          ? "border-white/20 bg-white/[0.06]"
                          : "border-transparent hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-start gap-4 sm:gap-5">
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 text-sm font-bold tabular-nums",
                            isActive ? "text-brand-leaf-green" : "text-white/35"
                          )}
                        >
                          {item.number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-xl font-extrabold tracking-tight sm:text-2xl",
                              isActive ? "text-white" : "text-white/45"
                            )}
                          >
                            {item.title}
                          </p>
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.p
                                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                                className="overflow-hidden text-sm leading-relaxed text-white/50"
                              >
                                <span className="mt-1.5 block">{item.blurb}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {isActive && !reduceMotion && (
                        <span className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-white/10 sm:inset-x-5">
                          <motion.span
                            key={`${item.id}-progress`}
                            className="block h-full origin-left bg-brand-leaf-green"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 4.5, ease: "linear" }}
                          />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-brand-tangerine hover:text-white"
              >
                Take your shot
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="text-sm font-semibold text-white/50 transition hover:text-white"
              >
                Or book a live demo →
              </Link>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-[1.75rem] sm:min-h-[480px] lg:min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
                    Step {step.number}
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                    {step.title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
