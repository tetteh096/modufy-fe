"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, ClipboardList, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PurchaseOrder, POStatus } from "@/types/api";
import { tableRowMenuButtonClass } from "@/components/shared/table-row-actions";
import { cn } from "@/lib/utils";

const statusConfig: Record<POStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300" },
  partial: { label: "Partial", className: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
  received: { label: "Received", className: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground line-through" },
};

function PORow({ po }: { po: PurchaseOrder }) {
  const queryClient = useQueryClient();
  const status = statusConfig[po.status];

  const markSentMutation = useMutation({
    mutationFn: () => inventoryApi.purchaseOrders.update(po.id, { status: "sent" }),
    onSuccess: () => {
      toast.success("Marked as sent");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/40 rounded-lg transition-colors group">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <ClipboardList className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/inventory/purchase-orders/${po.id}`} className="font-semibold text-sm hover:text-primary">
          {po.number}
        </Link>
        <p className="text-xs text-muted-foreground">
          {po.supplier_name} · {po.lines.length} item{po.lines.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-sm">{po.currency} {po.total.toFixed(2)}</p>
        {po.expected_at && (
          <p className="text-xs text-muted-foreground">
            Due {new Date(po.expected_at).toLocaleDateString()}
          </p>
        )}
      </div>
      <Badge className={cn("text-xs border-0 shrink-0 hidden sm:inline-flex", status.className)}>
        {status.label}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className={tableRowMenuButtonClass}
              aria-label="Purchase order actions"
            />
          }
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/inventory/purchase-orders/${po.id}`} />}>
            View
          </DropdownMenuItem>
          {po.status === "draft" && (
            <DropdownMenuItem onClick={() => markSentMutation.mutate()}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as sent
            </DropdownMenuItem>
          )}
          {(po.status === "sent" || po.status === "partial") && (
            <DropdownMenuItem render={<Link href={`/inventory/purchase-orders/${po.id}`} />}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Receive stock
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type FilterTab = "all" | POStatus;

export default function PurchaseOrdersPage() {
  const [filter, setFilter] = useState<FilterTab>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["purchase-orders", filter],
    queryFn: () => inventoryApi.purchaseOrders.list(filter !== "all" ? { status: filter } : {}),
  });

  const pos = data?.purchase_orders ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description={total > 0 ? `${total} order${total !== 1 ? "s" : ""}` : "Order stock from suppliers"}
        action={
          <Button render={<Link href="/inventory/purchase-orders/new" />} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New PO
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b overflow-x-auto">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
              <TabsList className="h-8">
                {(["all", "draft", "sent", "partial", "received"] as FilterTab[]).map((tab) => (
                  <TabsTrigger key={tab} value={tab} className="text-xs capitalize h-7 px-3">
                    {tab === "all" ? "All" : statusConfig[tab as POStatus]?.label ?? tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : pos.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8" />}
              title={filter !== "all" ? `No ${filter} orders` : "No purchase orders yet"}
              description={filter !== "all" ? "No orders match this filter." : "Create a purchase order to track stock coming from a supplier."}
              action={
                filter === "all" ? (
                  <Button render={<Link href="/inventory/purchase-orders/new" />} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create first PO
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="divide-y">
              {pos.map((po) => <PORow key={po.id} po={po} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
