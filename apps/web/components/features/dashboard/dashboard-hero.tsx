"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  CreditCard,
  FileText,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { glassHero } from "@/lib/glass-styles";
import { dashboardImages } from "@/lib/dashboard-images";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTodayDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

type DashboardHeroProps = {
  userName?: string;
  businessName?: string;
  className?: string;
};

export function DashboardHero({ userName, businessName, className }: DashboardHeroProps) {
  const firstName = userName?.split(/\s+/)[0];

  return (
    <div className={cn(glassHero, "relative overflow-hidden p-0", className)}>
      <div className="grid lg:grid-cols-[1fr_min(42%,320px)]">
        <div className="relative z-10 space-y-5 p-5 md:p-6">
          <div className="space-y-1.5 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{formatTodayDate()}</p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              {getGreeting()}
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="max-w-lg text-sm text-muted-foreground md:text-base">
              {businessName ? (
                <>
                  Here&apos;s how{" "}
                  <span className="font-medium text-foreground">{businessName}</span> is doing — cash
                  in, spend, and what needs your attention.
                </>
              ) : (
                "Your business at a glance: cash in, spend, and what needs attention."
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/sales/new" />}
              size="sm"
              className="gap-1.5"
            >
              <ShoppingCart className="h-4 w-4" />
              Record sale
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/expenses/new" />}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <CreditCard className="h-4 w-4" />
              Log expense
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/invoices/new" />}
              size="sm"
              variant="outline"
              className="gap-1.5 hidden sm:inline-flex"
            >
              <FileText className="h-4 w-4" />
              Invoice
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/customers/new" />}
              size="sm"
              variant="ghost"
              className="gap-1.5 hidden md:inline-flex"
            >
              <UserPlus className="h-4 w-4" />
              Customer
            </Button>
          </div>
        </div>

        <div className="relative hidden min-h-[180px] lg:block">
          <Image
            src={dashboardImages.hero}
            alt=""
            fill
            className="object-cover"
            sizes="320px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color-mix(in_oklch,var(--glass-bg)_92%,transparent)] via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
