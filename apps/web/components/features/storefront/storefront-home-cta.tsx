"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, Shield, Truck } from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { SfReveal } from "./storefront-motion";

export function StorefrontHomeCta({
  sf,
  accent,
  basePath,
  productCount,
}: {
  sf: PublicStorefront;
  accent: string;
  basePath: string;
  productCount: number;
}) {
  const location = [sf.area, sf.city, sf.country].filter(Boolean).join(", ");
  const hasShop = sf.show_products && productCount > 0;

  const lead = sf.tagline
    ? sf.tagline
    : hasShop
      ? `Browse ${productCount} ${productCount === 1 ? "product" : "products"} curated by ${sf.business_name}${sf.city ? ` — delivered across ${sf.city}` : "."}`
      : `${sf.business_name} is ready to help. Reach out for orders, questions, or support.`;

  const contactItems = [
    sf.show_phone && sf.phone
      ? { icon: Phone, label: "Call us", href: `tel:${sf.phone}`, value: sf.phone }
      : null,
    sf.show_whatsapp && sf.whatsapp
      ? {
          icon: MessageCircle,
          label: "WhatsApp",
          href: `https://wa.me/${sf.whatsapp.replace(/\D/g, "")}`,
          value: "Chat on WhatsApp",
        }
      : null,
    sf.show_email && sf.email
      ? { icon: Mail, label: "Email", href: `mailto:${sf.email}`, value: sf.email }
      : null,
    location ? { icon: MapPin, label: "Location", value: location } : null,
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    href?: string;
    value: string;
  }[];

  return (
    <SfReveal as="section" className="sf-cta-premium" variant="scale" style={{ ["--sf-cta" as string]: accent }}>
      <div className="sf-cta-premium-accent" aria-hidden />

      <div className="sf-cta-premium-grid">
        <div className="sf-cta-premium-main">
          <span className="sf-cta-premium-eyebrow">Get started</span>
          <h2>
            Ready to shop at{" "}
            <span className="sf-cta-premium-highlight">{sf.business_name}</span>?
          </h2>
          <p>{lead}</p>

          <ul className="sf-cta-premium-trust">
            <li>
              <Truck className="h-4 w-4" />
              Fast fulfilment
            </li>
            <li>
              <Shield className="h-4 w-4" />
              Secure checkout
            </li>
          </ul>

          <div className="sf-cta-premium-actions">
            {hasShop ? (
              <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid sf-cta-btn-primary" style={{ background: accent }}>
                {sf.nav_shop_label || "Shop collection"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link href={`${basePath}/contact`} className="sf-btn sf-btn-outline sf-cta-btn-secondary">
              {sf.nav_contact_label || "Contact us"}
            </Link>
          </div>
        </div>

        {contactItems.length > 0 ? (
          <aside className="sf-cta-premium-aside">
            <p className="sf-cta-premium-aside-title">We&apos;re here to help</p>
            <ul className="sf-cta-premium-contact">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <span className="sf-cta-premium-contact-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </span>
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        ) : null}
      </div>
    </SfReveal>
  );
}
