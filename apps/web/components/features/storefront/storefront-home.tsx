"use client";

import Link from "next/link";
import {
  Headphones,
  MessageCircle,
  Phone,
  RefreshCw,
  Shield,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/media-url";
import { StorefrontHomeHero } from "./storefront-home-hero";
import { StorefrontHomeEditorial } from "./storefront-home-editorial";
import { StorefrontHomeFeatured } from "./storefront-home-featured";
import { StorefrontHomeDeals } from "./storefront-home-deals";
import { StorefrontHomeCta } from "./storefront-home-cta";
import { StorefrontHomeBlog } from "./storefront-home-blog";
import { useStorefront } from "./storefront-context";
import { buildCatalog } from "./storefront-catalog";
import { SfReveal, SfStagger, SfStaggerItem } from "./storefront-motion";

const TRUST_ITEMS = [
  { icon: RefreshCw, label: "Free returns", tone: "#f97316" },
  { icon: Headphones, label: "24/7 support", tone: "#a855f7" },
  { icon: Truck, label: "Fast processing", tone: "#e5e7eb" },
  { icon: Shield, label: "Customer support", tone: "#3b82f6" },
];

export function StorefrontHome() {
  const { sf, accent, currency, basePath, addToCart } = useStorefront();

  if (!sf) return null;

  const catalog = buildCatalog(sf.products);
  const products = sf.products;
  const editorials = catalog.slice(0, 3);

  return (
    <div className="sf-pve-page">
      <StorefrontHomeHero sf={sf} accent={accent} basePath={basePath} />

      <div className="sf-pve-band sf-pve-band--mist sf-luxury-trust-band">
        <div className="sf-pve-band-inner sf-luxury-trust-inner">
          <SfStagger className="sf-pve-trust-bar sf-luxury-trust-bar">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <SfStaggerItem key={item.label} className="sf-pve-trust-item sf-luxury-trust-item">
                  <span className="sf-pve-trust-icon sf-luxury-trust-icon" style={{ background: `color-mix(in srgb, ${accent} 10%, #ffffff)`, color: accent }}>
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="sf-luxury-trust-label">{item.label}</span>
                </SfStaggerItem>
              );
            })}
          </SfStagger>
        </div>
      </div>

      {sf.show_deals_section && (sf.promotions?.length ?? 0) > 0 ? (
        <div className="sf-pve-band sf-pve-band--white">
          <div className="sf-pve-band-inner">
            <StorefrontHomeDeals
              promotions={sf.promotions ?? []}
              accent={accent}
              currency={currency}
              basePath={basePath}
              onAdd={addToCart}
            />
          </div>
        </div>
      ) : null}

      {sf.show_products && products.length > 0 ? (
        <div className="sf-pve-band sf-pve-band--white">
          <div className="sf-pve-band-inner">
            <StorefrontHomeFeatured
              products={products}
              accent={accent}
              currency={currency}
              basePath={basePath}
              businessName={sf.business_name}
              shopLabel={sf.nav_shop_label}
              onAdd={addToCart}
            />
          </div>
        </div>
      ) : null}

      {editorials.map((cat, i) => (
        <div
          key={cat.name}
          className={i % 2 === 0 ? "sf-pve-band sf-pve-band--mist" : "sf-pve-band sf-pve-band--white"}
        >
          <div className="sf-pve-band-inner">
            <StorefrontHomeEditorial
              category={cat}
              accent={accent}
              basePath={basePath}
              businessName={sf.business_name}
              reverse={i % 2 === 1}
              index={i}
            />
          </div>
        </div>
      ))}

      {sf.reviews.length > 0 ? (
        <div className="sf-pve-band sf-pve-band--accent" style={{ ["--sf-band-accent" as string]: accent }}>
          <div className="sf-pve-band-inner">
            <section className="sf-pve-section">
              <SfReveal variant="fade">
                <header className="sf-pve-section-head sf-pve-section-head-center">
                  <span className="sf-label">⭐ Customer reviews</span>
                  <h2>What our customers say</h2>
                  {sf.review_count > 0 ? (
                    <p>
                      {sf.avg_rating.toFixed(1)} average from {sf.review_count} reviews
                    </p>
                  ) : null}
                </header>
              </SfReveal>
              <SfStagger className="sf-reviews">
                {sf.reviews.slice(0, 3).map((r) => (
                  <SfStaggerItem key={r.id}>
                  <blockquote className="sf-review">
                    <span className="sf-review-verified">✓ Verified</span>
                    <div className="sf-review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < r.rating ? "sf-star-filled" : ""}`} />
                      ))}
                    </div>
                    {r.comment ? <p>&ldquo;{r.comment}&rdquo;</p> : null}
                    <footer>
                      <strong>{r.reviewer_name}</strong>
                    </footer>
                  </blockquote>
                  </SfStaggerItem>
                ))}
              </SfStagger>
              {sf.review_count > 0 ? (
                <SfReveal delay={0.22}>
                <div className="sf-pve-stats">
                  <div>
                    <strong>{sf.review_count}+</strong>
                    <span>Happy customers</span>
                  </div>
                  <div>
                    <strong>{sf.avg_rating.toFixed(1)}★</strong>
                    <span>Average rating</span>
                  </div>
                  <div>
                    <strong>99%</strong>
                    <span>Satisfaction</span>
                  </div>
                  <div>
                    <strong>24/7</strong>
                    <span>Support</span>
                  </div>
                </div>
                </SfReveal>
              ) : null}
            </section>
          </div>
        </div>
      ) : null}

      <StorefrontHomeBlog />

      <div className="sf-pve-band sf-pve-band--mist">
        <div className="sf-pve-band-inner">
          <SfReveal className="sf-pve-about" variant="scale">
            <div className="sf-pve-about-copy">
              <span className="sf-label">About</span>
              <h2>{sf.business_name}</h2>
              <p>
                {sf.bio || sf.tagline || `Welcome to ${sf.business_name} — your destination for quality products and service.`}
              </p>
              <Link href={`${basePath}/contact`} className="sf-btn sf-btn-ghost">
                Contact us
              </Link>
            </div>
            {sf.logo_url ? (
              <div className="sf-pve-about-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveMediaUrl(sf.logo_url)} alt={sf.business_name} />
              </div>
            ) : (
              <div className="sf-pve-about-mark" style={{ background: accent }}>
                {sf.business_name.slice(0, 1)}
              </div>
            )}
          </SfReveal>
        </div>
      </div>

      {products.length === 0 && sf.services.length === 0 ? (
        <div className="sf-pve-band sf-pve-band--white">
          <div className="sf-pve-band-inner">
            <section className="sf-empty">
              <ShoppingBag className="h-12 w-12" />
              <h2>Opening soon</h2>
              <p>Our collection is on the way. Reach out while we get everything ready.</p>
              <Link href={`${basePath}/contact`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
                Contact us
              </Link>
            </section>
          </div>
        </div>
      ) : null}

      <div className="sf-pve-band sf-pve-band--white">
        <div className="sf-pve-band-inner">
          <StorefrontHomeCta sf={sf} accent={accent} basePath={basePath} productCount={products.length} />
        </div>
      </div>

    </div>
  );
}
