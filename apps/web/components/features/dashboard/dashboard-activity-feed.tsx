"use client";

import Link from "next/link";
import {
  ShoppingCart,
  CreditCard,
  FileText,
  Bell,
  ArrowDownLeft,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { formatMoney, formatExpenseCategory, formatSaleDate } from "@/lib/format";
import { cashInClass, cashOutClass, cashOutDotClass, cashOutRingClass } from "@/lib/chart-colors";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Expense, Invoice, Notification, Sale } from "@/types/api";

export type ActivityEntry = {
  id: string;
  kind: "sale" | "expense" | "invoice" | "notification";
  title: string;
  detail: string;
  amount?: number;
  currency: string;
  at: string;
  href: string;
  tone: "in" | "out" | "due" | "info";
};

function relativeWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatSaleDate(iso);
}

function buildActivities(
  sales: Sale[],
  expenses: Expense[],
  invoices: Invoice[],
  notifications: Notification[],
  currency: string
): ActivityEntry[] {
  const items: ActivityEntry[] = [];

  for (const sale of sales) {
    const pay = paymentMethodMeta(sale.payment_method);
    items.push({
      id: `sale-${sale.id}`,
      kind: "sale",
      title: sale.lines[0]?.description ?? "Sale",
      detail: `${sale.customer_name ?? "Walk-in"} · ${pay?.label ?? sale.payment_method}`,
      amount: sale.total,
      currency: sale.currency || currency,
      at: sale.sale_date,
      href: `/sales/${sale.id}`,
      tone: "in",
    });
  }

  for (const exp of expenses) {
    items.push({
      id: `exp-${exp.id}`,
      kind: "expense",
      title: formatExpenseCategory(exp.category),
      detail: exp.note?.trim() || "Expense logged",
      amount: exp.amount,
      currency: exp.currency || currency,
      at: exp.expense_date,
      href: `/expenses/${exp.id}/edit`,
      tone: "out",
    });
  }

  for (const inv of invoices) {
    if (inv.status === "draft") continue;
    const due = inv.amount_due ?? 0;
    if (due > 0 && ["sent", "partial", "overdue"].includes(inv.status)) {
      items.push({
        id: `inv-${inv.id}`,
        kind: "invoice",
        title: inv.number,
        detail: `${inv.customer_name ?? "Customer"} · ${inv.status}`,
        amount: due,
        currency: inv.currency || currency,
        at: inv.created_at,
        href: `/invoices/${inv.id}`,
        tone: "due",
      });
    }
  }

  for (const n of notifications) {
    items.push({
      id: `n-${n.id}`,
      kind: "notification",
      title: n.title,
      detail: n.body,
      at: n.created_at,
      href: "/dashboard",
      tone: "info",
      currency,
    });
  }

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 14);
}

const toneStyles = {
  in: {
    icon: ArrowDownLeft,
    dot: "bg-primary",
    ring: "border-primary/20 bg-primary/10 text-primary",
  },
  out: {
    icon: ArrowUpRight,
    dot: cashOutDotClass,
    ring: cashOutRingClass,
  },
  due: {
    icon: AlertCircle,
    dot: "bg-blue-500",
    ring: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  info: {
    icon: Bell,
    dot: "bg-muted-foreground",
    ring: "border-border bg-muted text-muted-foreground",
  },
};

const kindIcon = {
  sale: ShoppingCart,
  expense: CreditCard,
  invoice: FileText,
  notification: Bell,
};

type DashboardActivityFeedProps = {
  sales: Sale[];
  expenses: Expense[];
  invoices: Invoice[];
  notifications: Notification[];
  currency: string;
  loading?: boolean;
};

export function DashboardActivityFeed({
  sales,
  expenses,
  invoices,
  notifications,
  currency,
  loading,
}: DashboardActivityFeedProps) {
  const activities = buildActivities(
    sales,
    expenses,
    invoices,
    notifications,
    currency
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed bg-muted/15">
        <div className="rounded-full bg-muted p-4 mb-3">
          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No recent activity</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Sales, expenses, invoices, and alerts from the last 7 days show up here.
        </p>
        <Link
          href="/sales/new"
          className="mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Record your first sale →
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="absolute left-[17px] top-2 bottom-2 w-px bg-border"
        aria-hidden
      />
      <ul className="space-y-1">
        {activities.map((item, index) => {
          const style = toneStyles[item.tone];
          const KindIcon = kindIcon[item.kind];
          const ToneIcon = style.icon;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "flex gap-3 rounded-xl px-2 py-3 -mx-2 transition-colors hover:bg-muted/50 group",
                  index === 0 && "bg-muted/20"
                )}
              >
                <div className="relative z-10 shrink-0">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border",
                      style.ring
                    )}
                  >
                    <KindIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    {item.amount !== undefined && item.tone !== "info" && (
                      <p
                        className={cn(
                          "text-sm font-semibold tabular-nums shrink-0",
                          item.tone === "in" && cashInClass,
                          item.tone === "out" && cashOutClass,
                          item.tone === "due" && "text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {item.tone === "out" ? "−" : item.tone === "due" ? "" : "+"}
                        {formatMoney(item.amount, item.currency)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {item.detail}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                    <ToneIcon className="h-3 w-3 shrink-0" />
                    {relativeWhen(item.at)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
