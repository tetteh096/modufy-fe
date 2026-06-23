import type { PublicProduct, PublicVariant } from "@/types/api";

export function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getPrice(product: PublicProduct, variant?: PublicVariant) {
  return variant?.price ?? product.sell_price;
}

function discountedFromFields(base: number, product: PublicProduct): number | null {
  if (!isDiscountActive(product)) return null;
  if (product.discount_type === "percent" && product.discount_value > 0 && product.discount_value < 100) {
    return base * (1 - product.discount_value / 100);
  }
  if (product.discount_type === "fixed" && product.discount_value > 0 && product.discount_value < base) {
    return base - product.discount_value;
  }
  return null;
}

export function effectivePrice(product: PublicProduct, variant?: PublicVariant) {
  const base = getPrice(product, variant);
  const computed = discountedFromFields(base, product);
  if (computed !== null && computed > 0 && computed < base) return computed;
  if (product.discounted_price > 0 && product.discounted_price < base) {
    return product.discounted_price;
  }
  return base;
}

export function isDiscountActive(product: PublicProduct): boolean {
  if (product.discount_type === "none" || product.discounted_price <= 0) return false;
  if (product.discount_ends_at) {
    const ends = new Date(product.discount_ends_at).getTime();
    if (!Number.isNaN(ends) && ends <= Date.now()) return false;
  }
  return true;
}

export function productDisplayPrice(product: PublicProduct, variant?: PublicVariant) {
  const original = getPrice(product, variant);
  const onDeal = isDiscountActive(product);
  const list = onDeal ? effectivePrice(product, variant) : original;
  return { list, original, onDeal };
}

export const NEW_ARRIVAL_DAYS = 30;

export function formatDuration(mins: number): string {
  if (mins <= 0) return "";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export function servicePriceLabel(service: { price: number; currency: string; pricing_type: string }) {
  const amount = fmt(service.price, service.currency);
  return service.pricing_type === "hourly" ? `${amount}/hr` : amount;
}

export function storefrontBookUrl(basePath: string, serviceId?: string) {
  const base = `${basePath}/book`;
  return serviceId ? `${base}?service=${encodeURIComponent(serviceId)}` : base;
}

export function productCreatedAt(product: PublicProduct): number | null {
  if (!product.created_at) return null;
  const ts = new Date(product.created_at).getTime();
  return Number.isNaN(ts) ? null : ts;
}

export function filterNewArrivals(products: PublicProduct[], days = NEW_ARRIVAL_DAYS): PublicProduct[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return products
    .filter((p) => {
      const ts = productCreatedAt(p);
      return ts !== null && ts >= cutoff;
    })
    .sort((a, b) => (productCreatedAt(b) ?? 0) - (productCreatedAt(a) ?? 0));
}

export function searchProducts(products: PublicProduct[], query: string): PublicProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const inName = p.name.toLowerCase().includes(q);
    const inDesc = (p.description ?? "").toLowerCase().includes(q);
    const inCat = (p.category ?? "").toLowerCase().includes(q);
    const inTags = (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return inName || inDesc || inCat || inTags;
  });
}

export function daysSinceCreated(product: PublicProduct): number | null {
  const ts = productCreatedAt(product);
  if (ts === null) return null;
  return Math.floor((Date.now() - ts) / (24 * 60 * 60 * 1000));
}

export function productNeedsVariantSelection(product: PublicProduct): boolean {
  return product.has_variants && (product.variants ?? []).length > 0;
}

export function resolveCartVariant(
  product: PublicProduct,
  variant?: PublicVariant,
): PublicVariant | undefined {
  if (variant?.id) return variant;
  if (!productNeedsVariantSelection(product)) return undefined;
  return (product.variants ?? []).find((v) => v.stock_qty > 0);
}

export function cartItemStockQty(product: PublicProduct, variant?: PublicVariant): number {
  if (variant) return variant.stock_qty;
  if (productNeedsVariantSelection(product)) {
    return Math.max(0, ...(product.variants ?? []).map((v) => v.stock_qty));
  }
  return product.stock_qty;
}

export function productInStock(product: PublicProduct, variant?: PublicVariant): boolean {
  return cartItemStockQty(product, variant) > 0;
}
