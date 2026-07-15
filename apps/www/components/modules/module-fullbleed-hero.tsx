"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Cta = {
  href: string;
  label: string;
  external?: boolean;
};

type ModuleFullBleedHeroProps = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  image: string;
  imageAlt: string;
  note?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  className?: string;
};

export function ModuleFullBleedHero({
  breadcrumb,
  eyebrow,
  title,
  titleAccent,
  description,
  image,
  imageAlt,
  note = "No card required. Start with Modufy Core free.",
  primaryCta = { href: appPath("/register"), label: "Start free trial", external: true },
  secondaryCta = { href: "/demo", label: "Book a demo" },
  className,
}: ModuleFullBleedHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      data-hero-section
      className={cn(
        "relative -mt-[5.75rem] px-3 pb-3 pt-3 sm:-mt-[6.25rem] sm:px-4 sm:pb-4 sm:pt-4",
        className
      )}
    >
      <div className="relative isolate min-h-[calc(100svh-0.75rem)] overflow-hidden rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:min-h-[calc(100svh-1rem)] sm:rounded-[2.5rem] lg:rounded-[3rem]">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover object-center scale-[1.02]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/65" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        <div className="relative z-10 flex min-h-[calc(100svh-0.75rem)] flex-col items-center justify-center px-4 pb-14 pt-[6.5rem] text-center sm:min-h-[calc(100svh-1rem)] sm:px-8 sm:pb-16 sm:pt-28">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
            <nav
              aria-label="Breadcrumb"
              className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur-md sm:text-base"
            >
              <ol className="flex flex-wrap items-center justify-center gap-2">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="text-white/35">/</li>
                <li>
                  <Link href="/modules" className="transition hover:text-white">
                    Modules
                  </Link>
                </li>
                <li className="text-white/35">/</li>
                <li className="font-medium text-white">{breadcrumb}</li>
              </ol>
            </nav>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-xs font-bold uppercase tracking-[0.24em] text-brand-tangerine sm:mt-12 sm:text-sm"
            >
              {eyebrow}
            </motion.p>

            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:mt-6 sm:text-6xl lg:text-[4.75rem]">
              <motion.span
                className="block drop-shadow-[0_6px_28px_rgba(0,0,0,0.45)]"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                {title}
              </motion.span>
              {titleAccent ? (
                <motion.span
                  className="mt-2 block text-white/88 drop-shadow-[0_6px_28px_rgba(0,0,0,0.45)]"
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  {titleAccent}
                </motion.span>
              ) : null}
            </h1>

            <motion.p
              className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:mt-8 sm:text-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <Button
                href={primaryCta.href}
                size="lg"
                external={primaryCta.external}
                className="rounded-full bg-brand-tangerine px-8 text-brand-sea-grey shadow-[0_10px_30px_rgba(245,143,32,0.35)] hover:bg-brand-tangerine/90"
              >
                {primaryCta.label}
              </Button>
              <Button
                href={secondaryCta.href}
                size="lg"
                variant="outline"
                className="rounded-full border-white/35 bg-white/10 px-8 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/20 hover:text-white"
              >
                {secondaryCta.label}
              </Button>
            </motion.div>

            {note ? (
              <motion.p
                className="mt-6 text-base text-white/55 sm:mt-7"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46 }}
              >
                {note}
              </motion.p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
