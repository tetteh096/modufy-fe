"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CampaignMockup } from "@/components/modules/marketing/campaign-mockup";
import { Button } from "@/components/ui/button";
import { appPath } from "@/lib/site-config";

export function MarketingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#121212] pb-14 pt-28 text-white sm:-mt-[6.25rem] sm:pb-20 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_20%,rgba(70,116,52,0.28),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_70%,rgba(245,143,32,0.12),transparent)]" />
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light" aria-hidden />

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="text-sm text-white/45">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/modules" className="transition hover:text-white">
                Modules
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-white/80">Marketing</li>
          </ol>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50"
            >
              Modufy Marketing
            </motion.p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                Unify your messaging.
              </motion.span>
              <motion.span
                className="mt-1 block text-brand-leaf-green"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
              >
                Reach customers who already know you.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
            >
              Segments from your customer book. SMS or email. Opt-outs and wallet tracking —
              without leaving Modufy.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button
                href="/demo"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Book a demo
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-white/45"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.48 }}
            >
              No card required · start with Core free
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent p-2 sm:p-3">
              <CampaignMockup />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
