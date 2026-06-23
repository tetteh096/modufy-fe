"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatMoney, formatSaleDate } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Sale } from "@/types/api";

type DashboardRecentSalesProps = {
  sales: Sale[];
  currency: string;
  loading?: boolean;
};

export function DashboardRecentSales({ sales, currency, loading }: DashboardRecentSalesProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const recent = sales.slice(0, 5);

  if (recent.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No sales in this period yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {recent.map((sale) => {
          const title = sale.lines[0]?.description ?? "Sale";
          const pay = paymentMethodMeta(sale.payment_method);
          return (
            <li key={sale.id}>
              <Link
                href={`/sales/${sale.id}`}
                className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/40 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <span className="text-xs font-bold uppercase">
                    {title.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatMoney(sale.total, sale.currency || currency)} ·{" "}
                    {pay?.label ?? sale.payment_method}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 bg-primary/15 text-primary border-0">
                  Sold
                </Badge>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between pt-1">
        <p className="text-[10px] text-muted-foreground">
          Latest · {formatSaleDate(recent[0]?.sale_date ?? "")}
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/sales" />}
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
