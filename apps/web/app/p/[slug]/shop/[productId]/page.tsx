"use client";

import { use } from "react";
import Link from "next/link";
import { StorefrontPdpTopbar } from "@/components/features/storefront/storefront-pdp-topbar";
import { StorefrontProductDetail } from "@/components/features/storefront/storefront-product-detail";
import { getRelatedProducts } from "@/components/features/storefront/storefront-catalog";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export default function StorefrontProductPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { productId } = use(params);
  const { sf, accent, basePath } = useStorefront();

  if (!sf) return null;

  const product = sf.products.find((p) => p.id === productId);

  if (!product) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontPdpTopbar crumbs={[{ label: "Shop", href: `${basePath}/shop` }, { label: "Not found" }]} />
        <div className="storefront-shop-empty">
          <p>This product is no longer available.</p>
          <Link href={`${basePath}/shop`} className="storefront-section-link" style={{ color: accent }}>
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(sf.products, product);

  return (
    <main className="storefront-main storefront-main--pdp storefront-main--flush">
      <StorefrontPdpTopbar
        crumbs={[
          { label: sf.nav_shop_label || "Shop", href: `${basePath}/shop` },
          { label: product.name },
        ]}
      />
      <div className="sf-pdp-page">
        <StorefrontProductDetail product={product} relatedProducts={related} />
      </div>
    </main>
  );
}
