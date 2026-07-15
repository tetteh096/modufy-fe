"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

const LEAD = "Run your business wherever customers show up.";

const PHRASES = [
  "In the store and online.",
  "From quick sales to invoices.",
  "Across stock, bookings, and campaigns.",
] as const;

const CARDS = [
  {
    id: "storefront",
    src: "/landingscroll/53943ad415abb803677a602049fad915.jpg",
    alt: "Modufy storefront and orders",
    width: "w-[280px] sm:w-[320px]",
    aspect: "aspect-[3/4]",
  },
  {
    id: "mobile",
    src: "/landingscroll/e55a842eae7770fbeafd3c7b8bf77bd8.jpg",
    alt: "Modufy on mobile",
    width: "w-[220px] sm:w-[250px]",
    aspect: "aspect-[9/16]",
  },
  {
    id: "counter",
    src: "/landingscroll/455ebfe512bd2626ec612ba0f4cde91a.jpg",
    alt: "Payments and till with Modufy",
    width: "w-[340px] sm:w-[480px] lg:w-[560px]",
    aspect: "aspect-[16/10]",
  },
  {
    id: "inventory",
    src: "/landingscroll/5ca5ffebf0e47d6c18cec6d901a8d03e.jpg",
    alt: "Inventory managed in Modufy",
    width: "w-[260px] sm:w-[300px]",
    aspect: "aspect-[4/5]",
  },
  {
    id: "dashboard",
    src: "/landingscroll/0496355a839d1cd0a865861fd6ae4436.jpg",
    alt: "Modufy dashboard across devices",
    width: "w-[320px] sm:w-[420px]",
    aspect: "aspect-[16/11]",
  },
  {
    id: "marketing",
    src: "/landingscroll/5f29e23149927d8060af7af350cc337f.jpg",
    alt: "Marketing campaigns in Modufy",
    width: "w-[240px] sm:w-[280px]",
    aspect: "aspect-[3/4]",
  },
  {
    id: "team",
    src: "/landingscroll/fecb92032e1d7cd3d19787aecf4a1566.jpg",
    alt: "Team collaborating with Modufy",
    width: "w-[300px] sm:w-[380px]",
    aspect: "aspect-[5/4]",
  },
] as const;

export function SellEverywhereSection() {
  const reduceMotion = useReducedMotion();
  const [activePhrase, setActivePhrase] = useState(0);
  const [hoveredPhrase, setHoveredPhrase] = useState<number | null>(null);
  const [queue, setQueue] = useState(() => [...CARDS]);
  const [paused, setPaused] = useState(false);
  const busyRef = useRef(false);

  const rotate = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setQueue((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
    window.setTimeout(() => {
      busyRef.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    if (reduceMotion || hoveredPhrase !== null) return;
    const id = window.setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion, hoveredPhrase]);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(rotate, 3000);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, rotate]);

  const highlightIndex = hoveredPhrase ?? activePhrase;

  return (
    <section className="relative overflow-hidden bg-[#121212] py-16 text-white sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(70,116,52,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
        <FadeIn className="max-w-4xl">
          <h2 className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            <span className="text-white">{LEAD}</span>{" "}
            {PHRASES.map((phrase, index) => {
              const active = highlightIndex === index;
              return (
                <motion.button
                  key={phrase}
                  type="button"
                  onMouseEnter={() => setHoveredPhrase(index)}
                  onMouseLeave={() => setHoveredPhrase(null)}
                  onFocus={() => setHoveredPhrase(index)}
                  onBlur={() => setHoveredPhrase(null)}
                  onClick={() => setActivePhrase(index)}
                  className={cn(
                    "mr-[0.35em] inline-block origin-left text-left transition-[color,transform] duration-500 ease-out",
                    active ? "text-brand-tangerine" : "text-white/40 hover:text-white/70"
                  )}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: active ? 10 : 0,
                          opacity: active ? 1 : 0.45,
                        }
                  }
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {phrase}
                </motion.button>
              );
            })}
          </h2>
        </FadeIn>
      </div>

      <FadeIn delay={0.1} className="relative mt-10 sm:mt-14">
        <div
          className="overflow-hidden px-4 sm:px-6 lg:px-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {queue.map((card, index) => (
              <motion.article
                key={card.id}
                layout={!reduceMotion}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 320,
                    damping: 34,
                    mass: 0.8,
                  },
                }}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-[1.35rem] bg-[#1c1c1c] sm:rounded-[1.6rem]",
                  card.width,
                  card.aspect,
                  index === 0 && "ring-2 ring-brand-tangerine/40"
                )}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 70vw"
                  priority={index < 2}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
              </motion.article>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
