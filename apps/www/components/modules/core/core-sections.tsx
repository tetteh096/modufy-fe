"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  FileText,
  Package,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { appPath } from "@/lib/site-config";

const FLOW_NODES = [
  "Create account",
  "Add customers",
  "Record sales",
  "Track expenses",
  "Invite team",
] as const;

const AUDIENCES = [
  {
    title: "Shops going digital",
    copy: "Start with customers and daily sales instead of another spreadsheet.",
  },
  {
    title: "Service teams",
    copy: "Keep client history and expenses in one login before layering bookings or billing.",
  },
  {
    title: "Owners who want one system",
    copy: "Use Core free now, then enable invoicing, inventory, POS, and more when ready.",
  },
] as const;

const CONNECTIONS = [
  {
    slug: "invoices",
    name: "Invoicing",
    detail: "Turns informal sales into professional documents",
    icon: FileText,
  },
  {
    slug: "inventory",
    name: "Inventory & Stock",
    detail: "Adds a catalog that powers POS and storefront",
    icon: Package,
  },
  {
    slug: "pos",
    name: "Point of Sale",
    detail: "Counter checkout that still posts into Core",
    icon: ShoppingBag,
  },
  {
    slug: "accounts",
    name: "Accounting & Finance",
    detail: "Deepens the books when transactions grow",
    icon: Wallet,
  },
] as const;

const BEFORE = [
  "Customer lists in notebooks or Excel",
  "Sales recorded inconsistently",
  "Expenses without receipts",
  "No clear staff permissions",
  "Buying another app for every new need",
] as const;

const AFTER = [
  "A shared customer book from day one",
  "Quick sales with cash, MoMo, or card",
  "Expense categories and photo receipts",
  "Roles that protect sensitive data",
  "Paid modules plug into the same foundation",
] as const;

const TESTIMONIALS = [
  {
    quote:
      "We started on Core alone. Customers and daily sales finally lived in one place — and when we added invoicing later, nothing had to be re-entered.",
    name: "Selorm Tetteh",
    role: "Owner, Ridge Provisions",
    initials: "ST",
  },
  {
    quote:
      "Team permissions were the unlock. Cashiers can sell. Managers see expenses. I still get the alerts that matter.",
    name: "Akosua Frimpong",
    role: "Operator, Harbour Greengrocery",
    initials: "AF",
  },
] as const;

export function CoreFoundationSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-[#faf8f5]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Getting started
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Start simple. Stay coherent as you grow.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Core is not a trial feature you lose later. It is the operating layer every paid module
            connects to.
          </p>
        </FadeIn>

        <div ref={ref} className="mx-auto mt-12 max-w-4xl">
          <div className="hidden items-start justify-between gap-2 md:flex">
            {FLOW_NODES.map((node, index) => (
              <div key={node} className="relative flex flex-1 flex-col items-center text-center">
                {index < FLOW_NODES.length - 1 && (
                  <div className="absolute left-1/2 top-4 h-0.5 w-full bg-[#e5e0d6]">
                    <motion.div
                      className="h-full bg-brand-leaf-green"
                      initial={{ width: 0 }}
                      animate={
                        inView && !reduceMotion
                          ? { width: "100%" }
                          : { width: inView ? "100%" : 0 }
                      }
                      transition={{ duration: 0.45, delay: index * 0.25 }}
                    />
                  </div>
                )}
                <motion.span
                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-leaf-green bg-white text-xs font-bold text-brand-leaf-green"
                  initial={{ scale: 0.7, opacity: 0.4 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: index * 0.25, duration: 0.35 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
                <p className="mt-3 text-xs font-semibold leading-snug text-[#1a2744]">{node}</p>
              </div>
            ))}
          </div>

          <ol className="space-y-3 md:hidden">
            {FLOW_NODES.map((node, index) => (
              <li
                key={node}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green/10 text-xs font-bold text-brand-leaf-green">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-[#1a2744]">{node}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CoreAudienceSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Who it&apos;s for
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Built for teams replacing notebooks and sheet chaos.
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {AUDIENCES.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <motion.article
                whileHover={{ y: -4 }}
                className="h-full rounded-[1.5rem] border border-border bg-white p-6 shadow-sm transition hover:border-brand-leaf-green/25 hover:shadow-lg"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-tangerine">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-lg font-bold text-[#1a2744]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoreConnectionsSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden section-padding bg-[#122038] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(70,116,52,0.22),transparent)]" />
      <div className="container-site relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
            Connected modules
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Paid modules plug into Core — they do not replace it.
          </h2>
        </FadeIn>

        <div ref={ref} className="mx-auto mt-12 max-w-4xl">
          <div className="relative grid gap-4 sm:grid-cols-2">
            {CONNECTIONS.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08, duration: 0.45 }}
              >
                <Link
                  href={`/modules/${item.slug}`}
                  className="group flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-leaf-green/40 hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-leaf-green/15 text-brand-leaf-green">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold group-hover:text-[#c5e4b0]">{item.name}</p>
                    <p className="mt-1 text-sm text-white/55">{item.detail}</p>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-leaf-green/40 bg-[#1a2744] text-center shadow-xl sm:flex"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <span className="text-[10px] font-bold uppercase leading-tight tracking-wider text-brand-leaf-green">
                Core
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CoreComparisonSection() {
  return (
    <section className="section-padding bg-[#fdfbf8]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Before & after
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Less spreadsheet chaos. One foundation.
          </h2>
        </FadeIn>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-[1.5rem] border border-border bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Before Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {BEFORE.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="h-full rounded-[1.5rem] border border-brand-leaf-green/25 bg-brand-leaf-green/[0.04] p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-leaf-green">
                With Modufy Core
              </p>
              <ul className="mt-5 space-y-3">
                {AFTER.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#1a2744]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-leaf-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function CoreTestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Customer voices
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Start on Core. Grow without restarting.
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.06}>
              <blockquote className="h-full rounded-[1.5rem] border border-border bg-white p-6 shadow-sm sm:p-8">
                <p className="text-base leading-relaxed text-[#1a2744]">“{item.quote}”</p>
                <footer className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-leaf-green/15 text-sm font-bold text-brand-leaf-green">
                    {item.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[#1a2744]">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CorePricingSection() {
  return (
    <section className="section-padding bg-[#faf8f5]">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Core is free to start — and it stays with you.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Create an account and begin with customers, sales, expenses, team access, and alerts.
            Enable paid modules only when your business needs them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={appPath("/register")} size="lg" external variant="secondary">
              Start free trial
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              View pricing
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#1a2744]">Modufy Core</p>
                <p className="text-xs text-muted-foreground">Always included with your account</p>
              </div>
              <span className="rounded-full bg-brand-leaf-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-leaf-green">
                Free to start
              </span>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm text-[#1a2744]">
              {[
                "Customer book and history",
                "Quick sales and expense capture",
                "Team invites and permissions",
                "Attention alerts dashboard",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-leaf-green" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function CoreFinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-20 pt-4">
      <div className="container-site">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <motion.div
              className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-brand-leaf-green/25 blur-[70px]"
              animate={reduceMotion ? undefined : { y: [0, 16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-brand-tangerine/18 blur-[80px]"
              animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to start on a real foundation?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                Manage customers, sales, expenses, and your team in one place — then grow into paid
                modules without migrating again.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={appPath("/register")} size="lg" external variant="secondary">
                  Get started free
                </Button>
                <Button
                  href="/demo"
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Book a demo
                </Button>
              </div>
              <Link
                href="/modules"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-tangerine transition hover:gap-2.5"
              >
                Explore paid modules <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
