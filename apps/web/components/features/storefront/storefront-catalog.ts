import type { PublicProduct, PublicService, PublicStorefront } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { primaryProductImage } from "./storefront-product-media";

export type CatalogCategory = {
  name: string;
  slug: string;
  count: number;
  image?: string;
  products: PublicProduct[];
};

export type ServiceCatalogCategory = {
  name: string;
  slug: string;
  count: number;
  image?: string;
  services: PublicService[];
};

/** Cap mega-menu columns so nav dropdowns stay bounded as catalogs grow. */
export const MEGA_MENU_MAX_GROUPS = 8;
export const MEGA_MENU_ITEMS_PER_GROUP = 3;

export function megaMenuPreview<T extends { name: string; count: number }>(
  groups: T[],
  maxGroups = MEGA_MENU_MAX_GROUPS,
) {
  const visible = groups.slice(0, maxGroups);
  return {
    visible,
    hiddenGroupCount: Math.max(0, groups.length - visible.length),
    totalGroups: groups.length,
  };
}

export function categorySlug(name: string) {
  return encodeURIComponent(name);
}

export function buildCatalog(products: PublicProduct[]): CatalogCategory[] {
  const map = new Map<string, CatalogCategory>();

  for (const product of products) {
    const name = product.category?.trim() || "General";
    const existing = map.get(name);
    const image = product.photo_url || product.images?.[0];

    if (existing) {
      existing.count += 1;
      existing.products.push(product);
      if (!existing.image && image) existing.image = image;
    } else {
      map.set(name, {
        name,
        slug: categorySlug(name),
        count: 1,
        image,
        products: [product],
      });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function categoryShopUrl(basePath: string, category: string) {
  return `${basePath}/shop?category=${categorySlug(category)}`;
}

export function buildServiceCatalog(services: PublicService[]): ServiceCatalogCategory[] {
  const map = new Map<string, ServiceCatalogCategory>();

  for (const service of services) {
    const name = service.category?.trim() || "General";
    const existing = map.get(name);
    const image = service.photo_url || service.images?.[0];

    if (existing) {
      existing.count += 1;
      existing.services.push(service);
      if (!existing.image && image) existing.image = image;
    } else {
      map.set(name, {
        name,
        slug: categorySlug(name),
        count: 1,
        image,
        services: [service],
      });
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function categoryServicesUrl(basePath: string, category: string) {
  return `${basePath}/services?category=${categorySlug(category)}`;
}

export function productImage(product?: PublicProduct | null) {
  return primaryProductImage(product);
}

/** Same-category products first, then the rest — for PDP suggestions. */
export function getRelatedProducts(
  products: PublicProduct[],
  current: PublicProduct,
  limit = 8,
): PublicProduct[] {
  const others = products.filter((p) => p.id !== current.id);
  const category = current.category?.trim();
  const same = category
    ? others.filter((p) => p.category?.trim() === category)
    : [];
  const rest = category
    ? others.filter((p) => p.category?.trim() !== category)
    : others;
  return [...same, ...rest].slice(0, limit);
}

type PortfolioItem = PublicStorefront["portfolio"][number];

/** Images assigned to the homepage hero slider; falls back to all if none assigned. */
export function portfolioForHero(sf: PublicStorefront): PortfolioItem[] {
  const portfolio = sf.portfolio ?? [];
  const picked = portfolio.filter((p) => p.use_hero);
  return picked.length > 0 ? picked : portfolio;
}

/** Images for homepage story / editorial blocks; falls back to all if none assigned. */
export function portfolioForEditorial(sf: PublicStorefront): PortfolioItem[] {
  const picked = sf.portfolio.filter((p) => p.use_editorial);
  return picked.length > 0 ? picked : sf.portfolio;
}

export function portfolioImageFromList(list: PortfolioItem[], index = 0) {
  const raw = list[index]?.url;
  return raw ? resolveMediaUrl(raw) : null;
}

export function portfolioImage(sf: PublicStorefront, index = 0) {
  return portfolioImageFromList(sf.portfolio, index);
}

/** Stock lifestyle images until the merchant uploads portfolio photos. */
export const DEFAULT_EDITORIAL_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&auto=format&fit=crop&q=80",
] as const;

/** Editorial hero — merchant portfolio first, never a product photo. */
export function editorialVisualImage(sf: PublicStorefront, sectionIndex = 0): string {
  const editorial = portfolioForEditorial(sf);
  if (editorial.length > 0) {
    const idx = (sectionIndex + 1) % editorial.length;
    const fromPortfolio = portfolioImageFromList(editorial, idx);
    if (fromPortfolio) return fromPortfolio;
  }
  return DEFAULT_EDITORIAL_IMAGES[sectionIndex % DEFAULT_EDITORIAL_IMAGES.length];
}

/** Optional overlapping frame — second portfolio or stock image only. */
export function editorialSecondaryImage(
  sf: PublicStorefront,
  sectionIndex = 0,
): string | null {
  const editorial = portfolioForEditorial(sf);
  if (editorial.length >= 2) {
    const idx = (sectionIndex + 2) % editorial.length;
    const img = portfolioImageFromList(editorial, idx);
    if (img) return img;
  }
  if (editorial.length === 0 && sf.portfolio.length === 0 && DEFAULT_EDITORIAL_IMAGES.length >= 2) {
    const mainIdx = sectionIndex % DEFAULT_EDITORIAL_IMAGES.length;
    const secondaryIdx = (sectionIndex + 1) % DEFAULT_EDITORIAL_IMAGES.length;
    if (secondaryIdx !== mainIdx) return DEFAULT_EDITORIAL_IMAGES[secondaryIdx];
  }
  return null;
}

export function activeServices(sf: PublicStorefront): PublicService[] {
  if (!sf.show_services) return [];
  return sf.services;
}
