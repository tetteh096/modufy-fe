"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";
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
    src: homeImages.features.orders,
    alt: "Modufy storefront and orders",
    width: "w-[280px] sm:w-[320px]",
    aspect: "aspect-[3/4]",
  },
  {
    id: "mobile",
    src: homeImages.features.mobile,
    alt: "Modufy on mobile",
    width: "w-[220px] sm:w-[250px]",
    aspect: "aspect-[9/16]",
  },
  {
    id: "counter",
    src: homeImages.features.payments,
    alt: "Payments and till with Modufy",
    width: "w-[340px] sm:w-[480px] lg:w-[560px]",
    aspect: "aspect-[16/10]",
  },
  {
    id: "inventory",
    src: homeImages.features.inventoryPhoto,
    alt: "Inventory managed in Modufy",
    width: "w-[260px] sm:w-[300px]",
    aspect: "aspect-[4/5]",
  },
  {
    id: "dashboard",
    src: homeImages.hero.dashboardDevices,
    alt: "Modufy dashboard across devices",
    width: "w-[320px] sm:w-[420px]",
    aspect: "aspect-[16/11]",
  },
  {
    id: "marketing",
    src: homeImages.features.marketing,
    alt: "Marketing campaigns in Modufy",
    width: "w-[240px] sm:w-[280px]",
    aspect: "aspect-[3/4]",
  },
  {
    id: "team",
    src: homeImages.story.salesTeam,
    alt: "Team collaborating with Modufy",
    width: "w-[300px] sm:w-[380px]",
    aspect: "aspect-[5/4]",
  },
] as const;

export function SellEverywhereSection() {
  const reduceMotion = useReducedMotion();
  const [activePhrase, setActivePhrase] = useState(0);
  const [hoveredPhrase, setHoveredPhrase] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ active: boolean; startX: number; scrollLeft: number }>({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  // Auto-cycle phrase highlight
  useEffect(() => {
    if (reduceMotion || hoveredPhrase !== null) return;
    const id = window.setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % PHRASES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion, hoveredPhrase]);

  const highlightIndex = hoveredPhrase ?? activePhrase;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
    el.classList.add("cursor-grabbing");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragRef.current.active) return;
    const delta = e.clientX - dragRef.current.startX;
    el.scrollLeft = dragRef.current.scrollLeft - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current.active = false;
    el.classList.remove("cursor-grabbing");
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

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
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {CARDS.map((card, index) => (
            <motion.article
              key={card.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative shrink-0 snap-center overflow-hidden rounded-[1.35rem] bg-[#1c1c1c] sm:rounded-[1.6rem]",
                card.width,
                card.aspect
              )}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover transition duration-700 ease-out hover:scale-[1.04]"
                sizes="(min-width: 1024px) 480px, 70vw"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
            </motion.article>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
