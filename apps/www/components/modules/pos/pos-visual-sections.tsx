"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  Pause,
  Plus,
  Receipt,
  ScanBarcode,
  Smartphone,
  Tablet,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { PosMockup } from "@/components/modules/pos/pos-mockup";
import { brandLogos } from "@/lib/content";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function PosHero() {
  const reduceMotion = useReducedMotion();
  const logos = [...brandLogos.slice(0, 5), ...brandLogos.slice(0, 5)];

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#0f1724] pb-0 pt-28 text-white sm:-mt-[6.25rem] sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_70%_20%,rgba(70,116,52,0.28),transparent)]" />

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="text-sm text-white/40">
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
            <li className="font-medium text-white/80">Point of Sale</li>
          </ol>
        </nav>

        <div className="mt-14 grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="pb-10 lg:col-span-5 lg:pb-16">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm text-brand-leaf-green"
            >
              POS system
            </motion.p>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                The point of sale
              </motion.span>
              <motion.span
                className="mt-1 block text-white/70"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                for every sale.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-white/55 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              From first sale to full scale. Today&apos;s retailers run Modufy POS to scan,
              sell, and keep inventory and books connected.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start for free
              </Button>
              <Button
                href="/demo"
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Get in touch
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-base text-white/40"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.46 }}
            >
              Already have Modufy? Log in to enable Point of Sale.
            </motion.p>
          </div>

          <motion.div
            className="relative lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-xl lg:ml-auto lg:mr-0">
              <div className="absolute -inset-6 rounded-[2rem] bg-brand-leaf-green/20 blur-3xl" aria-hidden />
              <PosMockup />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-12 border-t border-white/10 bg-white/[0.03] py-4 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0f1724] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0f1724] to-transparent sm:w-28" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-x-10 gap-y-2">
            {brandLogos.slice(0, 5).map((logo) => (
              <span key={logo} className="text-base font-semibold text-white/40">
                {logo}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-12 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {logos.map((logo, i) => (
              <span key={`${logo}-${i}`} className="shrink-0 text-base font-semibold text-white/40">
                {logo}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function PosScaleSection() {
  const cards = [
    {
      title: "Single store",
      copy: "Sell in store with integrated checkout, barcodes, receipts, and shift sessions.",
      image: homeImages.pages.journey.retail,
      alt: "Single retail store",
    },
    {
      title: "Growing locations",
      copy: "Streamline operations with unified customers, catalog, and sales reporting.",
      image: homeImages.story.salesTeam,
      alt: "Multi-location retail",
    },
    {
      title: "On the go",
      copy: "Run the register from a tablet or phone at pop-ups, markets, and busy floors.",
      image: homeImages.features.mobile,
      alt: "Mobile POS checkout",
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl lg:text-[2.85rem]">
            Powering retailers of every size
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.07}>
              <article className="group relative overflow-hidden rounded-[1.5rem]">
                <div className="relative aspect-[3/4] sm:aspect-[4/5]">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl font-bold text-white">{card.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-white/75">{card.copy}</p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillLabel({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-[#e4f0a8] px-3.5 py-2 text-sm font-bold text-black shadow-[0_4px_14px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {label}
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black/25">
        <Plus className="h-3 w-3" strokeWidth={2.5} />
      </span>
    </span>
  );
}

export function PosOmnichannelSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-black sm:text-4xl lg:text-[2.85rem]">
            Everything you need
            <span className="block">in store, online, and beyond</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-black/55">
            It&apos;s the power to sell in person backed by the power to sell online, all on
            one Modufy platform.
          </p>
        </FadeIn>

        {/* Shopify-style: rising diagonal, overlapping lifestyle panels */}
        <div className="relative mt-14 sm:mt-20">
          {/* Mobile: stacked */}
          <div className="grid gap-4 md:hidden">
            {[
              {
                label: "Back office",
                image: homeImages.hero.dashboardDevices,
                alt: "Back office dashboard",
              },
              {
                label: "POS system",
                image: homeImages.features.payments,
                alt: "POS at the counter",
              },
              {
                label: "Online sales",
                image: homeImages.features.mobile,
                alt: "Online sales on mobile",
              },
            ].map((panel) => (
              <div key={panel.label} className="relative aspect-[4/5] overflow-hidden">
                <Image src={panel.image} alt={panel.alt} fill className="object-cover" sizes="100vw" />
                <PillLabel label={panel.label} className="absolute left-3 top-3" />
              </div>
            ))}
          </div>

          {/* Desktop: staggered overlap: left low, center mid, right high */}
          <div className="relative mx-auto hidden h-[min(36rem,58vw)] max-w-6xl md:block lg:h-[40rem]">
            {/* Back office: lowest, left */}
            <FadeIn className="absolute bottom-[4%] left-0 z-[1] w-[38%]">
              <div className="relative aspect-[3/4] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                <Image
                  src={homeImages.hero.dashboardDevices}
                  alt="Modufy back office on a laptop"
                  fill
                  className="object-cover object-[center_15%]"
                  sizes="38vw"
                />
                <PillLabel label="Back office" className="absolute left-4 top-4" />
              </div>
            </FadeIn>

            {/* POS system: center, slightly taller / forward */}
            <FadeIn delay={0.08} className="absolute bottom-[10%] left-[28%] z-[3] w-[42%]">
              <div className="relative aspect-[3/4] overflow-hidden shadow-[0_22px_60px_rgba(0,0,0,0.16)]">
                <Image
                  src={homeImages.features.payments}
                  alt="Modufy POS system at the counter"
                  fill
                  className="object-cover"
                  sizes="42vw"
                />
                <PillLabel label="POS system" className="absolute bottom-4 left-4" />
              </div>
            </FadeIn>

            {/* Online sales: highest, right */}
            <FadeIn delay={0.14} className="absolute bottom-[22%] right-0 z-[2] w-[36%]">
              <div className="relative aspect-[3/4] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                <Image
                  src={homeImages.features.mobile}
                  alt="Online sales on a phone"
                  fill
                  className="object-cover object-center"
                  sizes="36vw"
                />
                <PillLabel label="Online sales" className="absolute left-4 top-4" />
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={0.1} className="mt-16 sm:mt-20">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#0f1724] text-white shadow-[0_30px_80px_rgba(15,28,46,0.18)]">
            <div className="grid items-stretch lg:grid-cols-2">
              <div className="relative min-h-[240px] lg:min-h-[320px]">
                <Image
                  src={homeImages.pages.journey.retail}
                  alt="Inside look at Modufy Point of Sale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f1724]/40 lg:to-[#0f1724]/70" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Get an inside look at Modufy Point of Sale
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-white/60">
                  See why growing shops trust Modufy POS for counter checkout that stays
                  connected to inventory and books.
                </p>
                <Button href="/demo" className="mt-7 w-fit" size="lg" variant="secondary">
                  Watch demo
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

const CONNECTED = [
  {
    title: "Sell everywhere",
    copy: "Close sales at the counter and keep offline and online orders in sync with Modufy POS.",
    image: homeImages.features.orders,
  },
  {
    title: "Build loyalty",
    copy: "Know your customers in store: pull Core tags, balance, and history at checkout.",
    image: homeImages.pages.testimonials,
  },
  {
    title: "Simplify tasks",
    copy: "One back office to manage inventory, orders, customers, and staff permissions.",
    image: homeImages.features.inventoryPhoto,
  },
] as const;

export function PosConnectedSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % CONNECTED.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="section-padding bg-[#0b0b0b] text-white">
      <div className="container-site">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm text-white/40">
            POS software
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.85rem]">
            Connected retail.
            <span className="block text-white/65">The way it should be.</span>
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn>
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={CONNECTED[active].image}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <Image
                    src={CONNECTED[active].image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:pt-2">
            <div className="relative flex gap-6">
              <div className="relative w-px shrink-0 self-stretch bg-white/12" aria-hidden>
                <motion.div
                  className="absolute left-0 w-[3px] -translate-x-[1px] rounded-full bg-[#a3e635]"
                  animate={{
                    top: `${(active / CONNECTED.length) * 100}%`,
                    height: `${100 / CONNECTED.length}%`,
                  }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </div>

              <ul className="flex-1 space-y-9">
                {CONNECTED.map((item, index) => {
                  const on = index === active;
                  return (
                    <li key={item.title}>
                      <button type="button" onClick={() => setActive(index)} className="w-full text-left">
                        <h3
                          className={cn(
                            "font-display text-2xl font-bold transition duration-300 sm:text-3xl",
                            on ? "text-white" : "text-white/30 hover:text-white/55"
                          )}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-3 max-w-md text-base leading-relaxed transition duration-300",
                            on ? "text-white/60" : "text-white/25"
                          )}
                        >
                          {item.copy}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function PosDevicesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm text-[#1a2744]/45">
            Any counter. Any device.
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Ready on the hardware you already have
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Run a full-screen register on tablet or desktop. Use barcode scan and SKU search -
            no special dock required to start selling.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Tablet, label: "Start selling quickly on tablet or browser" },
              { icon: Pause, label: "Park carts and resume without losing the line" },
              { icon: Receipt, label: "Send receipts by print, WhatsApp, or SMS" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-base font-medium text-[#1a2744]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d8f0a8] text-[#2d4a1a]">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#f6f6f4] p-6 sm:p-8">
            <div className="relative mx-auto aspect-[5/4] max-w-md">
              <div className="absolute left-[8%] top-[12%] w-[58%] overflow-hidden rounded-2xl border border-[#1a2744]/10 bg-[#12161f] shadow-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  <span className="ml-2 text-[10px] font-semibold text-white/40">Register</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-2.5">
                  {["Clay bar", "Spray", "Gift set", "Apron"].map((n) => (
                    <div key={n} className="rounded-lg bg-white/5 px-2 py-3 text-[10px] font-semibold text-white/80">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-[6%] right-[4%] w-[38%] overflow-hidden rounded-[1.35rem] border-[5px] border-[#1a2744] bg-[#12161f] shadow-xl">
                <div className="flex items-center justify-between px-2.5 py-2">
                  <Smartphone className="h-3 w-3 text-white/40" />
                  <span className="text-[9px] font-bold text-brand-leaf-green">POS</span>
                </div>
                <div className="space-y-1.5 px-2.5 pb-3">
                  <div className="rounded-md bg-white/5 px-2 py-2 text-[9px] text-white/70">Scan ready</div>
                  <div className="rounded-md bg-brand-leaf-green/80 px-2 py-2 text-center text-[9px] font-bold text-white">
                    Charge $40
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function PosFeaturesGrid() {
  const features = [
    {
      title: "Omnichannel selling",
      copy: "Use a connected back office to sell in person and online from the same catalog.",
    },
    {
      title: "Staff management",
      copy: "Set staff permissions to control voids, discounts, and session close.",
    },
    {
      title: "Payment processing",
      copy: "Accept cash, mobile money, and card, then post every sale cleanly.",
    },
    {
      title: "Inventory management",
      copy: "Deduct stock automatically and stay aligned with purchase orders and alerts.",
    },
    {
      title: "Customer management",
      copy: "Capture customer info at checkout and keep Core history attached to the sale.",
    },
    {
      title: "Sessions & analytics",
      copy: "Open/close shifts with cash float, and see what sold when you’re busiest.",
    },
  ] as const;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm text-[#1a2744]/45">
            POS features
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            All the features. All in one place.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Increase productivity from showroom to back room with everything your team needs
            to run the business right.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-x-12 border-t border-[#1a2744]/10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={(index % 3) * 0.05}>
              <div className="border-b border-[#1a2744]/10 py-9">
                <h3 className="font-display text-xl font-bold text-[#1a2744] underline decoration-[#1a2744]/20 underline-offset-[6px]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{feature.copy}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 flex justify-center">
          <Button href="/modules" variant="outline" size="lg" className="border-[#1a2744]/30 px-8">
            Explore all modules
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function PosGetStartedSection() {
  const steps = [
    {
      n: "1",
      title: "Start for free",
      copy: "Try Modufy for free, no credit card required.",
    },
    {
      n: "2",
      title: "Set up your store",
      copy: "Get help every step, from catalog setup to your first shift session.",
    },
    {
      n: "3",
      title: "Customize your counter",
      copy: "Permissions, receipts, and inventory thresholds that match how you sell.",
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            How to get started with Modufy POS
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Whether you&apos;re starting out or switching platforms, we&apos;re here to help.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.06}>
              <div className="text-center sm:text-left">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#d8f0a8] text-base font-extrabold text-[#2d4a1a]">
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[#1a2744]">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">{step.copy}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 flex flex-wrap justify-center gap-3">
          <Button
            href={appPath("/register")}
            size="lg"
            external
            className="bg-[#1a2744] px-8 text-white hover:brightness-110"
          >
            Start for free
          </Button>
          <Button href="/demo" variant="outline" size="lg" className="border-[#1a2744]/30 px-8">
            Get in touch
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export function PosCloseSection() {
  return (
    <section className="pb-20 pt-4">
      <div className="container-site">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0f1724] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(70,116,52,0.25),transparent)]" />
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.85rem]">
              Sell better with Modufy POS
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-base text-white/55 sm:text-lg">
              Start for free. Get in touch if you want a walkthrough for your counter.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start for free
              </Button>
              <Button
                href="/demo"
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Get in touch
              </Button>
            </div>
            <p className="relative mt-5 text-base text-white/40">
              Already have a Modufy account? Log in to set up Point of Sale.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { href: "/modules/inventory", label: "Inventory" },
            { href: "/modules/core", label: "Core" },
            { href: "/modules/marketplace", label: "Storefront" },
            { href: "/modules/invoices", label: "Invoicing" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2.5 text-base font-semibold text-[#1a2744] transition hover:border-brand-leaf-green/40"
            >
              <Check className="h-3.5 w-3.5 text-brand-leaf-green" />
              {item.label}
            </Link>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
