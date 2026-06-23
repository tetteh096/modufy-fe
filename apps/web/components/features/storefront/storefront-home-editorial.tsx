"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { CatalogCategory } from "./storefront-catalog";
import {
  categoryShopUrl,
  editorialSecondaryImage,
  editorialVisualImage,
  productImage,
} from "./storefront-catalog";
import { fmt, productDisplayPrice } from "./storefront-utils";
import { useStorefront } from "./storefront-context";
import { SfReveal } from "./storefront-motion";

const BAND_TONES = ["premium", "luxury", "signature"] as const;

function displayCategoryName(name: string) {
  return name === "General" ? "Collection" : name;
}

function editorialHeadline(
  displayName: string,
  tone: (typeof BAND_TONES)[number],
  productCount: number,
) {
  if (displayName === "Collection" || productCount <= 1) {
    const collectionHeadlines: Record<string, string> = {
      premium: "Crafted to make a statement",
      luxury: "Everyday excellence, thoughtfully curated",
      signature: "Discover our signature selection",
    };
    return collectionHeadlines[tone];
  }
  const headlines: Record<string, string> = {
    premium: `${displayName} that make a statement`,
    luxury: `${displayName} crafted for everyday excellence`,
    signature: `Discover our signature ${displayName.toLowerCase()}`,
  };
  return headlines[tone];
}

function editorialLead(businessName: string) {
  return `Exceptional pieces from ${businessName} — selected for quality, fit, and style that elevates your everyday wardrobe.`;
}

export function StorefrontHomeEditorial({
  category,
  accent,
  basePath,
  businessName,
  reverse,
  index = 0,
}: {
  category: CatalogCategory;
  accent: string;
  basePath: string;
  businessName: string;
  reverse?: boolean;
  index?: number;
}) {
  const { sf, currency } = useStorefront();
  if (!sf) return null;

  const tone = BAND_TONES[index % BAND_TONES.length];
  const displayName = displayCategoryName(category.name);
  const productCount = category.products.length;
  const headline = editorialHeadline(displayName, tone, productCount);
  const lead = editorialLead(businessName);
  const shopHref = categoryShopUrl(basePath, category.name);
  const heroImg = editorialVisualImage(sf, index);
  const secondaryImg = editorialSecondaryImage(sf, index);

  return (
    <SfReveal
      as="section"
      className={`sf-pve-editorial sf-editorial-luxury ${reverse ? "sf-pve-editorial-reverse" : ""}`}
      variant={reverse ? "up" : "scale"}
    >
      <div className="sf-pve-editorial-copy">
        <div className="sf-editorial-eyebrow-container">
          <p className="sf-pve-editorial-tag sf-editorial-luxury-tag">
            <span className="sf-editorial-accent-line" style={{ background: accent }} />
            <span className="sf-editorial-eyebrow-stack">
              <span className="sf-editorial-eyebrow-kicker">{tone}</span>
              <span className="sf-editorial-eyebrow-name" style={{ color: accent }}>
                {displayName}
              </span>
            </span>
          </p>
          {productCount > 0 ? (
            <span className="sf-editorial-count">
              {productCount} {productCount === 1 ? "piece" : "pieces"}
            </span>
          ) : null}
        </div>

        <h2 className="sf-editorial-title">{headline}</h2>
        <p className="sf-pve-editorial-lead sf-editorial-description">{lead}</p>

        <div className="sf-pve-feature-cards sf-editorial-features">
          {category.products.slice(0, 2).map((p, idx) => {
            const thumb = productImage(p);
            const { list: price, original: was, onDeal: deal } = productDisplayPrice(p);
            return (
              <Link
                key={p.id}
                href={`${basePath}/shop/${p.id}`}
                className="sf-pve-feature-card sf-editorial-feature-card"
              >
                <div className="sf-editorial-card-content">
                  {thumb ? (
                    <div className="sf-editorial-card-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <span className="sf-editorial-num">0{idx + 1}</span>
                  )}
                  <div className="sf-editorial-card-body">
                    <strong>{p.name}</strong>
                    <span>
                      {p.description?.trim() ||
                        `Thoughtfully made ${displayName.toLowerCase()} — ready to shop.`}
                    </span>
                    <span className="sf-editorial-card-price">
                      {deal ? (
                        <>
                          <s>{fmt(was, p.currency || currency)}</s>
                          <em style={{ color: accent }}>{fmt(price, p.currency || currency)}</em>
                        </>
                      ) : (
                        <em>{fmt(price, p.currency || currency)}</em>
                      )}
                    </span>
                  </div>
                  <ArrowUpRight className="sf-editorial-card-arrow h-4 w-4" aria-hidden />
                </div>
              </Link>
            );
          })}
          {category.products.length === 0 ? (
            <div className="sf-pve-feature-card sf-editorial-feature-card">
              <div className="sf-editorial-card-content">
                <span className="sf-editorial-num">✦</span>
                <div className="sf-editorial-card-body">
                  <strong>Shop {displayName}</strong>
                  <span>Browse the full range and find your next favourite piece.</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="sf-editorial-actions">
          <Link
            href={shopHref}
            className="sf-btn sf-btn-solid sf-editorial-btn"
            style={{ background: accent }}
          >
            Shop {displayName}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="sf-pve-editorial-visual sf-editorial-gallery">
        <div
          className="sf-editorial-backdrop-glow"
          style={{ background: `color-mix(in srgb, ${accent} 6%, transparent)` }}
        />
        <Link href={shopHref} className="sf-editorial-visual-link sf-pve-editorial-frame sf-editorial-main-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={`${displayName} from ${businessName}`} loading="lazy" className="sf-editorial-img" />
        </Link>
        <div className="sf-editorial-caption">
          <strong>{displayName}</strong>
          <span>Explore the full range</span>
        </div>
        {secondaryImg ? (
          <Link
            href={shopHref}
            className="sf-pve-editorial-frame sf-pve-editorial-frame-secondary sf-editorial-sub-frame"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={secondaryImg} alt="" loading="lazy" className="sf-editorial-img" />
            <span className="sf-editorial-overlap-badge" style={{ background: accent }}>
              New
            </span>
          </Link>
        ) : null}
      </div>
    </SfReveal>
  );
}
