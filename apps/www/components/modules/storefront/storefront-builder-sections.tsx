"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Check,
  Eye,
  MessageSquare,
  Package,
  ShoppingBag,
  Star,
  ToggleRight,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

const PRODUCT_CARDS = [
  { name: "Clay conditioning bar", price: "$28", img: homeImages.features.orders },
  { name: "Restock gift set", price: "$64", img: homeImages.features.inventoryPhoto },
  { name: "Studio consult", price: "$45", img: homeImages.features.appointments },
] as const;

export function StorefrontHero() {
  const reduceMotion = useReducedMotion();
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setLive(true);
      return;
    }
    const t = window.setTimeout(() => setLive(true), 1600);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#0b0b0b] pb-16 pt-28 text-white sm:-mt-[6.25rem] sm:pb-24 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_30%,rgba(70,116,52,0.22),transparent)]" />

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
            <li className="font-medium text-white/80">Storefront</li>
          </ol>
        </nav>

        <div className="relative mt-14 min-h-[420px] lg:mt-16 lg:min-h-[520px]">
          {/* Floating product tiles — Shopify canvas style */}
          <motion.div
            className="absolute left-0 top-4 hidden w-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 lg:block"
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={homeImages.features.orders}
                alt=""
                fill
                className="object-cover"
                sizes="144px"
                aria-hidden
              />
            </div>
            <div className="mt-2 flex gap-1.5 px-1">
              {["#467434", "#F58F20", "#c5e4b0", "#1a2744", "#fff"].map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full border border-white/20"
                  style={{ background: c }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 hidden gap-2 lg:flex"
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            {PRODUCT_CARDS.map((p) => (
              <div
                key={p.name}
                className="w-[100px] overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <div className="relative aspect-square">
                  <Image src={p.img} alt="" fill className="object-cover" sizes="100px" aria-hidden />
                </div>
                <p className="truncate px-2 py-1.5 text-[10px] font-semibold text-white/80">{p.price}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-0 hidden w-48 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm lg:block"
            animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Editor</p>
            <p className="mt-2 text-xs font-semibold text-white">Home page</p>
            <p className="mt-1 text-[11px] text-white/50">Header</p>
            <p className="mt-0.5 text-[11px] text-brand-leaf-green">+ Add section</p>
            <p className="mt-2 text-[11px] text-white/50">Catalog · Reviews</p>
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-4 hidden w-40 overflow-hidden rounded-2xl border border-white/10 lg:block"
            animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={homeImages.features.mobile}
                alt="Storefront on mobile"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </motion.div>

          {/* Center copy */}
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-leaf-green"
            >
              Modufy Online Storefront
            </motion.p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Your vision.
              </motion.span>
              <motion.span
                className="mt-1 block text-white/90"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                Your storefront — live.
              </motion.span>
            </h1>

            <motion.p
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/55 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              Customize branding, sync products from Inventory, and publish a public page to browse,
              book, and buy — without building a website from scratch.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <Button
                href={appPath("/register")}
                size="lg"
                external
                className="rounded-full bg-white text-[#0b0b0b] hover:bg-white/90"
              >
                Start customizing free
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-white/40"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              No card required · start with Modufy Core free
            </motion.p>

            <motion.div
              className="mx-auto mt-10 max-w-sm overflow-hidden rounded-[1.5rem] border border-white/15 bg-white text-[#1a2744] shadow-2xl lg:mt-12"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-leaf-green text-xs font-bold text-white">
                    M
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-bold">Meridian Studio</p>
                    <p className="text-[10px] text-muted-foreground">modufy.app/meridian</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    live
                      ? "bg-brand-leaf-green/15 text-brand-leaf-green"
                      : "bg-[#f4f1ea] text-[#6f6f6f]"
                  }`}
                >
                  {live ? "Live" : "Draft"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 p-3">
                {PRODUCT_CARDS.map((p) => (
                  <div key={p.name} className="overflow-hidden rounded-lg bg-[#f7f5f1]">
                    <div className="relative aspect-square">
                      <Image src={p.img} alt={p.name} fill className="object-cover" sizes="100px" />
                    </div>
                    <p className="px-1.5 py-1 text-[10px] font-bold text-brand-leaf-green">{p.price}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StorefrontTrustStrip() {
  const reduceMotion = useReducedMotion();
  const items = [
    "Branded public page",
    "Products from Inventory",
    "Guest orders",
    "Promotions",
    "Reviews",
    "Mobile-ready",
  ] as const;
  const loop = [...items, ...items];

  return (
    <section className="border-b border-border bg-white">
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-x-8 gap-y-2">
            {items.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744]/75">
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

export function StorefrontCustomizeSection() {
  const features = [
    {
      title: "Publish with your branding",
      copy: "Logo, colours, and your Modufy link — go live or unpublish anytime.",
      visual: "brand" as const,
    },
    {
      title: "Catalog from Inventory",
      copy: "Products and services stay in sync. List once — sell or book on your page.",
      visual: "catalog" as const,
    },
    {
      title: "Promotions that track",
      copy: "Coupons and offers with clear performance — not notes in a chat thread.",
      visual: "promo" as const,
    },
    {
      title: "Enquiries & reviews",
      copy: "Capture interest and social proof, then reply from the same workspace.",
      visual: "reviews" as const,
    },
  ] as const;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Customize — don&apos;t rebuild
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Make your mark. No website project required.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Modufy Storefront isn&apos;t a blank page builder. You customize a ready commercial page
            and publish it — powered by the catalog you already run.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((f, index) => (
            <FadeIn key={f.title} delay={index * 0.06}>
              <article>
                <FeatureVisual kind={f.visual} />
                <h3 className="mt-5 text-xl font-bold text-[#1a2744]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorefrontDiscoverSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Get discovered
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Share one link. Look sharp on every phone.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <FadeIn>
            <article>
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#ebe7e0]">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-lg">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Your public link
                    </p>
                    <p className="mt-3 rounded-xl bg-[#f7f5f1] px-3 py-3 font-mono text-sm font-semibold text-[#1a2744]">
                      modufy.app/your-shop
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Share", "QR", "Bio link"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-[#1a2744]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1a2744]">One link for every channel</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Put it in Instagram, WhatsApp, or email. Customers land on a branded page — not a
                photo dump in DMs.
              </p>
            </article>
          </FadeIn>

          <FadeIn delay={0.08}>
            <article>
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#ebe7e0]">
                <div className="absolute inset-0 flex items-end justify-center gap-3 p-6 pb-8">
                  <div className="relative h-[78%] w-[42%] overflow-hidden rounded-[1.25rem] border-[5px] border-[#1a2744] bg-white shadow-xl">
                    <Image
                      src={homeImages.features.mobile}
                      alt="Storefront mobile preview"
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <div className="relative mb-4 h-[68%] w-[38%] overflow-hidden rounded-[1.1rem] border-[5px] border-[#1a2744]/80 bg-white shadow-lg">
                    <Image
                      src={homeImages.features.orders}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="150px"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1a2744]">Mobile-ready by default</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your page looks right on every screen — no separate mobile rebuild.
              </p>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function StorefrontReadySection() {
  const cards = [
    {
      title: "Orders into Modufy",
      copy: "Guest checkouts and enquiries land as records — tied to customers when they exist.",
      icon: ShoppingBag,
    },
    {
      title: "Catalog stays honest",
      copy: "Inventory powers prices and availability. No duplicate product lists.",
      icon: Package,
    },
    {
      title: "Live when you say so",
      copy: "Publish or pause the storefront anytime. You control what the public sees.",
      icon: Eye,
    },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#122038] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(70,116,52,0.2),transparent)]" />
      <div className="container-site relative py-16 sm:py-20">
        <FadeIn>
          <h2 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready for real commerce from day one
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                <card.icon className="h-5 w-5 text-brand-leaf-green" />
                <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{card.copy}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StorefrontCloseSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Publish when your catalog is ready.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Begin with Modufy Core, add Inventory, then turn on Storefront — without migrating to
              a separate website tool.
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Works with
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/modules/inventory", label: "Inventory" },
                { href: "/modules/appointments", label: "Appointments" },
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/marketing", label: "Marketing" },
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
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0b0b0b] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
              aria-hidden
            />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to go live?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm text-white/55">
              Customize your page, sync the catalog, and share one link — orders and enquiries come
              back into Modufy.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button
                href={appPath("/register")}
                size="lg"
                external
                className="rounded-full bg-white text-[#0b0b0b] hover:bg-white/90"
              >
                Start customizing free
              </Button>
              <Button
                href="/demo"
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
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

function FeatureVisual({ kind }: { kind: "brand" | "catalog" | "promo" | "reviews" }) {
  if (kind === "brand") {
    return (
      <div className="flex aspect-[16/11] items-center justify-center rounded-2xl bg-[#ebe7e0] p-6">
        <div className="w-full max-w-xs rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-leaf-green text-xs font-bold text-white">
                M
              </span>
              <p className="text-sm font-bold text-[#1a2744]">modufy.app/you</p>
            </div>
            <ToggleRight className="h-5 w-5 text-brand-leaf-green" />
          </div>
          <div className="mt-4 flex gap-2">
            {["#467434", "#F58F20", "#1a2744"].map((c) => (
              <span key={c} className="h-6 w-6 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "catalog") {
    return (
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
        <Image
          src={homeImages.features.orders}
          alt="Product catalog on storefront"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1a2744]">
            <Package className="h-3.5 w-3.5 text-brand-leaf-green" />
            Synced from Inventory · 24 live items
          </div>
        </div>
      </div>
    );
  }

  if (kind === "promo") {
    return (
      <div className="flex aspect-[16/11] items-center justify-center rounded-2xl bg-[#ebe7e0] p-6">
        <div className="w-full max-w-xs rounded-xl border border-brand-tangerine/30 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-tangerine">
            Active offer
          </p>
          <p className="mt-2 text-lg font-bold text-[#1a2744]">WEEKEND15</p>
          <p className="mt-1 text-xs text-muted-foreground">15% off · 86 redemptions this week</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#efece6]">
            <div className="h-full w-2/3 rounded-full bg-brand-tangerine" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-[16/11] items-center justify-center rounded-2xl bg-[#ebe7e0] p-6">
      <div className="w-full max-w-xs space-y-2">
        <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
          <div className="flex items-center gap-1 text-brand-leaf-green">
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <p className="mt-2 text-xs text-[#1a2744]">“Page looks as good as the shop.”</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1a2744]">
            <MessageSquare className="h-3.5 w-3.5 text-brand-leaf-green" />
            New enquiry · Portfolio project
          </div>
        </div>
      </div>
    </div>
  );
}
