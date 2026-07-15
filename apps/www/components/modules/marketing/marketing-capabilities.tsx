"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Cake,
  Gift,
  Mail,
  MessageSquare,
  RefreshCcw,
  ShieldOff,
  Tags,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const TEMPLATES = [
  { icon: Gift, label: "Welcome" },
  { icon: Tags, label: "Promotion" },
  { icon: RefreshCcw, label: "Win-back" },
  { icon: Cake, label: "Birthday" },
] as const;

export function MarketingCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="container-site relative">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Key capabilities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Everything you need to message with care.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Templates
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              SMS and email ready to personalise
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Merge tags like {"{{first_name}}"} make every send feel personal.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {TEMPLATES.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl border border-border bg-[#faf8f5] px-3 py-3"
                  animate={
                    reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -3 : 3, 0] }
                  }
                  transition={{ duration: 3.4 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
                >
                  <item.icon className="h-4 w-4 text-brand-leaf-green" />
                  <span className="text-sm font-semibold text-[#1a2744]">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0.06}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Segments
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              Audiences that stay fresh at send time
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Save rules once. Preview counts before you spend wallet credits.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-[#f7f5f1] p-4">
              <p className="text-sm font-semibold text-[#1a2744]">Bought · last 90 days</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-xs text-muted-foreground">Live preview</span>
                <motion.span
                  className="text-3xl font-extrabold text-brand-leaf-green"
                  initial={reduceMotion ? false : { opacity: 0.4 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  1,284
                </motion.span>
              </div>
            </div>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.1}>
            <div className="flex gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-leaf-green/10 text-brand-leaf-green">
                <MessageSquare className="h-4 w-4" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-[#faf8f5] text-[#1a2744]">
                <Mail className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Send on channels people use</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              SMS for urgency. Email for longer offers.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.14}>
            <div className="flex items-center gap-2 text-brand-leaf-green">
              <ShieldOff className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Compliance</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Opt-outs handled automatically</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Suppression lists and email unsubscribe links built in.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.18}>
            <div className="flex items-center gap-2 text-brand-tangerine">
              <Wallet className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">SMS wallet</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Credits you can track</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              See usage before and after each campaign leaves your wallet.
            </p>
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
