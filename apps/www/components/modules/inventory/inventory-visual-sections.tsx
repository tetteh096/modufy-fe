"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Barcode,
  Check,
  FileText,
  Package,
  ShoppingCart,
  Store,
  Truck,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { InventoryMockup } from "@/components/modules/inventory/inventory-mockup";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const SKU_CARDS = [
  { name: "Clay conditioning bar", meta: "SKU-118 · 120 on hand", price: "$24", kind: "product" },
  { name: "Shelf spray refill", meta: "SKU-204 · low · 18 left", price: "$16", kind: "low" },
  { name: "Studio consult", meta: "SVC-012 · bookable · 45 min", price: "$85", kind: "service" },
  { name: "Gift set · 3-pack", meta: "Variant · cost $42 · sell $68", price: "$68", kind: "product" },
  { name: "Colour refresh", meta: "Fixed rate · bookable", price: "$95", kind: "service" },
  { name: "Linen apron", meta: "SKU-331 · 54 on hand", price: "$38", kind: "product" },
] as const;

const LIVE_EVENTS = [
  { channel: "POS", item: "Clay bar", delta: "−2", qty: 118 },
  { channel: "Invoice", item: "Gift set", delta: "−1", qty: 22 },
  { channel: "Storefront", item: "Shelf spray", delta: "−3", qty: 15 },
  { channel: "PO #882", item: "Clay bar", delta: "+40", qty: 158 },
  { channel: "POS", item: "Linen apron", delta: "−1", qty: 53 },
] as const;

