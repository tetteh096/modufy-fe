"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, MessageCircle, RefreshCw, FileCheck } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

const BENEFITS = [
  {
    title: "Send once. Track everywhere.",
    copy: "Share invoices by WhatsApp, email, SMS, or link, and see when they are viewed, overdue, or paid.",
    icon: MessageCircle,
  },
  {
    title: "Payments update your books",
    copy: "When a payment lands, Accounting syncs automatically. No duplicate entry between billing and books.",
    icon: RefreshCw,
  },
  {
    title: "Quotes become invoices",
    copy: "Convert a proforma to a branded invoice in one click, keeping the same customer history.",
    icon: FileCheck,
  },
] as const;

export function InvoicingSpotlightSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#101010] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_35%,rgba(70,116,52,0.18),transparent)]" />
      <div className="container-site relative py-16 sm:py-20 lg:py-24">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-tangerine">
            Modufy Invoicing
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Billing that keeps your business moving
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <FadeIn>
            <div className="relative mx-auto w-full max-w-xl">
              {/* Calm product board */}
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#e8efe9] p-3 shadow-[0_28px_64px_rgba(0,0,0,0.35)] sm:rounded-[2rem] sm:p-4">
                <div className="mb-3 flex items-center justify-between px-1 sm:mb-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1a2744]/70">
                    Modufy
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-10 rounded-full bg-[#1a2744]/10" />
                    <span className="h-2 w-6 rounded-full bg-[#1a2744]/8" />
                    <span className="h-2 w-8 rounded-full bg-[#1a2744]/8" />
                  </div>
                </div>

                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] sm:aspect-[5/6] sm:rounded-[1.4rem]">
                  <Image
                    src="/landingscroll/modu/inviocesec.jpg"
                    alt="Professional invoice document in Modufy"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 90vw, 520px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                  {/* Paid pill on image */}
                  <motion.div
                    className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-brand-leaf-green px-3.5 py-2 text-xs font-bold text-white shadow-[0_10px_28px_rgba(70,116,52,0.45)] sm:right-5 sm:top-5"
                    animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    Invoice paid
                  </motion.div>

                  {/* Money card over image */}
                  <motion.div
                    className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5"
                    animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                  >
                    <div className="rounded-[1.25rem] border border-white/20 bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
                            Total collected
                          </p>
                          <p className="mt-1 font-display text-[2.35rem] font-extrabold leading-none tracking-tight text-brand-leaf-green sm:text-[2.75rem]">
                            $2,484
                          </p>
                        </div>
                        <span className="mb-1 rounded-full bg-brand-leaf-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-leaf-green">
                          Synced
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2.5 border-t border-[#ece8e2] pt-3.5">
                        {[
                          ["Scanner kit", "$1,240"],
                          ["Restock pack", "$380"],
                          ["Setup", "$450"],
                        ].map(([label, amount]) => (
                          <li key={label} className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-[#555]">{label}</span>
                            <span className="font-bold text-[#111]">{amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-3 grid grid-cols-[72px_1fr] items-center gap-3 px-0.5 sm:mt-4 sm:grid-cols-[88px_1fr]">
                  <div className="aspect-square rounded-xl bg-[#1a2744]/8 ring-1 ring-[#1a2744]/6" />
                  <div className="flex flex-col gap-2">
                    <span className="h-2.5 w-full rounded-full bg-[#1a2744]/10" />
                    <span className="h-2.5 w-[76%] rounded-full bg-[#1a2744]/8" />
                    <span className="h-2.5 w-[50%] rounded-full bg-[#1a2744]/6" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="space-y-5">
              {BENEFITS.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.title}
                    className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06] sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-leaf-green/15 text-brand-leaf-green">
                        <Icon className="h-4 w-4" strokeWidth={2.25} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/80 sm:text-[15px]">
                          {item.copy}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button
                href={appPath("/register")}
                size="lg"
                external
                className="rounded-full bg-brand-leaf-green px-7 text-white shadow-lg shadow-brand-leaf-green/25 hover:brightness-110"
              >
                Start free trial
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Link
                href="/modules"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition hover:text-white"
              >
                View all modules
                <ArrowRight className="h-3.5 w-3.5" />
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
      copy: "Record payments in any currency. Every amount posts straight to Accounts.",
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
