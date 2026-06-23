"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Palette, Ruler, X, Layers } from "lucide-react";
import { variantsApi, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InventoryColorPhotos } from "@/components/features/inventory/inventory-color-photos";
import type { ProductVariant, CreateVariantRequest, UpdateVariantRequest } from "@/types/api";
import { cn } from "@/lib/utils";

const QUICK_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const QUICK_COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Grey", "Brown", "Navy"];

function variantKey(color: string, size: string) {
  return `${color}::${size}`;
}

function buildCombinations(colors: string[], sizes: string[]) {
  if (colors.length === 0 && sizes.length === 0) return [];
  if (colors.length === 0) return sizes.map((size) => ({ color: "", size }));
  if (sizes.length === 0) return colors.map((color) => ({ color, size: "" }));
  return colors.flatMap((color) => sizes.map((size) => ({ color, size })));
}

function ToggleChip({
  label,
  selected,
  onToggle,
  className,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs border transition-colors",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border text-muted-foreground hover:border-primary/50",
        className,
      )}
    >
      {label}
    </button>
  );
}

// ─── Bulk add sheet ────────────────────────────────────────────────────────────

function VariantBulkSheet({
  productId,
  productStockQty,
  existingVariants,
  baseCurrency,
  open,
  onOpenChange,
}: {
  productId: string;
  productStockQty: number;
  existingVariants: ProductVariant[];
  baseCurrency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [customSize, setCustomSize] = useState("");
  const [stockByKey, setStockByKey] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const existingKeys = useMemo(
    () => new Set(existingVariants.map((v) => variantKey(v.color ?? "", v.size ?? ""))),
    [existingVariants],
  );

  const existingAllocated = useMemo(
    () => existingVariants.reduce((sum, v) => sum + (v.stock_qty ?? 0), 0),
    [existingVariants],
  );

  const combinations = useMemo(() => {
    const combos = buildCombinations(selectedColors, selectedSizes);
    return combos.filter((c) => !existingKeys.has(variantKey(c.color, c.size)));
  }, [selectedColors, selectedSizes, existingKeys]);

  const batchAllocated = useMemo(() => {
    return combinations.reduce((sum, c) => {
      const raw = stockByKey[variantKey(c.color, c.size)] ?? "0";
      return sum + (parseFloat(raw) || 0);
    }, 0);
  }, [combinations, stockByKey]);

  const totalAllocated = existingAllocated + batchAllocated;
  const remaining = Math.max(0, productStockQty - totalAllocated);
  const overAllocated = totalAllocated > productStockQty;

  useEffect(() => {
    if (!open) {
      setSelectedColors([]);
      setSelectedSizes([]);
      setCustomColor("");
      setCustomSize("");
      setStockByKey({});
    }
  }, [open]);

  function toggleColor(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  }

  function addCustomColor() {
    const c = customColor.trim();
    if (!c) return;
    if (!selectedColors.includes(c)) setSelectedColors((prev) => [...prev, c]);
    setCustomColor("");
  }

  function addCustomSize() {
    const s = customSize.trim();
    if (!s) return;
    if (!selectedSizes.includes(s)) setSelectedSizes((prev) => [...prev, s]);
    setCustomSize("");
  }

  function setStock(key: string, value: string) {
    setStockByKey((prev) => ({ ...prev, [key]: value }));
  }

  function distributeEvenly() {
    if (combinations.length === 0) return;
    const pool = Math.max(0, productStockQty - existingAllocated);
    const per = Math.floor(pool / combinations.length);
    const extra = pool - per * combinations.length;
    const next: Record<string, string> = {};
    combinations.forEach((c, i) => {
      const key = variantKey(c.color, c.size);
      next[key] = String(per + (i < extra ? 1 : 0));
    });
    setStockByKey(next);
  }

  async function submit() {
    if (selectedColors.length === 0 && selectedSizes.length === 0) {
      toast.error("Select at least one colour or size");
      return;
    }
    if (combinations.length === 0) {
      toast.error("All selected combinations already exist");
      return;
    }
    if (overAllocated) {
      toast.error(`Stock total (${totalAllocated.toFixed(0)}) exceeds product stock (${productStockQty.toFixed(0)})`);
      return;
    }

    const toCreate = combinations
      .map((c) => {
        const key = variantKey(c.color, c.size);
        const qty = parseFloat(stockByKey[key] ?? "0") || 0;
        return { ...c, stock_qty: qty };
      })
      .filter((c) => c.stock_qty > 0);

    if (toCreate.length === 0) {
      toast.error("Enter stock for at least one combination");
      return;
    }

    setSaving(true);
    try {
      for (const row of toCreate) {
        const body: CreateVariantRequest = {
          color: row.color || undefined,
          size: row.size || undefined,
          stock_qty: row.stock_qty,
        };
        await variantsApi.create(productId, body);
      }
      queryClient.invalidateQueries({ queryKey: ["inventory", productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] });
      toast.success(`${toCreate.length} variant${toCreate.length === 1 ? "" : "s"} added`);
      onOpenChange(false);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <SheetTitle>Add variants</SheetTitle>
              <SheetDescription>
                Select multiple colours and sizes, then set stock for each combination.
                Storefront orders use variant stock — sold-out options are blocked.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div className="rounded-xl border bg-muted/30 p-3 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Product stock pool</span>
              <span className="font-semibold tabular-nums">{productStockQty.toFixed(0)}</span>
            </div>
            {existingAllocated > 0 ? (
              <div className="flex justify-between gap-2 mt-1">
                <span className="text-muted-foreground">Already on variants</span>
                <span className="tabular-nums">{existingAllocated.toFixed(0)}</span>
              </div>
            ) : null}
            <div className="flex justify-between gap-2 mt-1 pt-1 border-t">
              <span className="text-muted-foreground">Remaining to allocate</span>
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  overAllocated ? "text-destructive" : remaining === 0 ? "text-muted-foreground" : "text-primary",
                )}
              >
                {overAllocated ? `−${(totalAllocated - productStockQty).toFixed(0)} over` : remaining.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5" />
              Colours
              {selectedColors.length > 0 ? (
                <Badge variant="secondary" className="text-xs ml-1">{selectedColors.length}</Badge>
              ) : null}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_COLORS.map((c) => (
                <ToggleChip key={c} label={c} selected={selectedColors.includes(c)} onToggle={() => toggleColor(c)} />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="Custom colour…"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomColor())}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomColor}>
                Add
              </Button>
            </div>
            {selectedColors.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedColors.map((c) => (
                  <Badge key={c} variant="outline" className="gap-1 pr-1">
                    {c}
                    <button type="button" onClick={() => toggleColor(c)} className="rounded hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              Sizes
              {selectedSizes.length > 0 ? (
                <Badge variant="secondary" className="text-xs ml-1">{selectedSizes.length}</Badge>
              ) : null}
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SIZES.map((s) => (
                <ToggleChip
                  key={s}
                  label={s}
                  selected={selectedSizes.includes(s)}
                  onToggle={() => toggleSize(s)}
                  className="rounded px-2.5 font-medium"
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="Custom size…"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSize())}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomSize}>
                Add
              </Button>
            </div>
            {selectedSizes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSizes.map((s) => (
                  <Badge key={s} variant="outline" className="gap-1 pr-1">
                    {s}
                    <button type="button" onClick={() => toggleSize(s)} className="rounded hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {combinations.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>
                  Stock per combination
                  <span className="text-muted-foreground font-normal ml-1">({combinations.length} new)</span>
                </Label>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={distributeEvenly}>
                  Split evenly
                </Button>
              </div>
              <div className="rounded-xl border overflow-hidden max-h-[min(50vh,420px)] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="px-3 py-2.5 text-left font-medium">#</th>
                      <th className="px-3 py-2.5 text-left font-medium">Colour</th>
                      <th className="px-3 py-2.5 text-left font-medium">Size</th>
                      <th className="px-3 py-2.5 text-left font-medium">Variant</th>
                      <th className="px-3 py-2.5 text-right font-medium w-28">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {combinations.map((c, index) => {
                      const key = variantKey(c.color, c.size);
                      const label = [c.color, c.size].filter(Boolean).join(" / ") || "Default";
                      const qty = parseFloat(stockByKey[key] ?? "0") || 0;
                      return (
                        <tr key={key} className={qty > 0 ? "bg-primary/[0.03]" : undefined}>
                          <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">{index + 1}</td>
                          <td className="px-3 py-2">
                            {c.color ? (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{c.color}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {c.size ? (
                              <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">{c.size}</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{label}</td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              className="h-8 text-right tabular-nums"
                              value={stockByKey[key] ?? ""}
                              onChange={(e) => setStock(key, e.target.value)}
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="sticky bottom-0 bg-background border-t">
                    <tr className="text-xs">
                      <td colSpan={4} className="px-3 py-2.5 text-muted-foreground">
                        Batch total · {combinations.length} combination{combinations.length === 1 ? "" : "s"}
                      </td>
                      <td className={cn("px-3 py-2.5 text-right font-semibold tabular-nums", overAllocated && "text-destructive")}>
                        {batchAllocated.toFixed(0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                Prices use base ({baseCurrency}) unless you edit a variant later. Only combinations with stock &gt; 0 are created.
              </p>
            </div>
          ) : selectedColors.length > 0 || selectedSizes.length > 0 ? (
            <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 text-center">
              All selected combinations already exist — pick different colours or sizes.
            </p>
          ) : null}
        </div>

        <SheetFooter className="border-t flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving || combinations.length === 0}>
            {saving ? "Adding…" : `Add ${combinations.length} variant${combinations.length === 1 ? "" : "s"}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Edit single variant sheet ─────────────────────────────────────────────────

function VariantEditSheet({
  productId,
  existing,
  productStockQty,
  otherVariantsStock,
  baseCurrency,
  open,
  onOpenChange,
}: {
  productId: string;
  existing: ProductVariant;
  productStockQty: number;
  otherVariantsStock: number;
  baseCurrency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [color, setColor] = useState(existing.color ?? "");
  const [size, setSize] = useState(existing.size ?? "");
  const [sku, setSku] = useState(existing.sku ?? "");
  const [price, setPrice] = useState(existing.price != null ? String(existing.price) : "");
  const [stock, setStock] = useState(existing.stock_qty != null ? String(existing.stock_qty) : "0");

  useEffect(() => {
    if (!open) return;
    setColor(existing.color ?? "");
    setSize(existing.size ?? "");
    setSku(existing.sku ?? "");
    setPrice(existing.price != null ? String(existing.price) : "");
    setStock(existing.stock_qty != null ? String(existing.stock_qty) : "0");
  }, [open, existing]);

  const newStock = parseFloat(stock) || 0;
  const totalAfter = otherVariantsStock + newStock;
  const overAllocated = totalAfter > productStockQty;

  const updateMutation = useMutation({
    mutationFn: (body: UpdateVariantRequest) => variantsApi.update(productId, existing.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] });
      toast.success("Variant saved");
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function submit() {
    if (!color && !size) {
      toast.error("Enter at least a colour or size");
      return;
    }
    if (overAllocated) {
      toast.error(`Total variant stock (${totalAfter.toFixed(0)}) would exceed product stock (${productStockQty.toFixed(0)})`);
      return;
    }
    updateMutation.mutate({
      color: color || undefined,
      size: size || undefined,
      sku: sku || undefined,
      price: price ? parseFloat(price) : undefined,
      stock_qty: newStock,
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Edit variant</SheetTitle>
          <SheetDescription>
            Update colour, size, price, or stock for this combination.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5" />
              Colour
            </Label>
            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Red" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              Size
            </Label>
            <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. M" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price ({baseCurrency})</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Base price"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stock qty</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={cn(overAllocated && "border-destructive")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Variant SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Optional" />
          </div>

          <p className="text-xs text-muted-foreground">
            Product pool: {productStockQty.toFixed(0)} · Other variants: {otherVariantsStock.toFixed(0)} ·
            After save: {totalAfter.toFixed(0)}
          </p>
        </div>

        <SheetFooter className="border-t flex-row justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────

export function VariantsSection({
  productId,
  currency,
  basePrice,
  productStockQty = 0,
}: {
  productId: string;
  currency: string;
  basePrice: number;
  productStockQty?: number;
}) {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  const { data: variants = [], isLoading } = useQuery({
    queryKey: ["inventory", productId, "variants"],
    queryFn: () => variantsApi.list(productId),
  });

  const allocatedStock = variants.reduce((sum, v) => sum + (v.stock_qty ?? 0), 0);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => variantsApi.delete(productId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory", productId] });
      queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] });
      toast.success("Variant removed");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const activateToggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      variantsApi.update(productId, id, { is_active: active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory", productId, "variants"] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          Variants
          {variants.length > 0 && (
            <Badge variant="secondary" className="text-xs">{variants.length}</Badge>
          )}
        </CardTitle>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add variants
        </Button>
      </CardHeader>

      <CardContent>
        {variants.length > 0 && productStockQty > 0 ? (
          <p className="text-xs text-muted-foreground mb-3">
            Variant stock allocated:{" "}
            <span className={cn("font-medium tabular-nums", allocatedStock > productStockQty && "text-destructive")}>
              {allocatedStock.toFixed(0)}
            </span>
            {" / "}
            {productStockQty.toFixed(0)} product units
          </p>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground py-2">Loading…</p>
        ) : variants.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed p-6 text-center">
            <Palette className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium">No variants yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select multiple colours and sizes, then split your {productStockQty > 0 ? `${productStockQty.toFixed(0)} units of ` : ""}
              stock across each combination. Sold-out options are hidden on your storefront.
            </p>
            <Button size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add variants
            </Button>
          </div>
        ) : (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Variant</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                  <th className="pb-2 text-right font-medium">Stock</th>
                  <th className="pb-2 text-right font-medium">SKU</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((v) => (
                  <tr key={v.id} className={cn("group", !v.is_active && "opacity-50")}>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {v.color && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                            {v.color}
                          </span>
                        )}
                        {v.size && (
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">
                            {v.size}
                          </span>
                        )}
                        {v.stock_qty <= 0 && (
                          <Badge variant="secondary" className="text-xs text-destructive">Out of stock</Badge>
                        )}
                        {!v.is_active && (
                          <Badge variant="secondary" className="text-xs">Hidden</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      {v.price != null ? (
                        <span className="font-medium">{currency} {v.price.toFixed(2)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">base ({currency} {basePrice.toFixed(2)})</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">
                      <span className={cn(v.stock_qty <= 0 ? "text-destructive" : "")}>
                        {v.stock_qty.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs text-muted-foreground">
                      {v.sku || "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditing(v)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => activateToggle.mutate({ id: v.id, active: !v.is_active })}
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title={v.is_active ? "Hide variant" : "Show variant"}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Remove this variant?")) deleteMutation.mutate(v.id);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InventoryColorPhotos productId={productId} variants={variants} className="mt-6 pt-6 border-t" />
          </>
        )}
      </CardContent>

      <VariantBulkSheet
        productId={productId}
        productStockQty={productStockQty}
        existingVariants={variants}
        baseCurrency={currency}
        open={showAdd}
        onOpenChange={setShowAdd}
      />

      {editing ? (
        <VariantEditSheet
          productId={productId}
          existing={editing}
          productStockQty={productStockQty}
          otherVariantsStock={variants
            .filter((v) => v.id !== editing.id)
            .reduce((sum, v) => sum + (v.stock_qty ?? 0), 0)}
          baseCurrency={currency}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      ) : null}
    </Card>
  );
}
