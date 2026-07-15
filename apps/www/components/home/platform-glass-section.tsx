"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";
import { cn } from "@/lib/utils";

type FeatureTab = {
  id: string;
  label: string;
  title: string;
  description: string;
  points: readonly string[];
  cta: { label: string; href: string };
  visual: string;
  visualAlt: string;
  toast: { title: string; detail: string };
};

const TABS: FeatureTab[] = [
  {
    id: "customers",
    label: "One customer book",
    title: "Every sale starts with the same customer record.",
    description:
      "Tags, balances, and full history live in Modufy Core, so invoicing, POS, and storefront never start from a blank list.",
    points: [
      "Shared customer profiles across modules",
      "Quick sales with cash, MoMo, or card",
      "Team roles and attention alerts",
      "1:1 SMS and email from context",
    ],
    cta: { label: "Explore Core", href: "/modules/core" },
    visual: "/landingscroll/modu/ba9f63df107b6c078626bf9f55174bd4.jpg",
    visualAlt: "Modufy Core customer hub",
    toast: { title: "Customer updated", detail: "Kwame Mensah tagged as VIP" },
  },
  {
    id: "invoices",
    label: "Bill professionally",
    title: "Invoices that get paid, and update your books.",
    description:
      "Create branded invoices, send reminders, track statuses, and stay Ghana tax-ready without re-entering payments.",
    points: [
      "Branded PDF invoices",
      "WhatsApp, SMS, and email sending",
      "VAT, NHIL, and GETFund breakdowns",
      "Payments sync to Accounts",
    ],
    cta: { label: "Explore Invoicing", href: "/modules/invoices" },
    visual: "/landingscroll/modu/inviocesec.jpg",
    visualAlt: "Modufy invoicing illustration",
    toast: { title: "Payment received", detail: "INV-204 · GHS 1,240 settled" },
  },
  {
    id: "inventory",
    label: "Know your stock",
    title: "One catalog. Every channel reads the same numbers.",
    description:
      "Products and services in one place, stock moves when you sell through POS, invoices, or your storefront.",
    points: [
      "SKU, barcode, and variants",
      "Low-stock alerts",
      "Supplier purchase orders",
      "FIFO or average-cost valuation",
    ],
    cta: { label: "Explore Inventory", href: "/modules/inventory" },
    visual: "/landingscroll/modu/cate.jpg",
    visualAlt: "Modufy inventory illustration",
    toast: { title: "Stock synced", detail: "12 units deducted after sale" },
  },
  {
    id: "storefront",
    label: "Sell online",
    title: "Your business online, without building a website.",
    description:
      "Publish a branded storefront from Inventory. Guests can order or enquire, and every lead lands back in Modufy.",
    points: [
      "Guest ordering",
      "Promotions and coupons",
      "Reviews you can moderate",
      "Orders linked to customers",
    ],
    cta: { label: "Explore Storefront", href: "/modules/marketplace" },
    visual: "/landingscroll/modu/store.jpg",
    visualAlt: "Modufy online storefront illustration",
    toast: { title: "New order received", detail: "You saved GHS 45 in fees" },
  },
  {
    id: "marketing",
    label: "Reach customers",
    title: "Campaigns from the same customer book.",
    description:
      "Build segments, send SMS or email, track delivery, and respect opt-outs, without exporting to another tool.",
    points: [
      "SMS and email templates",
      "Live audience previews",
      "Opt-out compliance",
      "SMS wallet tracking",
    ],
    cta: { label: "Explore Marketing", href: "/modules/marketing" },
    visual: "/landingscroll/modu/mart.jpg",
    visualAlt: "Modufy marketing campaigns illustration",
    toast: { title: "Campaign sent", detail: "842 SMS delivered · 2 failed" },
  },
];

