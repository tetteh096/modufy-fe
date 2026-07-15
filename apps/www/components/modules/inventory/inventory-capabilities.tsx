"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  Barcode,
  ClipboardList,
  Eye,
  Package,
  Scale,
  Truck,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";

export function InventoryCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Key capabilities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0e120e] sm:text-4xl">
            Everything you need to keep stock honest.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Catalog
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#0e120e]">
              Products and services in one place
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Photos, SKU, barcode, variants, pricing: plus hourly or fixed services with bookable
              flags.
            </p>
            <div className="mt-6 space-y-2">
              {[
                ["Clay bar · SKU-118", "Variant pack · GHS 85"],
                ["Studio consult · SVC-012", "Bookable · 45 min"],
                ["Refill spray · SKU-204", "Barcode ready"],
              ].map(([name, meta], index) => (
                <motion.div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-border bg-[#f5f6f3] px-3 py-3"
                  animate={
                    reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -3 : 3, 0] }
                  }
                  transition={{ duration: 3.3 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e120e]">
                    <Package className="h-4 w-4 text-brand-leaf-green" />
                    {name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{meta}</span>
                </motion.div>
              ))}
            </div>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0.06}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Movements
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#0e120e]">
              Restock, adjust, write-off: with history
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every change is logged so you know why quantity moved, not just that it did.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-[#f7f5f1] p-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0e120e]">
                  <ClipboardList className="h-4 w-4 text-brand-leaf-green" />
                  Movement history
                </div>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <p>Restock +40 · Purchase order #882</p>
                  <p>Sale -2 · POS session</p>
                  <p>Adjust -1 · damaged write-off</p>
                </div>
              </div>
            </div>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.1}>
            <div className="flex items-center gap-2 text-brand-tangerine">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Alerts</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0e120e]">Low-stock warnings early</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Catch shortages before the shelf is empty.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.14}>
            <div className="flex items-center gap-2 text-brand-leaf-green">
              <Truck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Suppliers</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0e120e]">Purchase orders built in</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Track suppliers and restock without another tool.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.18}>
            <div className="flex items-center gap-2 text-[#0e120e]">
              <Scale className="h-5 w-5 text-brand-leaf-green" />
              <span className="text-xs font-bold uppercase tracking-wider">Valuation</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0e120e]">FIFO or average cost</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Inventory valuation reports that match how you account for stock.
            </p>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-6" delay={0.22}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-brand-leaf-green">
                  <Eye className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Channels</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#0e120e]">
                  Control what appears on your storefront
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Publish selected items publicly while keeping wholesale-only SKUs private. Sales
                  through POS and invoices still deduct from the same stock.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Barcode className="h-3.5 w-3.5 text-brand-tangerine" />
                  Barcode + SKU search ready
                </div>
              </div>
              <div className="relative h-36 w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl bg-[#eef4ea] sm:h-40">
                <Image
                  src={homeImages.features.inventory}
                  alt="Inventory management illustration"
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
