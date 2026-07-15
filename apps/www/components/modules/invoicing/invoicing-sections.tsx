"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

const BENEFITS = [
  {
    title: "Send once. Track everywhere.",
    copy: "Share invoices by WhatsApp, email, SMS, or link, and see when they are viewed, overdue, or paid.",
  },
  {
    title: "Payments update your books",
    copy: "When a payment lands, Accounting syncs automatically. No duplicate entry between billing and books.",
  },
  {
    title: "Quotes become invoices",
    copy: "Convert a proforma to a branded invoice in one click, keeping the same customer history.",
  },
] as const;

export function InvoicingSpotlightSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_20%_40%,rgba(70,116,52,0.22),transparent)]" />
      <div className="container-site relative py-16 sm:py-20 lg:py-24">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
            Modufy Invoicing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            Billing that keeps your business moving
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative mx-auto max-w-lg">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#1a2744]/40 sm:aspect-[5/6]">
                <Image
                  src={homeImages.features.invoice}
                  alt="Professional invoice document in Modufy"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <motion.div
                className="absolute -right-2 top-8 rounded-full bg-brand-leaf-green px-3.5 py-1.5 text-xs font-bold text-white shadow-lg sm:right-4"
                animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Invoice paid
              </motion.div>

              <motion.div
                className="absolute -left-2 bottom-16 w-[min(100%,220px)] rounded-2xl border border-white/15 bg-white p-4 text-[#1a2744] shadow-2xl sm:left-4"
                animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Total collected
                </p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">$2,484</p>
                <ul className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
                  <li className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Scanner kit</span>
                    <span className="font-semibold">-$1,240</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Restock pack</span>
                    <span className="font-semibold">-$380</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Setup</span>
                    <span className="font-semibold">-$450</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="space-y-8">
              {BENEFITS.map((item) => (
                <li key={item.title}>
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
                    {item.copy}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button
                href={appPath("/register")}
                size="lg"
                external
                variant="outline"
                className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Start free trial
              </Button>
              <Link
                href="/modules"
                className="text-sm font-semibold text-white underline underline-offset-4 transition hover:text-brand-leaf-green"
              >
                View all modules
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function InvoicingVisualFeatures() {
  const features = [
    {
      title: "Invoices that look like your brand",
      copy: "Logo, colours, and customer details on every PDF your clients receive.",
      image: homeImages.features.finance,
      alt: "Finance growth visuals with Modufy invoicing",
    },
    {
      title: "Get paid, stay in sync",
      copy: "Record payments in any currency: every amount posts straight to Accounts.",
      image: homeImages.features.payments,
      alt: "Payment card visual connected to Modufy books",
    },
    {
      title: "Connected to the rest of Modufy",
      copy: "Pull products from Inventory, follow up in Marketing, keep Core customers in one place.",
      image: homeImages.integrations,
      alt: "Modufy modules connected across the platform",
    },
  ] as const;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Built to work together
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Less admin. Clearer cash flow.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8e4dc]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a2744]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InvoicingConnectionsSection() {
  const reduceMotion = useReducedMotion();

  const connections = [
    { slug: "core", name: "Modufy Core", detail: "Customers and sales history" },
    { slug: "inventory", name: "Inventory", detail: "Products and pricing" },
    { slug: "accounts", name: "Accounting", detail: "Payments land in books" },
    { slug: "marketing", name: "Marketing", detail: "Follow-ups that convert" },
  ] as const;

  return (
    <section className="section-padding">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Connected modules
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Invoicing sits where money moves.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            One invoice record ties customers, stock, payments, and follow-ups together, so nothing
            lives in a separate spreadsheet.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {connections.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <Link
                  href={`/modules/${item.slug}`}
                  className="group block rounded-2xl border border-border bg-white p-4 transition hover:border-brand-leaf-green/30 hover:shadow-md"
                >
                  <p className="font-semibold text-[#1a2744] group-hover:text-brand-leaf-green">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
            <Image
              src={homeImages.hero.dashboardDevices}
              alt="Modufy dashboard across devices"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function InvoicingComparisonSection() {
  const before = [
    "Manual documents and unclear status",
    "Re-entering payments into books",
    "Follow-ups that slip through cracks",
  ] as const;
  const after = [
    "Branded invoices with live status",
    "Accounts update automatically",
    "Reminders and easy sharing built in",
  ] as const;

  return (
    <section className="section-padding bg-[#fdfbf8]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Before & after
          </h2>
        </FadeIn>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-[1.5rem] border border-border bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Without Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {before.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="h-full rounded-[1.5rem] border border-brand-leaf-green/25 bg-brand-leaf-green/[0.04] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-leaf-green">
                With Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {after.map((item) => (
                  <li key={item} className="text-sm font-medium leading-relaxed text-[#1a2744]">
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

export function InvoicingPricingSection() {
  return (
    <section className="section-padding">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Start free. Add Invoicing when you need it.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Begin with Modufy Core at no cost, then turn on Invoicing as you grow, without migrating
            customers or rebuilding your workflow.
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
          <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem]">
            <Image
              src={homeImages.pages.testimonials}
              alt="Business teams using Modufy for billing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#122038]/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-white/95 p-4 backdrop-blur-sm">
              <p className="text-sm font-bold text-[#1a2744]">Invoicing module</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Enable anytime. Branded invoices, reminders, and accounts sync.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function InvoicingFinalCta() {
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

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to invoice professionally?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Trusted documents. Clear payment status. Books that stay up to date.
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
                Explore more modules <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
