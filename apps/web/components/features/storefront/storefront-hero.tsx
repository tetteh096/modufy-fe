"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { PublicStorefront } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { portfolioForHero } from "./storefront-catalog";

type StorefrontHeroProps = {
  sf: PublicStorefront;
  accent: string;
  compact?: boolean;
};

export function StorefrontHero({ sf, accent, compact }: StorefrontHeroProps) {
  const base = `/p/${sf.business_slug}`;

  const slides = useMemo(() => {
    const heroImages = portfolioForHero(sf);
    if (heroImages.length > 0) {
      return heroImages.map((img) => ({
        url: resolveMediaUrl(img.url),
        caption: img.caption,
      }));
    }
    if (sf.logo_url) {
      return [{ url: resolveMediaUrl(sf.logo_url), caption: sf.business_name }];
    }
    return [];
  }, [sf.portfolio, sf.logo_url, sf.business_name]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const headline = sf.hero_headline || sf.header_text || sf.business_name;
  const subheadline =
    sf.hero_subheadline ||
    sf.tagline ||
    sf.bio ||
    (sf.city ? `Serving customers in ${sf.city}` : "");

  const hasShop = sf.show_products && sf.products.length > 0;
  const hasServices = sf.show_services && sf.services.length > 0;

  const heroContent = (
    <div className="storefront-hero-content">
      {sf.category ? (
        <p className="storefront-hero-kicker">{sf.category}</p>
      ) : (
        <p className="storefront-hero-kicker">{sf.city || "Welcome"}</p>
      )}
      <h1 className="storefront-hero-title">{headline}</h1>
      {subheadline ? <p className="storefront-hero-sub">{subheadline}</p> : null}
      <div className="storefront-hero-actions">
        {hasShop ? (
          <Link
            href={`${base}/shop`}
            className="storefront-hero-cta"
            style={{ ["--sf-accent" as string]: accent }}
          >
            {sf.nav_shop_label || "Shop now"}
          </Link>
        ) : null}
        {hasServices ? (
          <Link href={`${base}/services`} className="storefront-hero-cta storefront-hero-cta-outline">
            {sf.nav_services_label || "Our services"}
          </Link>
        ) : null}
      </div>
    </div>
  );

  return (
    <section
      className={compact ? "storefront-hero storefront-hero-compact" : "storefront-hero storefront-section"}
      style={{ ["--sf-accent" as string]: accent }}
    >
      {slides.length > 0 ? (
        <div className="storefront-hero-frame">
          {slides.map((slide, i) => (
            <div key={`${slide.url}-${i}`} className={`storefront-hero-slide ${i === index ? "is-active" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.url} alt={slide.caption || sf.business_name} />
            </div>
          ))}
          <div className="storefront-hero-overlay" />
          {slides.length > 1 ? (
            <div className="storefront-hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  className={`storefront-hero-dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          ) : null}
          {heroContent}
        </div>
      ) : (
        <div className="storefront-hero-fallback">{heroContent}</div>
      )}
    </section>
  );
}
