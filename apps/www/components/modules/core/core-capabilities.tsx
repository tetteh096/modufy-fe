"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Bell,
  Building2,
  Mail,
  MessageSquare,
  Receipt,
  Shield,
  Tags,
  Users,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";

export function CoreCapabilities() {
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
            Everything you need to run the day — included.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Customers
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              A living customer book, not a spreadsheet
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tags, balances, and full history so every sale and message has context.
            </p>
            <div className="mt-6 space-y-2">
              {[
                ["Ama Owusu", "VIP · GHS 420 balance"],
                ["Northline Wholesale", "B2B · 12 orders"],
                ["Kojo Adjei", "New · tagged walk-in"],
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
                    <Tags className="h-4 w-4 text-brand-leaf-green" />
                    {name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{meta}</span>
                </motion.div>
              ))}
            </div>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0.06}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Money in & out
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              Quick sales and expense capture
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cash, mobile money, and card — plus categories and receipt photos for spend.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <Receipt className="h-5 w-5 text-brand-leaf-green" />
                <p className="mt-3 text-sm font-bold text-[#1a2744]">Quick sale</p>
                <p className="mt-1 text-xs text-muted-foreground">Record in seconds</p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                <Wallet className="h-5 w-5 text-brand-tangerine" />
                <p className="mt-3 text-sm font-bold text-[#1a2744]">Expenses</p>
                <p className="mt-1 text-xs text-muted-foreground">Photo receipts</p>
              </div>
            </div>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.1}>
            <div className="flex items-center gap-2 text-brand-leaf-green">
              <Shield className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Permissions</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Invite your team safely</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Roles and granular access so staff only see what they need.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.14}>
            <div className="flex items-center gap-2 text-brand-tangerine">
              <Building2 className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Branches</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Multi-location ready</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Grow into new branches without starting over.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.18}>
            <div className="flex items-center gap-2 text-[#1a2744]">
              <span className="inline-flex gap-1.5">
                <MessageSquare className="h-4 w-4 text-brand-leaf-green" />
                <Mail className="h-4 w-4 text-brand-tangerine" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">1:1 messages</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">SMS and email to individuals</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Personal outreach stays in Core; campaigns live in Marketing.
            </p>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-6" delay={0.22}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-brand-leaf-green">
                  <Bell className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Attention</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#1a2744]">
                  An alert dashboard that keeps you ahead
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  In-app alerts surface what needs review — so unpaid bills, expenses, and team
                  activity do not get lost when other modules plug in later.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-brand-tangerine" />
                  Team + ops in one login
                </div>
              </div>
              <div className="relative h-36 w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl bg-[#eef4ea] sm:h-40">
                <Image
                  src={homeImages.features.pipeline}
                  alt="Modufy Core dashboard on devices"
                  fill
                  className="object-cover object-center"
                  sizes="240px"
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
