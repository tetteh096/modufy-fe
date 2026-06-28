"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, MessageCircle, Percent } from "lucide-react";
import { dashboardImages } from "@/lib/dashboard-images";
import { cn } from "@/lib/utils";

type DashboardSpotlightRowProps = {
  customerCount: number;
  saleCount: number;
  periodLabel: string;
  outstandingAmount?: string;
  className?: string;
};

export function DashboardSpotlightRow({
  customerCount,
  saleCount,
  periodLabel,
  outstandingAmount,
  className,
}: DashboardSpotlightRowProps) {
  const promoTitle = outstandingAmount
    ? `Collect ${outstandingAmount} in outstanding invoices`
    : "Send professional invoices in minutes";

  const promoHref = outstandingAmount ? "/invoices" : "/invoices/new";
  const promoCta = outstandingAmount ? "View invoices" : "Create invoice";

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      <Link
        href={promoHref}
        className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-5 text-primary-foreground shadow-md transition hover:brightness-105"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-lime-950">
          {outstandingAmount ? <FileText className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
        </span>
        <div>
          <p className="text-lg font-bold leading-snug sm:text-xl">{promoTitle}</p>
          <p className="mt-2 text-sm text-primary-foreground/80">{promoCta} →</p>
        </div>
        <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 opacity-0 transition group-hover:opacity-100" />
      </Link>

      <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-border/60 shadow-sm">
        <Image
          src={dashboardImages.team}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-secondary-foreground">
          <div className="flex gap-6">
            <div>
              <p className="text-2xl font-bold tabular-nums">{customerCount}+</p>
              <p className="text-xs opacity-75">customers</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{saleCount}</p>
              <p className="text-xs opacity-75">sales · {periodLabel.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/communications"
        className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-secondary p-5 text-secondary-foreground shadow-sm transition hover:brightness-110"
      >
        <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/10">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        <div className="relative z-10 mt-auto">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <MessageCircle className="h-5 w-5" />
          </span>
          <p className="text-lg font-semibold leading-snug">Reach your customers</p>
          <p className="mt-1 text-sm opacity-70">Send SMS and email from one inbox.</p>
        </div>
        <Image
          src={dashboardImages.support}
          alt=""
          fill
          className="object-cover opacity-20 transition group-hover:opacity-30"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-secondary/40" />
      </Link>
    </div>
  );
}
