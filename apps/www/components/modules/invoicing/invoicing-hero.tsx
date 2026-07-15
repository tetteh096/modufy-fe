"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { InvoiceMockup } from "@/components/modules/invoicing/invoice-mockup";
import { appPath } from "@/lib/site-config";

export function InvoicingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f6f6f4] pb-12 pt-28 sm:-mt-[6.25rem] sm:pb-16 sm:pt-32">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-leaf-green/12 blur-[90px]"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-brand-leaf-green">
                Home
              </Link>
            </li>
            <li className="text-border">/</li>
            <li>
              <Link href="/modules" className="transition hover:text-brand-leaf-green">
                Modules
              </Link>
            </li>
            <li className="text-border">/</li>
            <li className="font-medium text-[#1a2744]">Invoicing</li>
          </ol>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a2744]/55"
            >
              Modufy Invoicing
            </motion.p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1a2744] sm:text-5xl lg:text-[3.35rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                Bill professionally.
              </motion.span>
              <motion.span
                className="mt-1 block text-gradient-leaf"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
              >
                Get paid faster.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
            >
              Create branded invoices, send reminders, and sync every payment straight into your
              books — from draft to paid.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38 }}
            >
              <Button
                href={appPath("/register")}
                size="lg"
                external
                className="shadow-lg shadow-brand-leaf-green/20 transition hover:-translate-y-0.5 hover:bg-brand-leaf-green hover:shadow-brand-leaf-green/30"
                variant="secondary"
              >
                Start free trial
              </Button>
              <Button href="/demo" variant="outline" size="lg">
                Book a demo
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.48 }}
            >
              No card required. Start with Modufy Core free.
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <InvoiceMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
