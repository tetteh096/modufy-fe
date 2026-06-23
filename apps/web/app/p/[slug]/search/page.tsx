"use client";

import { Suspense } from "react";
import { StorefrontPageHeader } from "@/components/features/storefront/storefront-page-header";
import { StorefrontSearch } from "@/components/features/storefront/storefront-search";
import { useStorefront } from "@/components/features/storefront/storefront-context";

function SearchContent() {
  const { sf, accent, currency, addToCart } = useStorefront();

  if (!sf) return null;

  if (!sf.show_products || sf.products.length === 0) {
    return (
      <main className="storefront-main">
        <StorefrontPageHeader title="Search" description="No products to search yet." crumbs={[{ label: "Search" }]} />
        <div className="storefront-shop-empty">Check back soon for new items.</div>
      </main>
    );
  }

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontSearch
        products={sf.products}
        accent={accent}
        currency={currency}
        businessName={sf.business_name}
        onAdd={addToCart}
      />
    </main>
  );
}

export default function StorefrontSearchPage() {
  return (
    <Suspense
      fallback={
        <main className="storefront-main">
          <div className="storefront-shop-empty">Loading search…</div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
