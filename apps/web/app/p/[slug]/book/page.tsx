"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { publicBookingApi } from "@/lib/public-api";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontBookingFlow } from "@/components/features/storefront/storefront-booking-flow";
import { useStorefront } from "@/components/features/storefront/storefront-context";
import { StorefrontLoadingMotion } from "@/components/features/storefront/storefront-motion";

function BookContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service") ?? undefined;
  const { sf, accent, slug, basePath } = useStorefront();

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-booking", slug],
    queryFn: () => publicBookingApi.services(slug),
    enabled: !!slug,
  });

  if (!sf) return null;

  if (isLoading) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontLoadingMotion />
      </main>
    );
  }

  if (error || !data?.services?.length) {
    return (
      <main className="storefront-main storefront-main--flush">
        <StorefrontTextHero
          watermark="BOOK"
          title="Booking unavailable"
          description="This business is not accepting online bookings right now."
          accent={accent}
          crumbs={[{ label: "Book" }]}
        />
        <div className="storefront-shop-empty sf-book-unavailable">
          <p>Please contact the business directly or try again later.</p>
          <Link href={`${basePath}/contact`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
            Contact us
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontTextHero
        watermark="BOOK"
        eyebrow="Appointment"
        title={`Book with ${data.business.name}`}
        description="Choose a service, pick a time, review everything, then confirm — nothing is missed."
        accent={accent}
        crumbs={[
          { label: sf.nav_services_label || "Services", href: `${basePath}/services` },
          { label: "Book" },
        ]}
        meta={
          data.business.city ? (
            <span className="sf-text-hero-stat">
              <strong>{data.business.city}</strong>
              <span>Location</span>
            </span>
          ) : undefined
        }
      />

      <div className="sf-book-page-wrap">
        <StorefrontBookingFlow
          slug={slug}
          business={data.business}
          services={data.services}
          initialServiceId={serviceId}
          accent={accent}
        />
      </div>
    </main>
  );
}

export default function StorefrontBookPage() {
  return (
    <Suspense
      fallback={
        <main className="storefront-main">
          <StorefrontLoadingMotion />
        </main>
      }
    >
      <BookContent />
    </Suspense>
  );
}
