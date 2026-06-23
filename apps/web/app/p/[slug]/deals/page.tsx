"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { StorefrontPageHeader } from "@/components/features/storefront/storefront-page-header";
import { StorefrontDealsPage } from "@/components/features/storefront/storefront-deals-page";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export default function StorefrontDealsRoutePage() {
  const { slug, sf, accent, currency, basePath, addToCart } = useStorefront();

  const { data, isLoading } = useQuery({
    queryKey: ["storefront-promotions", slug],
    queryFn: () => publicApi.promotions(slug),
    enabled: Boolean(slug) && Boolean(sf?.show_deals_section),
  });

  if (!sf) return null;

  if (!sf.show_deals_section) {
    return (
      <main className="storefront-main">
        <StorefrontPageHeader title="Deals" description="Deals are not available right now." crumbs={[{ label: "Deals" }]} />
      </main>
    );
  }

  return (
    <main className="storefront-main">
      <StorefrontPageHeader
        title="Deals"
        description="Current promotions and discounted products"
        crumbs={[{ label: "Deals" }]}
      />
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <StorefrontDealsPage
          promotions={data?.promotions ?? sf.promotions ?? []}
          accent={accent}
          currency={currency}
          onAdd={addToCart}
        />
      )}
    </main>
  );
}