export function InventoryHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f6f6f4] pb-12 pt-28 sm:-mt-[6.25rem] sm:pb-16 sm:pt-32">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <motion.div
        className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-brand-leaf-green/12 blur-[100px]"
        animate={reduceMotion ? undefined : { x: [0, -18, 0] }}
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
            <li>/</li>
            <li>
              <Link href="/modules" className="transition hover:text-brand-leaf-green">
                Modules
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-[#1a2744]">Inventory & Stock</li>
          </ol>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a2744]/55"
            >
              Paid module
            </motion.p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1a2744] sm:text-5xl lg:text-[3.35rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Know what you have.
              </motion.span>
              <motion.span
                className="mt-1 block text-gradient-leaf"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                Know what you sold.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              One catalog for products and services. Sell through POS, invoices, or storefront -
              stock updates in the same place.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
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
              transition={{ delay: 0.48 }}
            >
              No card required. Start with Modufy Core free.
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
          >
            <div className="relative">
              <div className="relative mb-[-10%] aspect-[16/10] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={homeImages.features.inventoryPhoto}
                  alt="Physical products and stock managed in Modufy Inventory"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f6f6f4] via-transparent to-transparent" />
              </div>
              <div className="relative mx-auto max-w-md scale-[0.94] sm:max-w-lg">
                <InventoryMockup />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function InventoryTrustStrip() {
  const reduceMotion = useReducedMotion();
  const items = [
    "SKU + barcode",
    "Products & services",
    "Low-stock alerts",
    "Purchase orders",
    "FIFO / average cost",
    "One catalog truth",
  ] as const;
  const loop = [...items, ...items];

  return (
    <section className="border-y border-border bg-white">
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-x-8 gap-y-2">
            {items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744]/75"
              >
                <Check className="h-4 w-4 text-brand-leaf-green" />
                {item}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-10 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {loop.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#1a2744]/75"
              >
                <Check className="h-4 w-4 text-brand-leaf-green" />
                {item}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function SkuMarquee({
  cards,
  duration,
  reverse,
  moving,
}: {
  cards: readonly (typeof SKU_CARDS)[number][];
  duration: number;
  reverse?: boolean;
  moving: boolean;
}) {
  const loop = [...cards, ...cards];
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3"
        animate={moving ? { y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] } : undefined}
        transition={moving ? { duration, ease: "linear", repeat: Infinity } : undefined}
      >
        {loop.map((card, i) => (
          <div
            key={`${card.name}-${i}`}
            className="rounded-2xl border border-white/70 bg-white p-4 shadow-[0_8px_24px_rgba(26,39,68,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#1a2744]">{card.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{card.meta}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  card.kind === "low" && "bg-brand-tangerine/15 text-brand-tangerine",
                  card.kind === "service" && "bg-[#1a2744]/8 text-[#1a2744]",
                  card.kind === "product" && "bg-brand-leaf-green/15 text-brand-leaf-green"
                )}
              >
                {card.price}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function InventoryCatalogMarquee() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const moving = !reduceMotion && !paused;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
              The catalog
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Products, variants, and services, one list.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Physical SKUs sit beside bookable services. Pricing, barcodes, and stock thresholds
              stay attached to the item, not lost in a spreadsheet tab.
            </p>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="mt-6 text-sm font-semibold text-brand-leaf-green transition hover:opacity-80"
            >
              {paused ? "Resume catalog" : "Pause catalog"}
            </button>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative h-[420px] overflow-hidden rounded-[1.75rem] bg-[#ebe7e0] p-3 sm:h-[460px]">
              <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
                <SkuMarquee
                  cards={SKU_CARDS.filter((_, i) => i % 2 === 0)}
                  duration={22}
                  moving={moving}
                />
                <SkuMarquee
                  cards={SKU_CARDS.filter((_, i) => i % 2 === 1)}
                  duration={26}
                  reverse
                  moving={moving}
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#ebe7e0] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#ebe7e0] to-transparent" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function InventoryVisualFeatures() {
  const features = [
    {
      title: "Sell, stock follows",
      copy: "Counter, invoice, or online order. Quantities update from one catalog.",
      image: homeImages.features.orders,
      alt: "Orders deducting from live stock",
    },
    {
      title: "Alerts before empty",
      copy: "Low thresholds trigger before the shelf runs out, then restock on a PO.",
      image: homeImages.features.tracking,
      alt: "Stock tracking and alerts",
    },
    {
      title: "Services beside products",
      copy: "Bookable or fixed-rate services live in the same list as retail SKUs.",
      image: homeImages.features.inventory,
      alt: "Inventory catalog in Modufy",
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            What Inventory does
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            One catalog. Every channel stays honest.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <article className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8e4dc]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
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

export function InventoryLiveFeedSection() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [feed, setFeed] = useState(() => LIVE_EVENTS.slice(0, 4));

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % LIVE_EVENTS.length;
        const event = LIVE_EVENTS[next];
        setFeed((prev) => [event, ...prev].slice(0, 4));
        return next;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const active = LIVE_EVENTS[index];

  const steps = [
    { n: "01", label: "Catalog", icon: Package },
    { n: "02", label: "Thresholds", icon: AlertTriangle },
    { n: "03", label: "Sell", icon: ShoppingCart },
    { n: "04", label: "Update", icon: Barcode },
    { n: "05", label: "Restock", icon: Truck },
  ] as const;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Stock loop
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Sell anywhere. Keep one stock truth.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Build the catalog once, set low thresholds, and let Modufy move quantities as you sell
           , then restock through suppliers when alerts fire.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {steps.map((step) => (
              <div
                key={step.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <span className="text-[10px] font-bold text-brand-leaf-green">{step.n}</span>
                <step.icon className="h-3.5 w-3.5 text-brand-leaf-green" />
                {step.label}
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-white p-5 shadow-[0_20px_50px_rgba(26,39,68,0.08)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Live movement
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active.item + active.channel}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    className="mt-0.5 text-sm font-bold text-[#1a2744]"
                  >
                    {active.item}
                  </motion.p>
                </AnimatePresence>
              </div>
              <motion.span
                key={active.qty}
                initial={reduceMotion ? false : { scale: 0.85, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-brand-leaf-green/15 px-3 py-1 text-[11px] font-bold text-brand-leaf-green"
              >
                On hand · {active.qty}
              </motion.span>
            </div>

            <ul className="mt-5 space-y-2.5">
              <AnimatePresence initial={false}>
                {feed.map((row, i) => (
                  <motion.li
                    key={`${row.channel}-${row.item}-${i}-${row.qty}`}
                    layout
                    initial={reduceMotion ? false : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#f6f6f4] px-3.5 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1a2744]">{row.channel}</p>
                      <p className="text-[11px] text-muted-foreground">{row.item}</p>
                    </div>
                    <span
                      className={
                        row.delta.startsWith("+")
                          ? "text-sm font-bold text-brand-leaf-green"
                          : "text-sm font-bold text-[#1a2744]"
                      }
                    >
                      {row.delta}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-tangerine/25 bg-brand-tangerine/10 px-3.5 py-3 text-sm text-brand-tangerine">
              <span className="inline-flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Shelf spray · below threshold
              </span>
              <span className="text-xs font-medium">Create PO</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function InventoryScanSection() {
  const reduceMotion = useReducedMotion();
  const channels = [
    { icon: ShoppingCart, label: "POS", copy: "Barcode checkout deducts now" },
    { icon: FileText, label: "Invoices", copy: "Line items from the catalog" },
    { icon: Store, label: "Storefront", copy: "Live availability on published SKUs" },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#0f1724] py-20 text-white sm:py-24">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-leaf-green to-transparent"
          animate={{ top: ["8%", "92%", "8%"] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        />
      ) : null}

      <div className="container-site relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <FadeIn className="lg:col-span-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-leaf-green">
              One stock truth
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Scan once. Every channel knows.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              No second spreadsheet. When quantity moves on the counter, invoices and storefront
              already see the new number.
            </p>
          </FadeIn>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
            {channels.map((channel, index) => (
              <FadeIn key={channel.label} delay={0.06 * index}>
                <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-leaf-green/15 text-brand-leaf-green">
                    <channel.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{channel.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{channel.copy}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InventoryCloseSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Add Inventory when the catalog needs structure.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Begin on Modufy Core, then enable Inventory when products, services, and suppliers
              outgrow spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View pricing
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/modules/core", label: "Core" },
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/marketplace", label: "Storefront" },
                { href: "/modules/pos", label: "Point of Sale" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-[#1a2744] transition hover:border-brand-leaf-green/40 hover:text-brand-leaf-green"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
              <Image
                src={homeImages.features.inventoryPhoto}
                alt="Modufy Inventory across products and stock"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-white/95 p-4 backdrop-blur-sm">
                <p className="text-sm font-bold text-[#1a2744]">Inventory & Stock</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Catalog, movements, alerts, and POs, ready when you enable it.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to run one catalog across every sale?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm text-white/60">
              Track products and services, stay ahead of stockouts, and keep POS, invoices, and
              storefront reading the same numbers.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
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
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
