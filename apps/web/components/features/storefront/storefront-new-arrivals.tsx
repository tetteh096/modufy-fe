"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { StorefrontProductCard } from "./storefront-product-card";
import { NEW_ARRIVAL_DAYS, daysSinceCreated, filterNewArrivals } from "./storefront-utils";
import { useStorefront } from "./storefront-context";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";

export function StorefrontNewArrivals({
  products,
  accent,
  currency,
  businessName,
  onAdd,
}: {
  products: PublicProduct[];
  accent: string;
  currency: string;
  businessName: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  const { basePath } = useStorefront();
  const arrivals = filterNewArrivals(products, NEW_ARRIVAL_DAYS);

  return (
    <section className="sf-new-arrivals">
      <SfReveal className="sf-new-arrivals-banner" variant="fade" style={{ ["--sf-arrivals-accent" as string]: accent }}>
        <div className="sf-new-arrivals-banner-copy">
          <span className="sf-new-arrivals-eyebrow">
            <Sparkles className="h-4 w-4" />
            Just dropped
          </span>
          <h2>New Arrivals</h2>
          <p>
            Fresh picks from {businessName} — added in the last {NEW_ARRIVAL_DAYS} days.
          </p>
        </div>
        <Link href={`${basePath}/shop`} className="sf-btn sf-btn-outline sf-new-arrivals-link">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </SfReveal>

      {arrivals.length === 0 ? (
        <div className="sf-new-arrivals-empty">
          <p>No new arrivals in the last {NEW_ARRIVAL_DAYS} days yet.</p>
          <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
            Browse the shop
          </Link>
        </div>
      ) : (
        <SfStagger className="storefront-products-grid sf-new-arrivals-grid">
          {arrivals.map((p) => {
            const days = daysSinceCreated(p);
            return (
              <SfStaggerItem key={p.id} className="sf-new-arrivals-card-wrap">
                {days !== null && days <= 7 ? (
                  <span className="sf-new-arrivals-badge" style={{ background: accent }}>
                    New this week
                  </span>
                ) : (
                  <span className="sf-new-arrivals-badge sf-new-arrivals-badge-muted">New arrival</span>
                )}
                <StorefrontProductCard
                  product={p}
                  accent={accent}
                  currency={currency}
                  onAdd={onAdd}
                />
              </SfStaggerItem>
            );
          })}
        </SfStagger>
      )}
    </section>
  );
}
