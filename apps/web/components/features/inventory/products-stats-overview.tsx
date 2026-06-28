"use client";

import { AlertTriangle, Layers, Package, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
  accent,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  loading?: boolean;
  accent?: "primary" | "warning" | "muted";
}) {
  const iconClass =
    accent === "warning"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : accent === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start gap-4 p-5">
        <div className={cn("rounded-lg p-2.5 shrink-0", iconClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <p className="text-xl font-bold tracking-tight mt-0.5 truncate">{value}</p>
          )}
          {hint && !loading ? <p className="text-xs text-muted-foreground mt-1">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsStatsOverview({
  totalProducts,
  activeProducts,
  lowStockCount,
  categoryCount,
  stockValue,
  currency = "GHS",
  loading,
}: {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  categoryCount: number;
  stockValue: number;
  currency?: string;
  loading?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Products"
        value={String(totalProducts)}
        hint={`${activeProducts} active · ${categoryCount} categories`}
        icon={Package}
        loading={loading}
        accent="primary"
      />
      <StatCard
        title="Low stock"
        value={String(lowStockCount)}
        hint={lowStockCount > 0 ? "Below alert threshold" : "All levels healthy"}
        icon={AlertTriangle}
        loading={loading}
        accent={lowStockCount > 0 ? "warning" : "muted"}
      />
      <StatCard
        title="Stock value"
        value={formatMoney(stockValue, currency)}
        hint="At cost price"
        icon={Wallet}
        loading={loading}
      />
      <StatCard
        title="Categories"
        value={String(categoryCount)}
        hint="Product groupings"
        icon={Layers}
        loading={loading}
      />
    </div>
  );
}