export function PlatformGlassSection() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(TABS[0].id);
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  return (
    <section className="relative px-1 pb-12 pt-2 sm:px-2 sm:pb-16 lg:px-3">
      <div className="relative mx-auto w-full overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem]">
        {/* Native fixed bg: smooth, no JS scroll transforms */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.8] contrast-[1.05] saturate-[1.05] max-md:bg-scroll md:bg-fixed"
          style={{ backgroundImage: `url(${homeImages.story.salesTeam})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/38 to-black/55" />

        {/* Extra top space like Lodgify, then content */}
        <div className="relative z-10 px-3 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-24 lg:px-10 lg:pb-14 lg:pt-28">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-brand-tangerine sm:text-4xl lg:text-5xl">
              One platform.
              <span className="mt-1 block text-white">Every task handled.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              See how Modufy helps growing teams run customers, billing, stock, storefront, and
              campaigns in one place.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="mt-10 sm:mt-12">
            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div
                role="tablist"
                aria-label="Platform features"
                className="mx-auto flex w-max min-w-full items-center gap-1 rounded-full border border-white/75 bg-white/55 p-1.5 shadow-[0_10px_36px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl sm:w-full sm:justify-between"
              >
                {TABS.map((tab) => {
                  const isActive = tab.id === activeId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(tab.id)}
                      className={cn(
                        "relative flex-1 whitespace-nowrap rounded-full px-3.5 py-3 text-xs font-semibold transition sm:px-4 sm:text-[13px]",
                        isActive
                          ? "text-white"
                          : "text-[#1a1a1a]/80 hover:bg-white/55 hover:text-[#1a1a1a]"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={reduceMotion ? undefined : "platform-glass-tab"}
                          className="absolute inset-0 rounded-full bg-black shadow-[0_6px_18px_rgba(0,0,0,0.28)]"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Frosted rim + bigger unequal cards */}
          <div className="mt-6 rounded-[1.75rem] border border-white/45 bg-white/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md sm:mt-8 sm:rounded-[2.1rem] sm:p-3 lg:p-3.5">
            <div className="grid items-stretch gap-2.5 sm:gap-3 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.25fr)] lg:gap-4">
              <AnimatePresence mode="wait">
                <motion.article
                  key={`${active.id}-copy`}
                  role="tabpanel"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-h-[420px] flex-col rounded-[1.45rem] bg-white p-7 sm:min-h-[480px] sm:rounded-[1.75rem] sm:p-9 lg:p-11"
                >
                  <h3 className="text-[1.55rem] font-extrabold leading-[1.12] tracking-tight text-[#111] sm:text-[1.9rem] lg:text-[2.15rem]">
                    {active.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#555] sm:text-base">
                    {active.description}
                  </p>
                  <ul className="mt-7 space-y-2.5">
                    {active.points.map((point) => (
                      <li
                        key={point}
                        className="inline-flex w-full items-center gap-3 rounded-full border border-[#e9e7e2] bg-white px-4 py-3 text-[13px] font-medium text-[#1a1a1a] sm:text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={active.cta.href}
                    className="group mt-auto inline-flex items-center gap-2.5 pt-8 text-sm font-bold text-[#111] transition hover:text-brand-leaf-green"
                  >
                    {active.cta.label}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-brand-leaf-green">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </motion.article>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.article
                  key={`${active.id}-visual`}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="relative min-h-[420px] overflow-hidden rounded-[1.45rem] sm:min-h-[520px] sm:rounded-[1.75rem]"
                >
                  {/* Soft calm outer glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-[inherit] bg-[radial-gradient(ellipse_at_top,rgba(180,210,195,0.55),transparent_58%)] opacity-90 blur-[1px]"
                  />
                  <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[inherit] border border-white/70 bg-[#e6efe9] p-4 shadow-[0_20px_48px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] sm:min-h-[520px] sm:p-5">
                    {/* App chrome */}
                    <div className="mb-3 flex items-center justify-between px-1 sm:mb-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1a2744]/70">
                        Modufy
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-12 rounded-full bg-[#1a2744]/10" />
                        <span className="h-2 w-7 rounded-full bg-[#1a2744]/8" />
                        <span className="h-2 w-9 rounded-full bg-[#1a2744]/8" />
                        <span className="h-2 w-5 rounded-full bg-[#1a2744]/6" />
                      </div>
                    </div>

                    {/* Photo plane */}
                    <div className="relative mx-0.5 min-h-[260px] flex-1 overflow-hidden rounded-[1.1rem] sm:min-h-[340px] sm:rounded-[1.25rem]">
                      <Image
                        src={active.visual}
                        alt={active.visualAlt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 560px, 90vw"
                        priority
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />

                      {/* Floating toast over image */}
                      <motion.div
                        key={active.toast.title}
                        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-x-3 bottom-4 sm:inset-x-5 sm:bottom-5"
                      >
                        <div className="mx-auto flex w-full max-w-[380px] items-center gap-3 rounded-full border border-white/10 bg-[#1c1c1e]/92 px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tangerine text-sm font-extrabold text-white shadow-[0_0_0_3px_rgba(255,140,60,0.25)]">
                            M
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold leading-tight text-white">
                              {active.toast.title}
                            </p>
                            <p className="truncate text-[11px] leading-tight text-white/65">
                              {active.toast.detail}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Bottom skeleton */}
                    <div className="mt-3 grid grid-cols-[72px_1fr] items-center gap-3 px-0.5 sm:mt-4 sm:grid-cols-[88px_1fr] sm:gap-3.5">
                      <div className="aspect-square rounded-xl bg-[#1a2744]/8 ring-1 ring-[#1a2744]/6" />
                      <div className="flex flex-col gap-2.5">
                        <span className="h-2.5 w-full rounded-full bg-[#1a2744]/10" />
                        <span className="h-2.5 w-[78%] rounded-full bg-[#1a2744]/8" />
                        <span className="h-2.5 w-[52%] rounded-full bg-[#1a2744]/6" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
