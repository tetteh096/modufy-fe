"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  ExternalLink,
  Minus,
  Package,
  Plus,
  TrendingUp,
} from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { InventoryItem } from "@/types/api";
import { cn } from "@/lib/utils";

type ProductQuickAdjustSheetProps = {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const QUICK_DELTAS = [1, 5, 10, 25] as const;

export function ProductQuickAdjustSheet({ item, open, onOpenChange }: ProductQuickAdjustSheetProps) {
  const queryClient = useQueryClient();
  const [stockQty, setStockQty] = useState("");
  const [addStockQty, setAddStockQty] = useState("");
  const [stockNote, setStockNote] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [lowThreshold, setLowThreshold] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (!item) return;
    setStockQty(String(item.stock_qty));
    setAddStockQty("");
    setStockNote("");
    setSellPrice(String(item.sell_price));
    setCostPrice(item.cost_price > 0 ? String(item.cost_price) : "");
    setLowThreshold(String(item.low_stock_threshold));
    setStatus(item.status);
  }, [item]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const adjustMutation = useMutation({
    mutationFn: (newQty: number) =>
      inventoryApi.adjust(item!.id, {
        new_qty: newQty,
        note: stockNote.trim() || "Quick adjustment",
      }),
    onSuccess: (updated) => {
      toast.success("Stock updated");
      setStockQty(String(updated.stock_qty));
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const restockMutation = useMutation({
    mutationFn: (qty: number) =>
      inventoryApi.restock(item!.id, {
        qty,
        note: stockNote.trim() || "Quick restock",
      }),
    onSuccess: (updated) => {
      toast.success("Stock added");
      setStockQty(String(updated.stock_qty));
      setAddStockQty("");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      inventoryApi.update(item!.id, {
        sell_price: parseFloat(sellPrice),
        cost_price: costPrice ? parseFloat(costPrice) : 0,
        low_stock_threshold: parseFloat(lowThreshold) || 0,
        status,
      }),
    onSuccess: () => {
      toast.success("Product details saved");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (!item) return null;

  const unit = item.unit || "units";
  const parsedStock = parseFloat(stockQty);
  const stockChanged =
    !Number.isNaN(parsedStock) && parsedStock !== item.stock_qty && parsedStock >= 0;
  const busy =
    updateMutation.isPending || adjustMutation.isPending || restockMutation.isPending;

  function bumpStock(delta: number) {
    const current = Number.isNaN(parsedStock) ? item!.stock_qty : parsedStock;
    setStockQty(String(Math.max(0, current + delta)));
  }

  function saveStock() {
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      toast.error("Enter a valid stock quantity");
      return;
    }
    if (parsedStock === item!.stock_qty) {
      toast.message("Stock is already at this level");
      return;
    }
    adjustMutation.mutate(parsedStock);
  }

  function addStock() {
    const qty = parseFloat(addStockQty);
    if (Number.isNaN(qty) || qty <= 0) {
      toast.error("Enter how many to add");
      return;
    }
    restockMutation.mutate(qty);
  }

  const marginPct =
    item.cost_price > 0 && parseFloat(sellPrice) > 0
      ? ((parseFloat(sellPrice) - parseFloat(costPrice || "0")) / parseFloat(sellPrice)) * 100
      : item.margin_pct;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="space-y-0 border-b bg-muted/20 px-5 pb-5 pt-5 text-left">
          <div className="flex gap-4 pr-8">
            <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-background shadow-sm">
              <InventoryItemPhoto
                src={item.photo_url}
                name={item.name}
                type="product"
                iconClassName="h-8 w-8"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <SheetTitle className="text-lg leading-tight">{item.name}</SheetTitle>
                <SheetDescription className="mt-1">
                  {item.sku ? `SKU ${item.sku}` : item.category || "Product"}
                </SheetDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium">
                  {formatMoney(item.sell_price, item.currency)}
                </span>
                {item.is_low_stock ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3" />
                    Low stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Package className="h-3 w-3" />
                    In stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Stock stepper */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Stock level</h3>
              <span className="text-xs text-muted-foreground">
                Alert below {item.low_stock_threshold} {unit}
              </span>
            </div>

            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-full"
                  disabled={busy || parsedStock <= 0}
                  onClick={() => bumpStock(-1)}
                  aria-label="Decrease stock by 1"
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <div className="min-w-[7rem] flex-1 max-w-[9rem] text-center">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    className={cn(
                      "h-14 border-0 bg-transparent text-center text-3xl font-bold tabular-nums shadow-none focus-visible:ring-0",
                      stockChanged && "text-primary",
                    )}
                    aria-label="Stock quantity"
                  />
                  <p className="text-xs text-muted-foreground">{unit}</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-full"
                  disabled={busy}
                  onClick={() => bumpStock(1)}
                  aria-label="Increase stock by 1"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {QUICK_DELTAS.map((delta) => (
                  <Button
                    key={`plus-${delta}`}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 min-w-[3.25rem] rounded-full text-xs font-semibold"
                    disabled={busy}
                    onClick={() => bumpStock(delta)}
                  >
                    +{delta}
                  </Button>
                ))}
                {QUICK_DELTAS.map((delta) => (
                  <Button
                    key={`minus-${delta}`}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 min-w-[3.25rem] rounded-full text-xs font-semibold"
                    disabled={busy || parsedStock - delta < 0}
                    onClick={() => bumpStock(-delta)}
                  >
                    −{delta}
                  </Button>
                ))}
              </div>

              <Button
                type="button"
                className="mt-4 w-full"
                disabled={busy || !stockChanged}
                onClick={saveStock}
              >
                {adjustMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" />
                    Updating stock…
                  </span>
                ) : stockChanged ? (
                  `Update stock to ${parsedStock} ${unit}`
                ) : (
                  "Stock is up to date"
                )}
              </Button>
            </div>

            <div className="rounded-xl border border-dashed p-4 space-y-3">
              <div>
                <p className="text-sm font-medium">Received more stock?</p>
                <p className="text-xs text-muted-foreground">
                  Add a delivery without replacing your current count.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0.001"
                  step="1"
                  placeholder={`Add ${unit}`}
                  value={addStockQty}
                  onChange={(e) => setAddStockQty(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || !addStockQty}
                  onClick={addStock}
                >
                  {restockMutation.isPending ? "Adding…" : "Add"}
                </Button>
              </div>
              <Input
                placeholder="Note (optional) — e.g. Supplier delivery"
                value={stockNote}
                onChange={(e) => setStockNote(e.target.value)}
              />
            </div>
          </section>

          <Separator />

          {/* Pricing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Pricing & status</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="adj-sell-price">Sell price ({item.currency})</Label>
                <Input
                  id="adj-sell-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adj-cost-price">Cost price</Label>
                <Input
                  id="adj-cost-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
              </div>
            </div>

            {!Number.isNaN(marginPct) && marginPct > 0 ? (
              <p className="text-xs text-muted-foreground">
                Margin: <span className="font-medium text-foreground">{marginPct.toFixed(0)}%</span>
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="adj-low-threshold">Low stock alert</Label>
                <Input
                  id="adj-low-threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={lowThreshold}
                  onChange={(e) => setLowThreshold(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as string)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={busy || !sellPrice}
              onClick={() => updateMutation.mutate()}
            >
              {updateMutation.isPending ? "Saving…" : "Save pricing & status"}
            </Button>
          </section>

          <Button
            nativeButton={false}
            variant="ghost"
            className="w-full text-muted-foreground"
            render={<Link href={`/inventory/${item.id}/edit`} />}
          >
            Open full product editor
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>

        <SheetFooter className="border-t bg-muted/10 px-5 py-4 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Done
          </Button>
          <p className="text-xs text-muted-foreground self-center hidden sm:block">
            Stock saves separately from pricing above
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
