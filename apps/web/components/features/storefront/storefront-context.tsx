"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { publicApi } from "@/lib/api";
import type { PublicProduct, PublicStorefront, PublicVariant } from "@/types/api";
import {
  cartItemStockQty,
  productNeedsVariantSelection,
  resolveCartVariant,
} from "./storefront-utils";
import { storefrontIsClosed } from "@/lib/storefront-hours";

export type CartItem = {
  product: PublicProduct;
  variant?: PublicVariant;
  qty: number;
};

type StorefrontContextValue = {
  slug: string;
  sf: PublicStorefront | null;
  loading: boolean;
  error: boolean;
  accent: string;
  currency: string;
  basePath: string;
  cart: CartItem[];
  cartCount: number;
  wishlist: string[];
  wishlistCount: number;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  showBook: boolean;
  addToCart: (product: PublicProduct, variant?: PublicVariant, qty?: number) => void;
  updateQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function cartStorageKey(slug: string) {
  return `bizos-cart-${slug}`;
}

function wishlistStorageKey(slug: string) {
  return `bizos-wishlist-${slug}`;
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error("useStorefront must be used within StorefrontProvider");
  return ctx;
}

export function StorefrontProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [sf, setSf] = useState<PublicStorefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const basePath = `/p/${slug}`;

  useEffect(() => {
    setLoading(true);
    setError(false);
    publicApi
      .storefront(slug)
      .then(setSf)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cartStorageKey(slug));
      if (raw) setCart(JSON.parse(raw) as CartItem[]);
    } catch {
      setCart([]);
    }
    try {
      const rawWish = localStorage.getItem(wishlistStorageKey(slug));
      if (rawWish) setWishlist(JSON.parse(rawWish) as string[]);
    } catch {
      setWishlist([]);
    }
  }, [slug]);

  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey(slug), JSON.stringify(cart));
    } catch {
      /* ignore quota errors */
    }
  }, [cart, slug]);

  useEffect(() => {
    try {
      localStorage.setItem(wishlistStorageKey(slug), JSON.stringify(wishlist));
    } catch {
      /* ignore quota errors */
    }
  }, [wishlist, slug]);

  useEffect(() => {
    if (!sf) return;
    setCart((prev) => {
      if (prev.length === 0) return prev;
      let changed = false;
      const next = prev.flatMap((item) => {
        const fresh = sf.products.find((p) => p.id === item.product.id);
        if (!fresh) return [item];

        const matchedVariant = item.variant
          ? (fresh.variants ?? []).find((v) => v.id === item.variant?.id)
          : undefined;
        const variant = resolveCartVariant(fresh, matchedVariant ?? item.variant);
        if (productNeedsVariantSelection(fresh) && !variant) {
          changed = true;
          return [];
        }

        const maxQty = cartItemStockQty(fresh, variant);
        const qty = maxQty > 0 ? Math.min(item.qty, maxQty) : item.qty;
        if (
          fresh !== item.product ||
          variant?.id !== item.variant?.id ||
          qty !== item.qty
        ) {
          changed = true;
          return [{ product: fresh, variant, qty }];
        }
        return [item];
      });
      return changed ? next : prev;
    });
  }, [sf]);

  const addToCart = useCallback((product: PublicProduct, variant?: PublicVariant, qty = 1) => {
    if (storefrontIsClosed(sf)) {
      toast.error("This store is closed — orders resume during opening hours");
      return;
    }
    const resolvedVariant = resolveCartVariant(product, variant);
    if (productNeedsVariantSelection(product) && !resolvedVariant) {
      toast.error(`Choose a size or colour for ${product.name}`);
      return;
    }
    const maxQty = cartItemStockQty(product, resolvedVariant);
    if (maxQty <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    const addQty = Math.min(qty, maxQty);
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.variant?.id === resolvedVariant?.id
      );
      if (idx >= 0) {
        const next = [...prev];
        const capped = Math.min(next[idx].qty + addQty, maxQty);
        if (capped <= next[idx].qty) {
          toast.error(`Only ${maxQty} in stock for ${product.name}`);
          return prev;
        }
        next[idx] = { ...next[idx], qty: capped };
        return next;
      }
      return [...prev, { product, variant: resolvedVariant, qty: addQty }];
    });
    toast.success(`${product.name} added to cart`);
  }, [sf]);

  const updateQty = useCallback((index: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setCart((prev) => {
      const item = prev[index];
      if (!item) return prev;
      const maxQty = cartItemStockQty(item.product, item.variant);
      const capped = maxQty > 0 ? Math.min(qty, maxQty) : qty;
      if (maxQty > 0 && qty > maxQty) {
        toast.error(`Only ${maxQty} in stock for ${item.product.name}`);
      }
      return prev.map((entry, i) => (i === index ? { ...entry, qty: capped } : entry));
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast.success("Removed from wishlist");
        return prev.filter((id) => id !== productId);
      }
      toast.success("Saved to wishlist");
      setWishlistOpen(true);
      return [...prev, productId];
    });
  }, []);

  const accent = sf?.accent_color || "#16a34a";
  const currency = sf?.products[0]?.currency ?? "GHS";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlist.length;
  const showBook = !!(sf?.show_services && sf.services.some((s) => s.is_bookable));

  const value = useMemo(
    () => ({
      slug,
      sf,
      loading,
      error,
      accent,
      currency,
      basePath,
      cart,
      cartCount,
      wishlist,
      wishlistCount,
      wishlistOpen,
      setWishlistOpen,
      showBook,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      isWishlisted,
      toggleWishlist,
      mobileMenuOpen,
      setMobileMenuOpen,
    }),
    [
      slug,
      sf,
      loading,
      error,
      accent,
      currency,
      basePath,
      cart,
      cartCount,
      wishlist,
      wishlistCount,
      wishlistOpen,
      setWishlistOpen,
      showBook,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      isWishlisted,
      toggleWishlist,
      mobileMenuOpen,
      setMobileMenuOpen,
    ]
  );

  return (
    <StorefrontContext.Provider value={value}>
      <div style={{ ["--sf-accent" as string]: accent }}>{children}</div>
    </StorefrontContext.Provider>
  );
}
