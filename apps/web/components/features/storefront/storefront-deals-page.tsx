"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import type { PublicPromotion, PublicProduct, PublicVariant } from "@/types/api";
import { StorefrontProductCard } from "./storefront-product-card";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";
import { fmt } from "./storefront-utils";

function discountHeadline(p: PublicPromotion, currency: string) {
  if (p.discount_type === "percent") return `${p.discount_value}% off`;
  return `${fmt(p.discount_value, currency)} off`;
}

export function StorefrontDealsPage({
  promotions,
  accent,
  currency,
  onAdd,
}: {
  promotions: PublicPromotion[];
  accent: string;
  currency: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  if (promotions.length === 0) {
    return (
      <div className="storefront-shop-empty">
        No active deals right now — check back soon.
      </div>
    );
  }

  return (
    <div className="sf-deals-page space-y-10">
      {promotions.map((promo) => (
        <section key={promo.id} className="sf-deals-campaign">
          <SfReveal variant="fade">
            <header className="sf-deals-campaign-head">
              {promo.flyer_url ? (
                <div className="sf-deals-flyer">
                  <img src={resolveMediaUrl(promo.flyer_url)} alt="" />
                </div>
              ) : null}
              <div>
                <span className="sf-label">{discountHeadline(promo, currency)}</span>
                <h2>{promo.name}</h2>
                {promo.description ? <p className="text-muted-foreground">{promo.description}</p> : null}
                <p className="text-sm text-muted-foreground mt-1">
                  {promo.scope_type === "all_products"
                    ? "Applies to all products"
                    : `${promo.products.length} products on sale`}
                </p>
              </div>
            </header>
          </SfReveal>

          {promo.products.length > 0 ? (
            <SfStagger className="storefront-products-grid">
              {promo.products.map((product) => (
                <SfStaggerItem key={product.id}>
                  <StorefrontProductCard
                    product={product}
                    accent={accent}
                    currency={currency}
                    onAdd={onAdd}
                  />
                </SfStaggerItem>
              ))}
            </SfStagger>
          ) : null}
        </section>
      ))}
    </div>
  );
}
