"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { StorefrontProductCard } from "./storefront-product-card";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";

const FEATURED_LIMIT = 5;

function featuredProducts(products: PublicProduct[]) {
  return products
    .filter((p) => p.is_featured)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.name ?? "").localeCompare(b.name ?? ""))
    .slice(0, FEATURED_LIMIT);
}

export function StorefrontHomeFeatured({
  products,
  accent,
  currency,
  basePath,
  businessName,
  shopLabel,
  onAdd,
}: {
  products: PublicProduct[];
  accent: string;
  currency: string;
  basePath: string;
  businessName: string;
  shopLabel?: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  if (products.length === 0) return null;

  const featured = featuredProducts(products);
  if (featured.length === 0) return null;

  const hasMore = products.length > featured.length;

  return (
    <section className="sf-featured">
      <SfReveal variant="fade">
        <header className="sf-featured-head">
          <div>
            <span className="sf-label">Featured</span>
            <h2>Our favourites</h2>
            <p>Handpicked pieces from {businessName}</p>
          </div>
          <Link href={`${basePath}/shop`} className="sf-featured-viewall" style={{ color: accent }}>
            {hasMore ? `View all ${products.length}` : shopLabel || "View shop"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>
      </SfReveal>

      <SfStagger className="storefront-products-grid">
        {featured.map((p) => (
          <SfStaggerItem key={p.id}>
            <StorefrontProductCard
              product={p}
              accent={accent}
              currency={currency}
              onAdd={onAdd}
            />
          </SfStaggerItem>
        ))}
      </SfStagger>

      {hasMore ? (
        <SfReveal delay={0.25}>
          <div className="sf-featured-footer">
            <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </SfReveal>
      ) : null}
    </section>
  );
}
