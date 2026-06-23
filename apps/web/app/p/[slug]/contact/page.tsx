"use client";

import Link from "next/link";
import { Clock, Headphones, MessageCircle } from "lucide-react";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import { StorefrontContactSection } from "@/components/features/storefront/storefront-contact-section";
import { useStorefront } from "@/components/features/storefront/storefront-context";

export default function StorefrontContactPage() {
  const { sf, accent, basePath } = useStorefront();

  if (!sf) return null;

  const location = [sf.area, sf.city, sf.country].filter(Boolean).join(", ");
  const primaryPhone = sf.show_phone && sf.phone ? sf.phone : sf.show_whatsapp && sf.whatsapp ? sf.whatsapp : null;

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontTextHero
        watermark="HELLO"
        eyebrow={sf.nav_contact_label || "Contact"}
        title={`Talk to ${sf.business_name}`}
        description={
          sf.tagline ||
          `Questions about an order, a product, or a booking? Reach out — we'd love to hear from you.`
        }
        accent={accent}
        crumbs={[{ label: sf.nav_contact_label || "Contact" }]}
        meta={
          <>
            {primaryPhone ? (
              <span className="sf-text-hero-stat">
                <strong>{primaryPhone}</strong>
                <span>Direct line</span>
              </span>
            ) : null}
            {location ? (
              <span className="sf-text-hero-stat">
                <strong>{sf.city || sf.country}</strong>
                <span>{location}</span>
              </span>
            ) : null}
            {sf.show_products && sf.products.length > 0 ? (
              <Link href={`${basePath}/shop`} className="sf-text-hero-link">
                Browse shop while you wait
              </Link>
            ) : null}
          </>
        }
      />

      <div className="sf-contact-page">
        <div className="sf-contact-trust">
          <span>
            <Headphones className="h-4 w-4" />
            Friendly support
          </span>
          {sf.show_whatsapp && sf.whatsapp ? (
            <span>
              <MessageCircle className="h-4 w-4" />
              WhatsApp available
            </span>
          ) : null}
          <span>
            <Clock className="h-4 w-4" />
            We reply as soon as we can
          </span>
        </div>
        <StorefrontContactSection sf={sf} accent={accent} />
      </div>
    </main>
  );
}
