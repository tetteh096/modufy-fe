import type { PublicProduct, PublicVariant } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";

const COLOR_HEX: Record<string, string> = {
  green: "#22c55e",
  blue: "#3b82f6",
  black: "#111827",
  white: "#f3f4f6",
  red: "#ef4444",
  yellow: "#eab308",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  navy: "#1e3a5f",
  brown: "#92400e",
  gray: "#6b7280",
  grey: "#6b7280",
  teal: "#14b8a6",
  sky: "#0ea5e9",
  cream: "#fef3c7",
  beige: "#d6c4a8",
  gold: "#ca8a04",
  silver: "#9ca3af",
};

export function colorToHex(name: string): string {
  const key = name.trim().toLowerCase();
  for (const [token, hex] of Object.entries(COLOR_HEX)) {
    if (key.includes(token)) return hex;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 55% 45%)`;
}

export function productBaseImages(product: PublicProduct): string[] {
  const urls = new Set<string>();
  if (product.photo_url) {
    const u = resolveMediaUrl(product.photo_url);
    if (u) urls.add(u);
  }
  for (const img of product.images ?? []) {
    const u = resolveMediaUrl(img);
    if (u) urls.add(u);
  }
  return [...urls];
}

export function variantImages(variants: PublicVariant[], color?: string): string[] {
  const urls = new Set<string>();
  for (const v of variants) {
    if (color && v.color !== color) continue;
    if (v.image_url) {
      const u = resolveMediaUrl(v.image_url);
      if (u) urls.add(u);
    }
  }
  return [...urls];
}

function pushGalleryImage(list: string[], seen: Set<string>, src?: string | null) {
  if (!src) return;
  const key = src.trim();
  if (!key || seen.has(key)) return;
  const url = resolveMediaUrl(key);
  if (!url) return;
  seen.add(key);
  list.push(url);
}

/** One variant photo per colour (first match with image_url). */
export function colorVariantImage(variants: PublicVariant[], color: string): string | undefined {
  const v = variants.find((item) => item.color === color && item.image_url);
  return v?.image_url;
}

/** Cover + extra gallery uploads (shared across all colours). */
export function sharedProductImages(product: PublicProduct): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  pushGalleryImage(out, seen, product.photo_url);
  for (const img of product.images ?? []) {
    pushGalleryImage(out, seen, img);
  }
  return out;
}

/** Primary cover image only — used on shop cards and catalog (never variant colour shots). */
export function primaryProductImage(product: PublicProduct): string | null {
  const url = product.photo_url ? resolveMediaUrl(product.photo_url) : null;
  if (url) return url;
  const fallback = product.images?.[0];
  return fallback ? resolveMediaUrl(fallback) : null;
}

export type ProductGalleryItem = {
  url: string;
  /** Set when this thumbnail is a colour-specific variant photo. */
  color?: string;
};

/**
 * Full PDP gallery — every image the shopper can browse:
 * 1. Primary cover (shop grid default)
 * 2. Extra gallery uploads
 * 3. One photo per colour variant (Black, Red, Grey, …)
 */
export function productDetailGallery(
  product: PublicProduct,
  variants: PublicVariant[],
): ProductGalleryItem[] {
  const out: ProductGalleryItem[] = [];
  const seen = new Set<string>();

  const push = (src?: string | null, color?: string) => {
    if (!src) return;
    const key = src.trim();
    if (!key || seen.has(key)) return;
    const url = resolveMediaUrl(key);
    if (!url) return;
    seen.add(key);
    out.push(color ? { url, color } : { url });
  };

  push(product.photo_url);
  for (const img of product.images ?? []) {
    push(img);
  }
  for (const color of colorsFromVariants(variants)) {
    push(colorVariantImage(variants, color), color);
  }

  return out;
}

/** Index of a colour's photo inside the full gallery (falls back to cover). */
export function colorGalleryIndex(gallery: ProductGalleryItem[], color: string): number {
  const idx = gallery.findIndex((item) => item.color === color);
  return idx >= 0 ? idx : 0;
}

export function sizesForColor(variants: PublicVariant[], color: string): string[] {
  return [...new Set(variants.filter((v) => v.color === color).map((v) => v.size).filter(Boolean))];
}

export function colorsFromVariants(variants: PublicVariant[]): string[] {
  return [...new Set(variants.map((v) => v.color).filter(Boolean))];
}

export function findVariant(
  variants: PublicVariant[],
  color?: string,
  size?: string,
): PublicVariant | undefined {
  return variants.find(
    (v) => (!color || v.color === color) && (!size || v.size === size),
  );
}

export function colorHasStock(variants: PublicVariant[], color: string): boolean {
  return variants.some((v) => v.color === color && v.stock_qty > 0);
}

export function sizeHasStock(
  variants: PublicVariant[],
  color: string | undefined,
  size: string,
): boolean {
  const v = findVariant(variants, color, size);
  return (v?.stock_qty ?? 0) > 0;
}

export function firstInStockColor(variants: PublicVariant[]): string {
  const colors = colorsFromVariants(variants);
  return colors.find((c) => colorHasStock(variants, c)) ?? colors[0] ?? "";
}

export function firstInStockSize(variants: PublicVariant[], color?: string): string {
  const sizes = color ? sizesForColor(variants, color) : [...new Set(variants.map((v) => v.size).filter(Boolean))];
  return sizes.find((s) => sizeHasStock(variants, color, s)) ?? sizes[0] ?? "";
}
