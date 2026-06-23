"use client";

import { Suspense } from "react";
import { StorefrontPageHeader } from "@/components/features/storefront/storefront-page-header";
import { StorefrontShop } from "@/components/features/storefront/storefront-shop";
import { useStorefront } from "@/components/features/storefront/storefront-context";

function ShopContent() {
  const { sf, accent, currency, addToCart } = useStorefront();

  if (!sf) return null;

  if (!sf.show_products || sf.products.length === 0) {
    return (
      <main className="storefront-main">
        <StorefrontPageHeader
          title={sf.nav_shop_label || "Shop"}
          description="No products listed yet."
        />
        <div className="storefront-shop-empty">Check back soon for new items.</div>
      </main>
    );
  }

  return (
    <main className="storefront-main">
      <StorefrontPageHeader
        title={sf.nav_shop_label || "Shop"}
        description={`Browse ${sf.products.length} product${sf.products.length !== 1 ? "s" : ""} from ${sf.business_name}`}
        crumbs={[{ label: sf.nav_shop_label || "Shop" }]}
      />
      <StorefrontShop
        products={sf.products}
        accent={accent}
        currency={currency}
        title=""
        onAdd={addToCart}
      />
    </main>
  );
}

export default function StorefrontShopPage() {
  return (
    <Suspense fallback={<main className="storefront-main"><div className="storefront-shop-empty">Loading shop…</div></main>}>
      <ShopContent />
    </Suspense>
  );
}
