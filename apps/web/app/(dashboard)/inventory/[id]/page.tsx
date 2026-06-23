"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Pencil,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StockMovement } from "@/types/api";
import { cn } from "@/lib/utils";
import { VariantsSection } from "@/components/features/inventory/variants-section";
import { InventoryDetailsPanel } from "@/components/features/inventory/inventory-details-panel";
import { ServiceDetailView } from "@/components/features/inventory/service-detail-view";

function movementIcon(type: string) {
  if (["restock", "transfer_in"].includes(type)) return <ArrowDown className="h-3.5 w-3.5 text-emerald-500" />;
  if (["sale", "spoilage", "loss", "transfer_out"].includes(type)) return <ArrowUp className="h-3.5 w-3.5 text-red-500" />;
  return <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />;
}

const movementLabel: Record<string, string> = {
  sale: "Sale",
  restock: "Restock",
  spoilage: "Spoilage",
  loss: "Loss",
  adjustment: "Adjustment",
  transfer_in: "Transfer in",
  transfer_out: "Transfer out",
};

function MovementRow({ m }: { m: StockMovement }) {
  return (
    <div className="flex items-center gap-3 py-2.5 text-sm">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
        {movementIcon(m.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-xs">{movementLabel[m.type] ?? m.type}</p>
        {m.note && <p className="text-xs text-muted-foreground truncate">{m.note}</p>}
      </div>
      <p className={cn("font-semibold text-xs tabular-nums shrink-0",
        m.qty_change > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
        {m.qty_change > 0 ? "+" : ""}{m.qty_change.toFixed(2)}
      </p>
      <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">→ {m.qty_after.toFixed(2)}</p>
      <p className="text-xs text-muted-foreground shrink-0 hidden md:block">
        {new Date(m.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}

function RestockDialog({ itemId, unit, onClose }: { itemId: string; unit: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: () => inventoryApi.restock(itemId, { qty: parseFloat(qty), cost_price: cost ? parseFloat(cost) : undefined, note }),
    onSuccess: () => {
      toast.success("Stock added");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock</DialogTitle>
          <DialogDescription>Add stock received from supplier or production.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Quantity ({unit || "units"})</Label>
            <Input type="number" min="0.001" step="0.001" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label>Cost price (optional)</Label>
            <Input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-1.5">
            <Label>Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Delivery from supplier" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={!qty || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Add stock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WriteOffDialog({ itemId, unit, onClose }: { itemId: string; unit: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [qty, setQty] = useState("");
  const [type, setType] = useState<"spoilage" | "loss">("spoilage");
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: () => inventoryApi.writeOff(itemId, { type, qty: parseFloat(qty), note }),
    onSuccess: () => {
      toast.success("Write-off recorded");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write-off stock</DialogTitle>
          <DialogDescription>Record damaged, expired, or lost stock.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "spoilage" | "loss")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="spoilage">Spoilage (damaged/expired)</SelectItem>
                <SelectItem value="loss">Loss (stolen/missing)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Quantity ({unit || "units"})</Label>
            <Input type="number" min="0.001" step="0.001" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Reason for write-off" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => mutation.mutate()} disabled={!qty || mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Write off"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function InventoryItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showRestock, setShowRestock] = useState(false);
  const [showWriteOff, setShowWriteOff] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.get(id),
  });

  const { data: movementsData } = useQuery({
    queryKey: ["inventory", id, "movements"],
    queryFn: () => inventoryApi.movements(id),
    enabled: item?.type === "product",
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }
  if (!item) return null;

  const isProduct = item.type === "product";
  const movements = movementsData?.movements ?? [];

  if (!isProduct) {
    return (
      <div>
        <PageHeader
          title={item.name}
          description={item.category || "Service"}
          action={
            <div className="flex gap-2 flex-wrap">
              <Button nativeButton={false} render={<Link href={`/inventory/${id}/edit`} />} size="sm" className="gap-1.5">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/inventory/services" />}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                All services
              </Button>
            </div>
          }
        />
        <ServiceDetailView item={item} id={id} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={item.name}
        description={item.category || (isProduct ? "Product" : "Service")}
        action={
          <div className="flex gap-2 flex-wrap">
            {isProduct && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowRestock(true)} className="gap-1.5">
                  <RefreshCw className="h-4 w-4" />
                  Restock
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowWriteOff(true)} className="gap-1.5 text-destructive hover:text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Write-off
                </Button>
              </>
            )}
            <Button nativeButton={false} render={<Link href={`/inventory/${id}/edit`} />} size="sm" className="gap-1.5">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={isProduct ? "/inventory" : "/inventory/services"} />}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Key metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sell price</p>
                {item.discounted_price > 0 ? (
                  <div className="mt-1">
                    <p className="text-2xl font-bold text-primary">
                      {item.currency} {item.discounted_price.toFixed(2)}
                    </p>
                    <p className="text-sm line-through text-muted-foreground">
                      {item.currency} {item.sell_price.toFixed(2)}
                    </p>
                    <p className="text-xs font-medium text-primary mt-0.5">
                      {item.discount_type === "percent"
                        ? `${item.discount_value}% off`
                        : `${item.currency} ${item.discount_value.toFixed(2)} off`}
                    </p>
                    {item.discount_ends_at ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        Offer ends {new Date(item.discount_ends_at).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-2xl font-bold mt-1">
                    {item.currency} {item.sell_price.toFixed(2)}
                  </p>
                )}
                {item.pricing_type === "hourly" && <p className="text-xs text-muted-foreground">per hour</p>}
              </CardContent>
            </Card>
            {isProduct ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Stock</p>
                  <p className={cn("text-2xl font-bold mt-1", item.is_low_stock && "text-amber-600 dark:text-amber-400")}>
                    {item.stock_qty.toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{item.unit}</span>
                  </p>
                  {item.is_low_stock && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" /> Below threshold
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                  <p className="text-2xl font-bold mt-1">{item.duration_mins}<span className="text-sm font-normal text-muted-foreground ml-1">min</span></p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Margin</p>
                <p className="text-2xl font-bold mt-1">{item.margin_pct.toFixed(1)}%</p>
                {item.cost_price > 0 && <p className="text-xs text-muted-foreground">Cost: {item.currency} {item.cost_price.toFixed(2)}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Variants (products only) */}
          {isProduct && (
            <VariantsSection
              productId={id}
              currency={item.currency}
              basePrice={item.sell_price}
              productStockQty={item.stock_qty}
            />
          )}

          {/* Stock history */}
          {isProduct && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stock history</CardTitle>
              </CardHeader>
              <CardContent>
                {movements.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No stock movements yet.</p>
                ) : (
                  <div className="divide-y">
                    {movements.map((m) => <MovementRow key={m.id} m={m} />)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <InventoryDetailsPanel item={item} />
      </div>

      {showRestock && (
        <RestockDialog itemId={id} unit={item.unit ?? ""} onClose={() => setShowRestock(false)} />
      )}
      {showWriteOff && (
        <WriteOffDialog itemId={id} unit={item.unit ?? ""} onClose={() => setShowWriteOff(false)} />
      )}
    </div>
  );
}
