import { create } from "zustand";
import type { PosCatalogItem, PosCatalogVariant } from "@/types/api";

export type CartEntry = {
  key: string;
  product: PosCatalogItem;
  variant?: PosCatalogVariant;
  quantity: number;
};

function lineKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

function unitPrice(item: PosCatalogItem, variant?: PosCatalogVariant): number {
  if (variant) {
    if (variant.discounted_price != null && variant.discounted_price > 0) {
      return variant.discounted_price;
    }
    if (variant.price != null) return variant.price;
  }
  return item.discounted_price > 0 ? item.discounted_price : item.sell_price;
}

function listPrice(item: PosCatalogItem, variant?: PosCatalogVariant) {
  if (variant?.price != null) return variant.price;
  return item.sell_price;
}

type PosStore = {
  cart: CartEntry[];
  addItem: (product: PosCatalogItem, variant?: PosCatalogVariant) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  loadLines: (entries: CartEntry[]) => void;
  cartTotal: () => number;
  cartCurrency: () => string;
};

export const usePosStore = create<PosStore>((set, get) => ({
  cart: [],
  addItem: (product, variant) => {
    const key = lineKey(product.id, variant?.id);
    const existing = get().cart.find((c) => c.key === key);
    if (existing) {
      set({
        cart: get().cart.map((c) =>
          c.key === key ? { ...c, quantity: c.quantity + 1 } : c
        ),
      });
      return;
    }
    set({ cart: [...get().cart, { key, product, variant, quantity: 1 }] });
  },
  setQty: (key, qty) => {
    if (qty <= 0) {
      set({ cart: get().cart.filter((c) => c.key !== key) });
      return;
    }
    set({
      cart: get().cart.map((c) => (c.key === key ? { ...c, quantity: qty } : c)),
    });
  },
  removeLine: (key) => set({ cart: get().cart.filter((c) => c.key !== key) }),
  clearCart: () => set({ cart: [] }),
  loadLines: (entries) => set({ cart: entries }),
  cartTotal: () =>
    get().cart.reduce((sum, line) => {
      const price = unitPrice(line.product, line.variant);
      return sum + price * line.quantity;
    }, 0),
  cartCurrency: () => get().cart[0]?.product.currency ?? "GHS",
}));

export { lineKey, listPrice, unitPrice };
