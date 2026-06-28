"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionLabel } from "@/components/home/section-label";
import { FadeIn } from "@/components/ui/fade-in";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

const testimonialPhotos = [
  "/images/v1/t_user1.png",
  "/images/v1/t_user2.png",
  "/images/v1/t_user3.png",
] as const;

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const item = testimonials[active];

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-transparent to-[#faf8f5]">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative">
        <FadeIn className="mb-12 max-w-lg">
          <SectionLabel>Voices</SectionLabel>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Teams that switched,
            <span className="text-gradient-leaf mt-1"> stayed.</span>
          </h2>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <FadeIn className="relative lg:col-span-5 group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-secondary shadow-lg hover:shadow-xl transition-shadow duration-500">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={testimonialPhotos[active]}
                    alt={item.author}
                    fill
                    className="object-cover object-top transition duration-700 group-hover:scale-[1.03]"
                    sizes="40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/85 via-brand-sea-grey/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                <p className="font-semibold text-white text-lg">{item.author}</p>
                <p className="text-sm text-white/70 mt-0.5">{item.role}</p>
              </div>
            </div>
          </FadeIn>

          <div className="flex flex-col justify-between lg:col-span-7 py-4">
            <div className="flex flex-1 flex-col justify-center min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span className="font-display text-8xl leading-none text-brand-tangerine/20 absolute -top-10 -left-4 pointer-events-none">&ldquo;</span>
                  <blockquote className="relative z-10 max-w-2xl font-display italic font-semibold leading-relaxed text-brand-sea-grey/90 text-xl sm:text-2xl lg:text-[2.25rem]">
                    {item.quote}
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
              {testimonials.map((entry, index) => (
                <button
                  key={entry.author}
                  type="button"
                  aria-label={`Show testimonial from ${entry.author}`}
                  onClick={() => setActive(index)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-all duration-350",
                    index === active
                      ? "border-brand-leaf-green/20 bg-secondary/50 shadow-sm shadow-brand-leaf-green/5"
                      : "border-transparent hover:border-border/60 hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      index === active
                        ? "bg-brand-leaf-green text-white shadow-md shadow-brand-leaf-green/20 scale-105"
                        : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/15 group-hover:text-foreground"
                    )}
                  >
                    {entry.initials}
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-sm font-semibold">{entry.author}</span>
                    <span className="block text-xs text-muted-foreground">{entry.role}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

