"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FileText, Link2, Mail, MessageCircle, Phone, Quote, RefreshCw } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";

const STATUSES = ["Draft", "Sent", "Viewed", "Partial", "Paid", "Overdue"] as const;

export function InvoicingCapabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding relative overflow-hidden bg-white">
      <div className="container-site relative">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Key capabilities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Everything you need to invoice with confidence.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Branding
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">
              Invoices that look like your business
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Logo, colour theme, and customer details on every branded PDF.
            </p>
            <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image
                src={homeImages.features.invoice}
                alt="Branded Modufy invoice preview"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 50vw, 40vw"
              />
            </div>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-3 xl:row-span-2" delay={0.06}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
              Visibility
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">Know exactly what is happening</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Track draft through paid, and spot overdue invoices early.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {STATUSES.map((status, index) => (
                <motion.span
                  key={status}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    status === "Paid"
                      ? "bg-brand-leaf-green text-white"
                      : "border border-border bg-white text-[#1a2744]"
                  }`}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, index % 2 === 0 ? -3 : 3, 0],
                        }
                  }
                  transition={{ duration: 3.2 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {status}
                </motion.span>
              ))}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#efece6]">
              <motion.div
                className="h-full rounded-full bg-brand-leaf-green"
                initial={reduceMotion ? { width: "100%" } : { width: "12%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.1}>
            <MessageActions />
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Send invoices anywhere</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              WhatsApp, SMS, email, or a shareable link.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.14}>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-[#faf8f5] p-2">
                <Quote className="h-4 w-4 text-brand-tangerine" />
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded-lg border border-brand-leaf-green/30 bg-brand-leaf-green/10 p-2">
                <FileText className="h-4 w-4 text-brand-leaf-green" />
              </span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#1a2744]">Quotes become invoices</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Convert a proforma to an invoice in one click.
            </p>
          </CapabilityShell>

          <CapabilityShell className="xl:col-span-2" delay={0.18}>
            <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src={homeImages.features.payments}
                alt="Payment tracking in Modufy"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 50vw, 20vw"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1a2744]">Multi-currency ready</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Invoice and record payments in the currencies your customers use.
            </p>
          </CapabilityShell>

          <CapabilityShell className="md:col-span-2 xl:col-span-6" delay={0.22}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-brand-leaf-green">
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Accounts sync</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-[#1a2744]">
                  Every payment updates your books
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Multi-currency invoicing and payment recording: posted straight into Accounting &
                  Finance. No duplicate entry.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-[#1a2744] px-5 py-4 text-white shadow-lg">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Latest payment
                </p>
                <p className="mt-1 text-2xl font-bold">$2,484.00</p>
                <p className="mt-1 text-xs text-brand-leaf-green">Synced to ledger · just now</p>
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

function MessageActions() {
  const actions = [
    { icon: MessageCircle, label: "WhatsApp" },
    { icon: Phone, label: "SMS" },
    { icon: Mail, label: "Email" },
    { icon: Link2, label: "Link" },
  ] as const;

  return (
    <div className="flex gap-2">
      {actions.map(({ icon: Icon, label }) => (
        <span
          key={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-[#faf8f5] text-[#1a2744]"
        >
          <Icon className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}
