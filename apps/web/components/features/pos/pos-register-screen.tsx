"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  ShoppingBag,
  PauseCircle,
  X,
  Minus,
  Plus,
  Banknote,
  LogOut,
  Lock,
  Maximize2,
  Minimize2,
  Receipt,
  Percent,
  Store,
  LayoutDashboard,
} from "lucide-react";
import { posApi, getApiErrorMessage } from "@/lib/api";
import { usePosStore, unitPrice } from "@/store/pos";
import { useLockStore } from "@/store/lock";
import { resolveMediaUrl } from "@/lib/media-url";
import { formatMoney } from "@/lib/format";
import { SALE_PAYMENT_METHODS, type SalePaymentMethod } from "@/lib/sales-constants";
import type { PosCatalogItem, PosCatalogVariant, PosCheckoutResult, PosReceipt } from "@/types/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PosReceiptView } from "@/components/features/pos/pos-receipt-view";
import { PosCustomerField } from "@/components/features/pos/pos-customer-field";
import { PosTopBar } from "@/components/features/pos/pos-top-bar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function OpenSessionPanel({ onOpened }: { onOpened: () => void }) {
  const [floatAmt, setFloatAmt] = useState("0");
  const [busy, setBusy] = useState(false);

  async function open() {
    setBusy(true);
    try {
      await posApi.openSession({ opening_float: Number(floatAmt) || 0 });
      toast.success("Register opened");
      onOpened();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PosTopBar />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Open register</h1>
          <p className="text-muted-foreground text-sm max-w-sm">
            Start your shift before taking sales. Enter opening cash in the drawer (optional).
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          <Label htmlFor="opening-float">Opening float</Label>
          <Input
            id="opening-float"
            type="number"
            min={0}
            step="0.01"
            value={floatAmt}
            onChange={(e) => setFloatAmt(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" className="min-w-[200px]" onClick={open} disabled={busy}>
            {busy ? <Spinner className="h-4 w-4" /> : "Open register"}
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            variant="outline"
            size="lg"
            className="min-w-[200px] gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

function VariantPicker({
  product,
  open,
  onClose,
  onPick,
}: {
  product: PosCatalogItem | null;
  open: boolean;
  onClose: () => void;
  onPick: (variant: PosCatalogVariant) => void;
}) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 max-h-80 overflow-y-auto">
          {(product.variants ?? []).map((v) => (
            <Button
              key={v.id}
              variant="outline"
              className="justify-between h-auto py-3"
              disabled={v.stock_qty <= 0 && product.type === "product"}
              onClick={() => {
                onPick(v);
                onClose();
              }}
            >
              <span>
                {[v.color, v.size].filter(Boolean).join(" / ") || "Default"}
              </span>
              <span className="text-muted-foreground text-sm">
                {formatMoney(
                  v.discounted_price && v.discounted_price > 0
                    ? v.discounted_price
                    : (v.price ?? (product.discounted_price > 0 ? product.discounted_price : product.sell_price)),
                  product.currency
                )}{" "}
                · {v.stock_qty} left
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PosRegisterScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const lock = useLockStore((s) => s.lock);
  const qc = useQueryClient();
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [itemType, setItemType] = useState<"" | "product" | "service">("product");
  const [variantProduct, setVariantProduct] = useState<PosCatalogItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [heldOpen, setHeldOpen] = useState(false);
  const [holdLabel, setHoldLabel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState("");
  const [lastReceipt, setLastReceipt] = useState<PosReceipt | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");
  const [orderDiscountPct, setOrderDiscountPct] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cart = usePosStore((s) => s.cart);
  const addItem = usePosStore((s) => s.addItem);
  const setQty = usePosStore((s) => s.setQty);
  const removeLine = usePosStore((s) => s.removeLine);
  const clearCart = usePosStore((s) => s.clearCart);
  const loadLines = usePosStore((s) => s.loadLines);
  const cartTotal = usePosStore((s) => s.cartTotal);
  const cartCurrency = usePosStore((s) => s.cartCurrency);

  const sessionQuery = useQuery({
    queryKey: ["pos-session"],
    queryFn: posApi.getActiveSession,
    retry: false,
  });

  const settingsQuery = useQuery({
    queryKey: ["pos-settings"],
    queryFn: posApi.getSettings,
  });

  const catalogQuery = useQuery({
    queryKey: ["pos-catalog", search, category, itemType],
    queryFn: () =>
      posApi.catalog({
        search: search || undefined,
        category: category || undefined,
        type: itemType || undefined,
      }),
    enabled: !!sessionQuery.data,
  });

  const heldQuery = useQuery({
    queryKey: ["pos-held", sessionQuery.data?.id],
    queryFn: () => posApi.listHeld(sessionQuery.data?.id),
    enabled: !!sessionQuery.data?.id,
  });

  useEffect(() => {
    if (settingsQuery.data?.default_payment_method) {
      setPaymentMethod(settingsQuery.data.default_payment_method as SalePaymentMethod);
    }
  }, [settingsQuery.data?.default_payment_method]);

  const focusBarcode = useCallback(() => {
    barcodeRef.current?.focus();
  }, []);

  useEffect(() => {
    focusBarcode();
  }, [focusBarcode, sessionQuery.data]);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      toast.error("Fullscreen not available in this browser");
    }
  }

  const maxDiscountPct = settingsQuery.data?.max_cashier_discount_pct ?? 10;

  async function handleBarcode(code: string) {
    const trimmed = code.trim();
    if (!trimmed) return;
    try {
      const item = await posApi.scan(trimmed);
      tapProduct(item);
    } catch {
      toast.error("Product not found");
    }
    if (barcodeRef.current) barcodeRef.current.value = "";
  }

  function tapProduct(item: PosCatalogItem) {
    if (item.has_variants && (item.variants?.length ?? 0) > 0) {
      setVariantProduct(item);
      return;
    }
    if (item.type === "product" && item.out_of_stock) {
      toast.error(`${item.name} is out of stock`);
      return;
    }
    addItem(item);
    toast.success(`Added ${item.name}`);
  }

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const session = sessionQuery.data;
      if (!session) throw new Error("No session");
      const body = {
        session_id: session.id,
        customer_id: customerId || undefined,
        currency: cartCurrency(),
        payment_method: paymentMethod,
        note: checkoutNote.trim() || undefined,
        order_discount_pct: orderDiscountPct > 0 ? orderDiscountPct : undefined,
        lines: cart.map((c) => ({
          product_id: c.product.id,
          variant_id: c.variant?.id ?? null,
          quantity: c.quantity,
        })),
        amount_tendered:
          paymentMethod === "cash" && amountTendered ? Number(amountTendered) : undefined,
      };
      return posApi.checkout(body);
    },
    onSuccess: async (result: PosCheckoutResult) => {
      clearCart();
      setCheckoutOpen(false);
      setAmountTendered("");
      setCheckoutNote("");
      setOrderDiscountPct(0);
      setCustomerId("");
      toast.success(`Sale complete · ${result.receipt_number}`);
      qc.invalidateQueries({ queryKey: ["pos-catalog"] });
      qc.invalidateQueries({ queryKey: ["pos-session"] });
      try {
        const receipt = await posApi.receipt(result.sale_id);
        setLastReceipt(receipt);
        setReceiptOpen(true);
      } catch {
        /* receipt optional */
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const holdMutation = useMutation({
    mutationFn: async () => {
      const session = sessionQuery.data;
      if (!session) throw new Error("No session");
      return posApi.hold({
        session_id: session.id,
        label: holdLabel.trim() || `Hold ${new Date().toLocaleTimeString()}`,
        cart: {
          lines: cart.map((c) => ({
            product_id: c.product.id,
            variant_id: c.variant?.id ?? null,
            quantity: c.quantity,
          })),
        },
      });
    },
    onSuccess: () => {
      clearCart();
      setHoldOpen(false);
      setHoldLabel("");
      toast.success("Sale parked");
      qc.invalidateQueries({ queryKey: ["pos-held"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <OpenSessionPanel
        onOpened={() => qc.invalidateQueries({ queryKey: ["pos-session"] })}
      />
    );
  }

  const session = sessionQuery.data;
  const items = catalogQuery.data?.items ?? [];
  const categories = catalogQuery.data?.categories ?? [];
  const subtotal = cartTotal();
  const total = subtotal * (1 - orderDiscountPct / 100);
  const changeDue =
    paymentMethod === "cash" && amountTendered
      ? Math.max(0, Number(amountTendered) - total)
      : 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-2 shadow-xs md:gap-3 md:px-4">
        <Button
          nativeButton={false}
          render={<Link href="/pos" />}
          variant="ghost"
          size="icon-sm"
          title="POS home"
        >
          <Store className="h-4 w-4" />
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{session.register_name}</p>
            <p className="text-xs text-muted-foreground">
              {session.sales_count ?? 0} sales · {formatMoney(session.sales_total ?? 0, cartCurrency())} today
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          <Button
            nativeButton={false}
            render={<Link href="/pos/sales" />}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Receipt className="h-3.5 w-3.5" />
            Receipts
          </Button>
          <Button variant="outline" size="sm" onClick={() => setHeldOpen(true)} className="gap-1">
            <PauseCircle className="h-3.5 w-3.5" />
            Parked ({heldQuery.data?.carts.length ?? 0})
          </Button>
        </div>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={toggleFullscreen} title="Fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Lock screen"
            onClick={() => {
              lock(pathname);
              router.push("/lock-screen");
            }}
          >
            <Lock className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            variant="ghost"
            size="icon-sm"
            title="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/pos/session/close?session=${session.id}`} />}
            variant="outline"
            size="sm"
            className="ml-1 hidden gap-1 md:inline-flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Close register
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Products */}
        <div className="flex flex-1 flex-col min-w-0 border-r">
          <div className="flex flex-wrap gap-2 p-3 border-b">
            <div className="relative flex-1 min-w-[140px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <input
              ref={barcodeRef}
              className="sr-only"
              aria-label="Barcode scanner"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBarcode((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Select value={itemType} onValueChange={(v) => v && setItemType(v as typeof itemType)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="service">Services</SelectItem>
              </SelectContent>
            </Select>
            {categories.length > 0 && (
              <Select value={category || "__all"} onValueChange={(v) => setCategory(v && v !== "__all" ? v : "")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all">All</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {catalogQuery.isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {items.map((item) => {
                  const img = resolveMediaUrl(item.photo_url);
                  const price = item.discounted_price > 0 ? item.discounted_price : item.sell_price;
                  const onSale = item.discounted_price > 0 && item.discounted_price < item.sell_price;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => tapProduct(item)}
                      disabled={item.type === "product" && item.out_of_stock && !item.has_variants}
                      className={cn(
                        "flex flex-col rounded-lg border bg-card p-2 text-left transition-colors hover:border-primary/50 active:scale-[0.98]",
                        item.out_of_stock && "opacity-50"
                      )}
                    >
                      <div className="aspect-square w-full rounded-md bg-muted mb-2 overflow-hidden">
                        {img ? (
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                            No photo
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-sm text-primary font-semibold mt-1">
                        {onSale ? (
                          <>
                            <span className="text-muted-foreground line-through text-xs font-normal mr-1">
                              {formatMoney(item.sell_price, item.currency)}
                            </span>
                            {formatMoney(price, item.currency)}
                          </>
                        ) : (
                          formatMoney(price, item.currency)
                        )}
                      </p>
                      {item.type === "product" && (
                        <p className="text-xs text-muted-foreground">
                          {item.has_variants ? "Variants" : `${item.stock_qty} ${item.unit || "pcs"}`}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        <div className="flex w-full max-w-md flex-col bg-muted/30 lg:max-w-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <PosCustomerField customerId={customerId} onCustomerIdChange={setCustomerId} />
            {cart.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">
                Tap products to add them
              </p>
            ) : (
              cart.map((line) => {
                const price = unitPrice(line.product, line.variant);
                const lineTotal = price * line.quantity;
                const label = line.variant
                  ? `${line.product.name} (${[line.variant.color, line.variant.size].filter(Boolean).join(" / ")})`
                  : line.product.name;
                return (
                  <div key={line.key} className="rounded-lg border bg-card p-3 space-y-2">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium flex-1 leading-snug">{label}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeLine(line.key)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(line.key, line.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setQty(line.key, line.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold tabular-nums">{formatMoney(lineTotal, line.product.currency)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatMoney(total, cartCurrency())}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                disabled={cart.length === 0}
                onClick={() => setHoldOpen(true)}
                className="gap-1"
              >
                <PauseCircle className="h-4 w-4" />
                Park
              </Button>
              <Button disabled={cart.length === 0} onClick={() => setCheckoutOpen(true)} className="gap-1">
                <Banknote className="h-4 w-4" />
                Pay
              </Button>
            </div>
          </div>
        </div>
      </div>

      <VariantPicker
        product={variantProduct}
        open={!!variantProduct}
        onClose={() => setVariantProduct(null)}
        onPick={(v) => {
          if (variantProduct) {
            if (v.stock_qty <= 0) {
              toast.error("Out of stock");
              return;
            }
            addItem(variantProduct, v);
            toast.success(`Added ${variantProduct.name}`);
          }
        }}
      />

      <Dialog
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) setOrderDiscountPct(0);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg bg-muted/40 p-4 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatMoney(subtotal, cartCurrency())}</span>
            </div>
            {orderDiscountPct > 0 ? (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cashier discount ({orderDiscountPct}%)</span>
                <span className="tabular-nums">
                  −{formatMoney(subtotal - total, cartCurrency())}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between items-baseline pt-1 border-t border-border/60">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Amount due</span>
              <p className="text-3xl font-bold tabular-nums">{formatMoney(total, cartCurrency())}</p>
            </div>
            {customerId ? (
              <p className="text-sm text-muted-foreground">Customer linked to this sale</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Walk-in — product &amp; website discounts still apply automatically
              </p>
            )}
          </div>
          {maxDiscountPct > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="order-discount">Cashier discount (%)</Label>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  id="order-discount"
                  type="number"
                  min={0}
                  max={maxDiscountPct}
                  step={1}
                  value={orderDiscountPct || ""}
                  placeholder="0"
                  onChange={(e) =>
                    setOrderDiscountPct(Math.min(maxDiscountPct, Math.max(0, Number(e.target.value) || 0)))
                  }
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">max {maxDiscountPct}%</span>
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="checkout-note">Note (optional)</Label>
            <Input
              id="checkout-note"
              value={checkoutNote}
              onChange={(e) => setCheckoutNote(e.target.value)}
              placeholder="e.g. Gift wrap, staff discount approved…"
            />
          </div>
          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select value={paymentMethod} onValueChange={(v) => v && setPaymentMethod(v as SalePaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SALE_PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <Label>Amount tendered</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
                placeholder={String(total)}
              />
              {amountTendered && (
                <p className="text-sm text-muted-foreground">
                  Change: {formatMoney(changeDue, cartCurrency())}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => checkoutMutation.mutate()} disabled={checkoutMutation.isPending} className="gap-2">
              {checkoutMutation.isPending ? <Spinner className="h-4 w-4" /> : (
                <>
                  <Banknote className="h-4 w-4" />
                  Complete &amp; print receipt
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={holdOpen} onOpenChange={setHoldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Park sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Label (e.g. customer name)</Label>
            <Input value={holdLabel} onChange={(e) => setHoldLabel(e.target.value)} placeholder="Table 2, Ama…" />
          </div>
          <DialogFooter>
            <Button onClick={() => holdMutation.mutate()} disabled={holdMutation.isPending}>
              Park cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={heldOpen} onOpenChange={setHeldOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parked sales</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(heldQuery.data?.carts ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No parked sales</p>
            ) : (
              heldQuery.data?.carts.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{h.label}</p>
                    <p className="text-sm text-muted-foreground">{formatMoney(h.total, cartCurrency())}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        const catalog = catalogQuery.data?.items ?? [];
                        const entries = h.cart.lines
                          .map((line) => {
                            const product = catalog.find((p) => p.id === line.product_id);
                            if (!product) return null;
                            const variant = line.variant_id
                              ? product.variants?.find((v) => v.id === line.variant_id)
                              : undefined;
                            return {
                              key: line.variant_id ? `${line.product_id}:${line.variant_id}` : line.product_id,
                              product,
                              variant,
                              quantity: line.quantity,
                            };
                          })
                          .filter(Boolean) as ReturnType<typeof usePosStore.getState>["cart"];
                        loadLines(entries);
                        await posApi.deleteHeld(h.id);
                        qc.invalidateQueries({ queryKey: ["pos-held"] });
                        setHeldOpen(false);
                        toast.success("Cart restored");
                      }}
                    >
                      Resume
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        await posApi.deleteHeld(h.id);
                        qc.invalidateQueries({ queryKey: ["pos-held"] });
                      }}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {lastReceipt && <PosReceiptView receipt={lastReceipt} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>
            <Button onClick={() => setReceiptOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
