"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import type { PublicPromotion, PublicProduct, PublicVariant } from "@/types/api";
import { StorefrontHomeProductCard } from "./storefront-home-product-card";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";

const HOME_PRODUCT_LIMIT = 6;

export function StorefrontHomeDeals({
  promotions,
  accent,
  currency,
  basePath,
  onAdd,
}: {
  promotions: PublicPromotion[];
  accent: string;
  currency: string;
  basePath: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  const featured = promotions.filter((p) => p.show_on_homepage);
  if (featured.length === 0) return null;

  const primary = featured[0];
  const previewProducts = featured.flatMap((p) => p.products).slice(0, HOME_PRODUCT_LIMIT);

  return (
    <section className="sf-pve-section sf-home-deals">
      <SfReveal variant="fade">
        <header className="sf-featured-head">
          <div className="sf-home-deals-head">
            {primary.flyer_url ? (
              <div className="sf-home-deals-flyer">
                <img src={resolveMediaUrl(primary.flyer_url)} alt="" />
              </div>
            ) : null}
            <div>
              <span className="sf-label">Deals</span>
              <h2>{primary.name}</h2>
              {primary.description ? <p>{primary.description}</p> : null}
            </div>
          </div>
          <Link href={`${basePath}/deals`} className="sf-featured-viewall" style={{ color: accent }}>
            View all deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>
      </SfReveal>

      {previewProducts.length > 0 ? (
        <SfStagger className="storefront-products-grid sf-home-deals-grid">
          {previewProducts.map((p) => (
            <SfStaggerItem key={p.id}>
              <StorefrontHomeProductCard
                product={p}
                accent={accent}
                currency={currency}
                onAdd={onAdd}
              />
            </SfStaggerItem>
          ))}
        </SfStagger>
      ) : null}
    </section>
  );
}
