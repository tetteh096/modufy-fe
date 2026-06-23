"use client";

import { use } from "react";
import Link from "next/link";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontServiceDetail } from "@/components/features/storefront/storefront-service-detail";
import { StorefrontServiceCard } from "@/components/features/storefront/storefront-service-card";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export default function StorefrontServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const { sf, accent, basePath } = useStorefront();

  if (!sf) return null;

  const label = sf.nav_services_label || "Services";
  const service = sf.services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero watermark="BOOK" title="Service not found" accent={accent} />
        <div className="storefront-shop-empty">
          <p>This service is no longer available.</p>
          <Link href={`${basePath}/services`} className="storefront-section-link" style={{ color: accent }}>
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  const related = sf.services
    .filter((s) => s.id !== service.id && (s.category === service.category || !service.category))
    .slice(0, 3);

  return (
    <main className="storefront-main storefront-main--pdp storefront-main--flush">
      <StorefrontTextHero
        watermark="BOOK"
        eyebrow={service.category || label}
        title={service.name}
        accent={accent}
        crumbs={[
          { label, href: `${basePath}/services` },
          { label: service.name },
        ]}
      />

      <div className="sf-svc-detail-page">
        <StorefrontServiceDetail service={service} />
      </div>

      {related.length > 0 ? (
        <section className="storefront-section sf-svc-related">
          <h2 className="storefront-section-title">More services</h2>
          <div className="storefront-products-grid sf-services-grid">
            {related.map((s) => (
              <StorefrontServiceCard key={s.id} service={s} accent={accent} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
