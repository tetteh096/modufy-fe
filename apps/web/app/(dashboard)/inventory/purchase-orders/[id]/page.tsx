"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Truck, Package } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { PurchaseOrder, POLine } from "@/types/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300" },
  partial: { label: "Partial", className: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
  received: { label: "Received", className: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
};

function ReceiveDialog({ po, onClose }: { po: PurchaseOrder; onClose: () => void }) {
  const queryClient = useQueryClient();
  const pendingLines = po.lines.filter((l) => l.qty_received < l.qty_ordered);
  const [quantities, setQuantities] = useState<Record<string, string>>(
    Object.fromEntries(pendingLines.map((l) => [l.id, String(l.qty_ordered - l.qty_received)]))
  );
  const [costs, setCosts] = useState<Record<string, string>>(
    Object.fromEntries(pendingLines.map((l) => [l.id, String(l.unit_cost)]))
  );

  const mutation = useMutation({
    mutationFn: () =>
      inventoryApi.purchaseOrders.receive(po.id, {
        lines: pendingLines
          .filter((l) => parseFloat(quantities[l.id] || "0") > 0)
          .map((l) => ({
            line_id: l.id,
            qty_received: parseFloat(quantities[l.id] || "0"),
            cost_price: parseFloat(costs[l.id] || "0"),
          })),
      }),
    onSuccess: () => {
      toast.success("Stock received and inventory updated");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Receive stock — {po.number}</DialogTitle>
          <DialogDescription>Enter quantities received. Stock levels will be updated immediately.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {pendingLines.map((line) => (
            <div key={line.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
              <div>
                <p className="text-sm font-medium">{line.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  Ordered: {line.qty_ordered} — Received so far: {line.qty_received}
                </p>
              </div>
              <div className="space-y-1 w-24">
                <Label className="text-xs">Qty</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  max={line.qty_ordered - line.qty_received}
                  value={quantities[line.id] ?? ""}
                  onChange={(e) => setQuantities((q) => ({ ...q, [line.id]: e.target.value }))}
                />
              </div>
              <div className="space-y-1 w-24">
                <Label className="text-xs">Cost</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costs[line.id] ?? ""}
                  onChange={(e) => setCosts((c) => ({ ...c, [line.id]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Receiving…" : "Confirm receipt"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function POLineRow({ line }: { line: POLine }) {
  const pct = line.qty_ordered > 0 ? (line.qty_received / line.qty_ordered) * 100 : 0;
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Package className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{line.product_name}</p>
        <div className="mt-1 h-1.5 w-full max-w-[120px] rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full", pct >= 100 ? "bg-primary" : "bg-amber-500")} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="text-right shrink-0 text-sm">
        <p>{line.qty_received} / {line.qty_ordered}</p>
        <p className="text-xs text-muted-foreground">{line.unit_cost.toFixed(2)} each</p>
      </div>
      <p className="font-semibold text-sm shrink-0">{line.total.toFixed(2)}</p>
    </div>
  );
}

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showReceive, setShowReceive] = useState(false);

  const { data: po, isLoading } = useQuery({
    queryKey: ["purchase-orders", id],
    queryFn: () => inventoryApi.purchaseOrders.get(id),
  });

  const queryClient = useQueryClient();
  const markSentMutation = useMutation({
    mutationFn: () => inventoryApi.purchaseOrders.update(id, { status: "sent" }),
    onSuccess: () => {
      toast.success("Marked as sent");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
  if (!po) return null;

  const status = statusConfig[po.status] ?? statusConfig.draft;
  const canReceive = po.status === "sent" || po.status === "partial";
  const canMarkSent = po.status === "draft";

  return (
    <div>
      <PageHeader
        title={po.number}
        description={`Supplier: ${po.supplier_name}`}
        action={
          <div className="flex gap-2 flex-wrap">
            {canMarkSent && (
              <Button variant="outline" size="sm" onClick={() => markSentMutation.mutate()} disabled={markSentMutation.isPending}>
                Mark as sent
              </Button>
            )}
            {canReceive && (
              <Button size="sm" onClick={() => setShowReceive(true)} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Receive stock
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Line items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {po.lines.map((line) => <POLineRow key={line.id} line={line} />)}
              </div>
              <div className="flex justify-end pt-4 border-t mt-2">
                <p className="font-semibold">Total: {po.currency} {po.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={cn("text-xs border-0", status.className)}>{status.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="text-sm font-medium">{po.supplier_name}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="text-sm">{po.currency}</p>
              </div>
              {po.expected_at && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Expected</p>
                  <p className="text-sm">{new Date(po.expected_at).toLocaleDateString()}</p>
                </div>
              )}
              {po.received_at && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Received</p>
                  <p className="text-sm text-primary">{new Date(po.received_at).toLocaleDateString()}</p>
                </div>
              )}
              {po.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{po.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Button variant="outline" size="sm" className="w-full" render={<Link href="/inventory/purchase-orders" />}>
            <Truck className="mr-2 h-4 w-4" />
            All purchase orders
          </Button>
        </div>
      </div>

      {showReceive && <ReceiveDialog po={po} onClose={() => setShowReceive(false)} />}
    </div>
  );
}
