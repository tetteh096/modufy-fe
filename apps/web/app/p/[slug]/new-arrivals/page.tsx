"use client";

import { StorefrontNewArrivals } from "@/components/features/storefront/storefront-new-arrivals";
import { StorefrontPageHeader } from "@/components/features/storefront/storefront-page-header";
import { NEW_ARRIVAL_DAYS } from "@/components/features/storefront/storefront-utils";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export default function StorefrontNewArrivalsPage() {
  const { sf, accent, currency, addToCart } = useStorefront();

  if (!sf) return null;

  if (!sf.show_products || sf.products.length === 0) {
    return (
      <main className="storefront-main">
        <StorefrontPageHeader
          title="New Arrivals"
          description="No products listed yet."
          crumbs={[{ label: "New Arrivals" }]}
        />
        <div className="storefront-shop-empty">Check back soon for new items.</div>
      </main>
    );
  }

  return (
    <main className="storefront-main">
      <StorefrontPageHeader
        title="New Arrivals"
        description={`Products added in the last ${NEW_ARRIVAL_DAYS} days`}
        crumbs={[{ label: "New Arrivals" }]}
      />
      <StorefrontNewArrivals
        products={sf.products}
        accent={accent}
        currency={currency}
        businessName={sf.business_name}
        onAdd={addToCart}
      />
    </main>
  );
}
