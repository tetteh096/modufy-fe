"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sparkles,
  Clock,
} from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { OsmMap } from "@/components/shared/osm-map";
import { googleMapsUrl, hasValidCoords, mapCenterForCountry } from "@/lib/geo";
import { StorefrontContactForm } from "./storefront-contact-form";
import { StorefrontHoursList } from "./storefront-hours";

export function StorefrontContactSection({ sf, accent }: { sf: PublicStorefront; accent: string }) {
  const { basePath } = useStorefront();
  const location = [sf.area, sf.city, sf.country].filter(Boolean).join(", ");
  const hasShop = sf.show_products && sf.products.length > 0;

  const channels = [
    sf.show_phone && sf.phone
      ? {
          key: "phone",
          label: "Call us",
          value: sf.phone,
          href: `tel:${sf.phone}`,
          icon: Phone,
          primary: true,
        }
      : null,
    sf.show_whatsapp && sf.whatsapp
      ? {
          key: "whatsapp",
          label: "WhatsApp",
          value: "Chat on WhatsApp",
          href: `https://wa.me/${sf.whatsapp.replace(/\D/g, "")}`,
          icon: MessageCircle,
          external: true,
          wa: true,
        }
      : null,
    sf.show_email && sf.email
      ? {
          key: "email",
          label: "Email",
          value: sf.email,
          href: `mailto:${sf.email}`,
          icon: Mail,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string;
    icon: typeof Phone;
    primary?: boolean;
    external?: boolean;
    wa?: boolean;
  }[];

  return (
    <section className="sf-contact-section">
      <div className="sf-contact-layout">
        <div className="sf-contact-main">
          <div className="sf-contact-intro-card">
            <span className="sf-contact-kicker">
              <Sparkles className="h-4 w-4" />
              {sf.nav_contact_label || "Get in touch"}
            </span>
            <h2>How can we help?</h2>
            <p>
              {sf.bio ||
                `Reach out to ${sf.business_name} for orders, product questions, or anything else on your mind.`}
            </p>
          </div>

          {channels.length > 0 ? (
            <div className="sf-contact-channels">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.key}
                    href={ch.href}
                    target={ch.external ? "_blank" : undefined}
                    rel={ch.external ? "noopener noreferrer" : undefined}
                    className={`sf-contact-channel${ch.primary ? " sf-contact-channel-primary" : ""}${ch.wa ? " sf-contact-channel-wa" : ""}`}
                    style={ch.primary ? { borderColor: accent } : undefined}
                  >
                    <span className="sf-contact-channel-icon" style={{ color: accent }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="sf-contact-channel-copy">
                      <strong>{ch.label}</strong>
                      <span>{ch.value}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 sf-contact-channel-arrow" />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="sf-contact-empty-channels">
              <p>Contact details are not published yet. Check back soon.</p>
            </div>
          )}

          <StorefrontContactForm accent={accent} />
        </div>

        <aside className="sf-contact-aside">
          {location ? (
            <div className="sf-contact-card">
              <h3>
                <MapPin className="h-4 w-4" style={{ color: accent }} />
                Visit us
              </h3>
              <p className="sf-contact-location">{location}</p>
              {sf.area && sf.city ? (
                <p className="sf-contact-location-sub">We serve customers across {sf.city} and beyond.</p>
              ) : null}
              {hasValidCoords(sf.latitude, sf.longitude) ? (
                <div className="sf-contact-map-wrap">
                  <OsmMap
                    mode="view"
                    latitude={sf.latitude}
                    longitude={sf.longitude}
                    defaultCenter={mapCenterForCountry(sf.country)}
                    height="14rem"
                    className="sf-contact-map"
                  />
                  <a
                    href={googleMapsUrl(sf.latitude!, sf.longitude!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sf-contact-map-directions"
                    style={{ background: accent }}
                  >
                    Open in Google Maps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}

          {sf.show_hours && sf.hours_enabled && sf.hours?.length ? (
            <div className="sf-contact-card">
              <h3>
                <Clock className="h-4 w-4" style={{ color: accent }} />
                Opening hours
              </h3>
              <StorefrontHoursList hours={sf.hours} accent={accent} compact />
            </div>
          ) : null}

          {sf.website ? (
            <div className="sf-contact-card">
              <h3>
                <Globe className="h-4 w-4" style={{ color: accent }} />
                Website
              </h3>
              <a
                href={sf.website}
                target="_blank"
                rel="noopener noreferrer"
                className="sf-contact-link"
              >
                {sf.website.replace(/^https?:\/\//, "")}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : null}

          {hasShop ? (
            <div className="sf-contact-card sf-contact-card-accent" style={{ ["--sf-contact-accent" as string]: accent }}>
              <h3>
                <ShoppingBag className="h-4 w-4" />
                Shop while you're here
              </h3>
              <p>Browse products or see what's new this week.</p>
              <div className="sf-contact-quick-links">
                <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
                  Shop
                </Link>
                <Link href={`${basePath}/new-arrivals`} className="sf-btn sf-btn-ghost">
                  New Arrivals
                </Link>
              </div>
            </div>
          ) : null}

          {sf.review_count > 0 ? (
            <div className="sf-contact-card sf-contact-card-muted">
              <p className="sf-contact-rating-label">Customer rating</p>
              <p className="sf-contact-rating">
                <strong>{sf.avg_rating.toFixed(1)}</strong>
                <span>from {sf.review_count} reviews</span>
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
