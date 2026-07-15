"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  FileText,
  Layers,
  Package,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { AccountsMockup } from "@/components/modules/accounts/accounts-mockup";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const SOURCES = [
  { icon: ShoppingBag, label: "POS sales", copy: "Every register close posts cleanly." },
  { icon: FileText, label: "Invoices", copy: "Payments land in books the moment they’re recorded." },
  { icon: Wallet, label: "Expenses", copy: "Spend with categories, no spreadsheet import." },
  { icon: Package, label: "Inventory", copy: "Stock moves feed COGS and valuation." },
] as const;

const REPORTS = [
  {
    title: "Profit & loss you can read",
    copy: "Owners get a clear P&L from real activity, not a second set of books.",
  },
  {
    title: "Cash flow in context",
    copy: "See money in and out alongside the modules that produced it.",
  },
  {
    title: "Tax summaries ready",
    copy: "VAT and period markers for filing: plus multi-currency when you need it.",
  },
] as const;

export function AccountsHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#0f1724] pb-14 pt-28 text-white sm:-mt-[6.25rem] sm:pb-20 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_75%_15%,rgba(70,116,52,0.28),transparent)]" />

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="text-base text-white/40">
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
            <li className="font-medium text-white/80">Accounting & Finance</li>
          </ol>
        </nav>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-brand-leaf-green sm:text-sm"
            >
              Paid module
            </motion.p>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[3.75rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Books that
              </motion.span>
              <motion.span
                className="mt-1 block text-white/70"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                update themselves.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-lg leading-relaxed text-white/55"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              Sales, invoice payments, expenses, and stock movements can post to your ledger
              automatically. P&L and cash flow without re-keying.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button
                href="/demo"
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Book a demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
          >
            <AccountsMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AccountsSourceStrip() {
  const reduceMotion = useReducedMotion();
  const labels = ["POS", "Invoices", "Expenses", "Inventory", "Core sales", "Accounts"];
  const loop = [...labels, ...labels];

  return (
    <section className="border-y border-[#1a2744]/08 bg-white py-5">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-3">
            {labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[#1a2744]/10 bg-[#f6f6f4] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-3 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          >
            {loop.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#1a2744]/10 bg-[#f6f6f4] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <Layers className="h-3.5 w-3.5 text-brand-leaf-green" />
                {label}
                <span className="text-[#1a2744]/35">→</span>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function AccountsAutopostSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SOURCES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const ActiveIcon = SOURCES[active].icon;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Auto-posting
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl lg:text-[2.75rem]">
            Every module writes. Accounts listens.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#1a2744]/60">
            No duplicate entry between the counter, invoices, and the ledger, your reports
            reflect what actually happened.
          </p>
        </FadeIn>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0f1724] p-6 text-white sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={SOURCES[active].label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0a8] text-[#1a2744]">
                    <ActiveIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/40">
                    Source 0{active + 1}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                    {SOURCES[active].label}
                  </h3>
                  <p className="mt-3 max-w-md text-lg leading-relaxed text-white/55">
                    {SOURCES[active].copy}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex gap-2">
                {SOURCES.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-label={item.label}
                    onClick={() => setActive(index)}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition",
                      index === active ? "bg-[#e8f0a8]" : "bg-white/20 hover:bg-white/35"
                    )}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {SOURCES.map((item, index) => {
                const Icon = item.icon;
                const on = index === active;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition sm:px-5",
                        on
                          ? "border-brand-leaf-green/35 bg-[#eef4e4]"
                          : "border-[#1a2744]/08 bg-[#f6f6f4] hover:border-[#1a2744]/15"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          on ? "bg-brand-leaf-green text-white" : "bg-white text-[#1a2744]/45"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold text-[#1a2744]">{item.label}</p>
                        <p className="mt-1 text-base leading-relaxed text-[#1a2744]/55">{item.copy}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function AccountsReportsSection() {
  return (
    <section className="section-padding bg-[#f4f5f2]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Reports
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Dashboards owners can read. Ledgers accountants trust.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem]">
              <Image
                src={homeImages.features.finance}
                alt="Finance growth and accounting visuals"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </FadeIn>

          <div className="flex flex-col gap-4 lg:col-span-2">
            {REPORTS.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.06}>
                <article className="rounded-2xl border border-[#1a2744]/08 bg-white p-5 sm:p-6">
                  <h3 className="font-display text-xl font-bold text-[#1a2744]">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#1a2744]/60">{item.copy}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AccountsFeaturesGrid() {
  const features = [
    {
      title: "Double-entry chart of accounts",
      copy: "Proper ledger structure with manual journals when you need a correction.",
    },
    {
      title: "Multi-currency ledger",
      copy: "Carry exchange rates alongside money fields for cross-border teams.",
    },
    {
      title: "VAT and tax periods",
      copy: "Summaries and filing markers: including GRA and FIRS support where you operate.",
    },
    {
      title: "Export-friendly summaries",
      copy: "Give your accountant clean views without rebuilding the books in Excel.",
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Capabilities
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Finance depth without a second system.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-x-12 border-t border-[#1a2744]/10 sm:grid-cols-2">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={(index % 2) * 0.05}>
              <div className="border-b border-[#1a2744]/10 py-9">
                <h3 className="font-display text-xl font-bold text-[#1a2744]">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#1a2744]/60">{feature.copy}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AccountsCloseSection() {
  return (
    <section className="section-padding bg-[#f4f5f2]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Add Accounts when the books need to keep up.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#1a2744]/60">
              Begin on Core, run sales and invoices, then enable Accounting & Finance so every
              module posts into one ledger.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Get started free
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View pricing
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/modules/core", label: "Core" },
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/inventory", label: "Inventory" },
                { href: "/modules/pos", label: "POS" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#1a2744]/12 bg-white px-4 py-2.5 text-base font-semibold text-[#1a2744] transition hover:border-brand-leaf-green/40"
                >
                  <Check className="h-3.5 w-3.5 text-brand-leaf-green" />
                  {item.label}
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
              <Image
                src={homeImages.features.analytics}
                alt="Accounting reports in Modufy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/95 p-4 backdrop-blur-sm">
                <p className="font-display text-base font-bold text-[#1a2744]">
                  Accounting & Finance
                </p>
                <p className="mt-1 text-sm text-[#1a2744]/55">
                  Auto-posting, P&L, cash flow, and tax summaries, ready when you enable it.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0f1724] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(70,116,52,0.22),transparent)]" />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready for books that match the business?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-base text-white/55 sm:text-lg">
              Stop re-entering sales into a separate ledger. Let Modufy Accounts keep the
              financial picture honest.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
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
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
