"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  FileText,
  Megaphone,
  Package,
  X,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { appPath } from "@/lib/site-config";

const FLOW_NODES = [
  "Publish page",
  "Catalog synced",
  "Customer browses",
  "Order or enquiry",
  "Record in Modufy",
] as const;

const AUDIENCES = [
  {
    title: "Retailers",
    copy: "Take online orders without Shopify-level complexity: catalog and stock stay in Inventory.",
  },
  {
    title: "Service businesses",
    copy: "Show your work, take enquiries, and add booking when you enable Appointments.",
  },
  {
    title: "Brands leaving DMs behind",
    copy: "Give customers a proper link instead of chasing sales through chat threads.",
  },
] as const;

const CONNECTIONS = [
  {
    slug: "inventory",
    name: "Inventory & Stock",
    detail: "Powers products, services, pricing, and availability",
    icon: Package,
  },
  {
    slug: "appointments",
    name: "Appointments & Bookings",
    detail: "Turns bookable services into a live calendar",
    icon: Calendar,
  },
  {
    slug: "invoices",
    name: "Invoicing",
    detail: "Follow up sales with formal documents when needed",
    icon: FileText,
  },
  {
    slug: "blog",
    name: "Storefront Blog",
    detail: "Add SEO content beside your catalog",
    icon: BookOpen,
  },
] as const;

const BEFORE = [
  "Sales stuck in Instagram DMs",
  "No single place for products and services",
  "Promotions tracked in notes",
  "Reviews scattered across platforms",
  "Orders disconnected from customer records",
] as const;

const AFTER = [
  "A branded public page at your Modufy link",
  "Catalog powered by Inventory",
  "Coupons with clear performance",
  "Reviews you can reply to and moderate",
  "Orders and enquiries linked to customers",
] as const;

const TESTIMONIALS = [
  {
    quote:
      "We stopped sending product photos in chat. Customers browse the storefront, and every order lands in Modufy with the right customer attached.",
    name: "Nana Yaa Mensah",
    role: "Founder, Loom & Leaf",
    initials: "NY",
  },
  {
    quote:
      "The portfolio and enquiry form meant we could look professional online without hiring someone to build a site.",
    name: "Kwesi Owusu",
    role: "Creative lead, Studio North",
    initials: "KO",
  },
] as const;

export function StorefrontPresenceSection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-[#f5f6f3]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            From your catalog to a page customers can actually use.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Publish when you are ready. Inventory keeps listings accurate. Enquiries and orders come
            back into the same workspace your team already uses.
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
                <p className="mt-3 text-xs font-semibold leading-snug text-[#0e120e]">{node}</p>
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
                <span className="text-sm font-semibold text-[#0e120e]">{node}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function StorefrontAudienceSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Who it&apos;s for
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            Built for teams that need a real link, not another chat thread.
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
                <h3 className="mt-4 text-lg font-bold text-[#0e120e]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorefrontConnectionsSection() {
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
            Your storefront is stronger because Modufy already holds the catalog.
          </h2>
          <p className="mt-3 text-sm text-white/55">
            Marketing Campaigns can also point traffic back to your public page.
          </p>
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
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-leaf-green/40 bg-[#0e120e] text-center shadow-xl sm:flex"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.25, duration: 0.4 }}
            >
              <span className="px-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-brand-leaf-green">
                Storefront
              </span>
            </motion.div>
          </div>

          <FadeIn delay={0.2} className="mt-6 text-center">
            <Link
              href="/modules/marketing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-tangerine transition hover:gap-3"
            >
              <Megaphone className="h-4 w-4" />
              Also pairs with Marketing Campaigns
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function StorefrontComparisonSection() {
  return (
    <section className="section-padding bg-[#f5f6f3]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Before & after
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            Less DM chaos. A clearer path to buy.
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
                With Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {AFTER.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#0e120e]">
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

export function StorefrontTestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Customer voices
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            A public presence that still lives inside your operations.
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((item, index) => (
            <FadeIn key={item.name} delay={index * 0.06}>
              <blockquote className="h-full rounded-[1.5rem] border border-border bg-white p-6 shadow-sm sm:p-8">
                <p className="text-base leading-relaxed text-[#0e120e]">“{item.quote}”</p>
                <footer className="mt-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-leaf-green/15 text-sm font-bold text-brand-leaf-green">
                    {item.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[#0e120e]">{item.name}</p>
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

export function StorefrontPricingSection() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEnabled(true), reduceMotion ? 0 : 900);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <section className="section-padding bg-[#f5f6f3]">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            Start free. Add Storefront when you are ready to go public.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Begin with Modufy Core and Inventory, then publish your storefront when the catalog is
            ready, without migrating to a separate website builder.
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
                <p className="text-sm font-bold text-[#0e120e]">Online Storefront</p>
                <p className="text-xs text-muted-foreground">Publish or unpublish anytime</p>
              </div>
              <button
                type="button"
                onClick={() => setEnabled((value) => !value)}
                className={`relative h-8 w-14 rounded-full transition ${
                  enabled ? "bg-brand-leaf-green" : "bg-[#d9d4cb]"
                }`}
                aria-pressed={enabled}
                aria-label="Toggle storefront module"
              >
                <motion.span
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow"
                  animate={{ left: enabled ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              </button>
            </div>
            <div className="mt-5 rounded-2xl bg-[#f7f5f1] p-4 text-sm">
              {enabled ? (
                <p className="font-semibold text-brand-leaf-green">
                  Storefront live. Customers can browse, order, and enquire.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Module off, your catalog stays private until you are ready to publish.
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function StorefrontFinalCta() {
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
                Ready to put your business on a proper page?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                Publish products and services, take guest orders and enquiries, and keep every
                conversation connected to your customer book.
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
