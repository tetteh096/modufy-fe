"use client";

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
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-xs md:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {formatTodayDate()}
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg">
            {businessName ? (
              <>
                Here&apos;s how <span className="font-medium text-foreground">{businessName}</span> is
                doing today: cash in, spend, and what needs your attention.
              </>
            ) : (
              "Here's your business at a glance: cash in, spend, and what needs attention."
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
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
    </div>
  );
}
