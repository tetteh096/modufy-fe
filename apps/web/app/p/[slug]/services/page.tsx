"use client";

import { Suspense } from "react";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontServices } from "@/components/features/storefront/storefront-services";
import { useStorefront } from "@/components/features/storefront/storefront-context";

function ServicesContent() {
  const { sf, accent } = useStorefront();

  if (!sf) return null;

  const services = sf.show_services ? sf.services : [];
  const bookableCount = services.filter((s) => s.is_bookable).length;
  const label = sf.nav_services_label || "Services";

  if (!sf.show_services || services.length === 0) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero
          watermark="BOOK"
          eyebrow={label}
          title={label}
          description="Services will appear here once they are published on your storefront."
          accent={accent}
          crumbs={[{ label }]}
        />
        <div className="storefront-shop-empty sf-services-empty">
          <p>Check back soon — or contact the business directly.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontTextHero
        watermark="BOOK"
        eyebrow={label}
        title={`Book with ${sf.business_name}`}
        description={`Choose a service, then complete booking on the next page with date, details, and a full review before you confirm.`}
        accent={accent}
        crumbs={[{ label }]}
        meta={
          bookableCount > 0 ? (
            <span className="sf-text-hero-stat">
              <strong>{bookableCount}</strong>
              <span>bookable online</span>
            </span>
          ) : (
            <span className="sf-text-hero-stat">
              <strong>{services.length}</strong>
              <span>services listed</span>
            </span>
          )
        }
      />

      <div className="sf-services-page-wrap">
        <StorefrontServices
          services={services}
          accent={accent}
          currency={services[0]?.currency ?? "GHS"}
        />
      </div>
    </main>
  );
}

export default function StorefrontServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="storefront-main">
          <div className="storefront-shop-empty">Loading services…</div>
        </main>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
