"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package, RefreshCw, Phone } from "lucide-react";
import { inventoryApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { InventoryItem } from "@/types/api";
import { cn } from "@/lib/utils";

function LowStockRow({ item }: { item: InventoryItem }) {
  const pct = item.low_stock_threshold > 0
    ? Math.min(100, (item.stock_qty / item.low_stock_threshold) * 100)
    : 0;

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      </div>

      <div className="flex-1 min-w-0">
        <Link href={`/inventory/${item.id}`} className="font-semibold text-sm hover:text-primary">
          {item.name}
        </Link>
        <p className="text-xs text-muted-foreground">{item.category || "Uncategorized"}</p>
        <div className="mt-1.5 h-1.5 w-full max-w-[160px] rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", pct < 25 ? "bg-red-500" : "bg-amber-500")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-amber-600 dark:text-amber-400">
          {item.stock_qty.toFixed(2)} <span className="font-normal text-xs">{item.unit}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Threshold: {item.low_stock_threshold} {item.unit}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          render={<Link href={`/inventory/${item.id}?restock=1`} />}
          variant="outline"
          size="sm"
          className="gap-1.5 hidden sm:flex"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Restock
        </Button>
        {item.supplier_name && (
          <Button variant="ghost" size="sm" className="gap-1.5 hidden md:flex text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            {item.supplier_name}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function LowStockPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: inventoryApi.lowStock,
  });

  const items = data?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Low Stock"
        description={items.length > 0 ? `${items.length} product${items.length !== 1 ? "s" : ""} below threshold` : "Stock alerts"}
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Package className="h-8 w-8" />}
              title="All stock levels are healthy"
              description="No products are currently below their low-stock threshold."
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <LowStockRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
