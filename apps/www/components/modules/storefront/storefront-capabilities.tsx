"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  BadgePercent,
  Eye,
  Images,
  MessageSquare,
  Package,
  Star,
  ToggleRight,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";

export function StorefrontCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Key capabilities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Everything you need to sell and showcase online.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Branding
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              Publish a storefront that looks like you
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Go live or unpublish anytime. Your link, your branding, your catalog.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-[#f7f5f1] p-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-leaf-green text-xs font-bold text-white">
                      M
                    </span>
                    <p className="text-sm font-bold text-[#1a2744]">modufy.app/you</p>
                  </div>
                  <ToggleRight className="h-5 w-5 text-brand-leaf-green" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Products", "Services", "Gallery"].map((label) => (
                    <div
                      key={label}
                      className="rounded-lg bg-[#faf8f5] px-2 py-3 text-center text-[11px] font-semibold text-[#1a2744]"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0.06}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Catalog
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              Products and services from Inventory
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              List once. Sell or book on your public page without re-entering prices.
            </p>
            <div className="mt-6 space-y-2">
              {[
                ["Clay conditioning bar", "GHS 85"],
                ["Restock gift set", "GHS 220"],
                ["Studio consult", "Bookable"],
              ].map(([name, meta], index) => (
                <motion.div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-border bg-[#faf8f5] px-3 py-3"
                  animate={
                    reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -3 : 3, 0] }
                  }
                  transition={{ duration: 3.3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744]">
                    <Package className="h-4 w-4 text-brand-leaf-green" />
                    {name}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">{meta}</span>
                </motion.div>
              ))}
            </div>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.1}>
            <div className="flex items-center gap-2 text-brand-leaf-green">
              <ShoppingBadge />
              <span className="text-xs font-bold uppercase tracking-wider">Guest checkout</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Order or enquire without an account</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Lower friction for first-time buyers and clients.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.14}>
            <div className="flex items-center gap-2 text-brand-tangerine">
              <BadgePercent className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Promotions</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Coupons with clear results</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Run discounts and see what actually moved.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.18}>
            <div className="flex items-center gap-2 text-[#1a2744]">
              <Images className="h-5 w-5 text-brand-leaf-green" />
              <span className="text-xs font-bold uppercase tracking-wider">Portfolio</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Show your work, not just your price list</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Galleries for studios, makers, and service brands.
            </p>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-6" delay={0.22}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-brand-leaf-green">
                  <Star className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Social proof</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#1a2744]">
                  Reviews you can reply to and moderate
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Orders link back to customer records. Enquiries land in one inbox. Reviews help new
                  visitors trust you faster.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1">
                    <MessageSquare className="h-3.5 w-3.5 text-brand-tangerine" />
                    Enquiry inbox
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1">
                    <Eye className="h-3.5 w-3.5 text-brand-leaf-green" />
                    Order management
                  </span>
                </div>
              </div>
              <div className="relative h-36 w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl bg-[#eef4ea] sm:h-40">
                <Image
                  src={homeImages.features.orders}
                  alt="Online storefront orders illustration"
                  fill
                  className="object-contain p-3"
                  sizes="220px"
                />
              </div>
            </div>
          </CapabilityShell>
        </div>
      </div>
    </section>
  );
}

function ShoppingBadge() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-leaf-green/10">
      <Package className="h-4 w-4" />
    </span>
  );
}

function CapabilityShell({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className={className}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="h-full rounded-[1.5rem] border border-border bg-white p-5 shadow-sm transition-shadow duration-300 hover:border-brand-leaf-green/30 hover:shadow-[0_18px_40px_rgba(70,116,52,0.08)] sm:p-6"
      >
        {children}
      </motion.div>
    </FadeIn>
  );
}
