"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, ShoppingBag } from "lucide-react";
import type { PublicProduct } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { primaryProductImage } from "./storefront-product-media";
import { fmt, getPrice, productDisplayPrice, productInStock, productNeedsVariantSelection } from "./storefront-utils";
import { SfReveal } from "./storefront-motion";

export function StorefrontPdpRelated({
  products,
  accent,
  currency,
}: {
  products: PublicProduct[];
  accent: string;
  currency: string;
}) {
  const { basePath, addToCart } = useStorefront();
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollTrack(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  }

  return (
    <SfReveal className="sf-pdp-related-block" variant="up" delay={0.15}>
      <div className="sf-pdp-related-head">
        <div>
          <p className="sf-pdp-related-kicker">Complete your look</p>
          <h2 className="sf-pdp-related-title">You may also like</h2>
        </div>
        <div className="sf-pdp-related-actions">
          <button type="button" className="sf-pdp-related-nav" onClick={() => scrollTrack(-1)} aria-label="Scroll left">
            ←
          </button>
          <button type="button" className="sf-pdp-related-nav" onClick={() => scrollTrack(1)} aria-label="Scroll right">
            →
          </button>
          <Link href={`${basePath}/shop`} className="sf-pdp-related-all" style={{ color: accent }}>
            Shop all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="sf-pdp-3d-stage" ref={trackRef}>
        {products.map((product, i) => {
          const img = primaryProductImage(product);
          const { list, onDeal } = productDisplayPrice(product);
          const inStock = productInStock(product);
          const needsOptions = productNeedsVariantSelection(product);
          const href = `${basePath}/shop/${product.id}`;

          return (
            <article
              key={product.id}
              className="sf-pdp-3d-card"
              style={{ ["--sf-3d-i" as string]: i }}
            >
              <Link href={href} className="sf-pdp-3d-card-media">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={product.name} loading="lazy" />
                ) : (
                  <div className="sf-pdp-3d-card-placeholder">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                )}
                {onDeal ? <span className="sf-pdp-3d-card-badge">Sale</span> : null}
              </Link>
              <div className="sf-pdp-3d-card-body">
                {product.category ? (
                  <p className="sf-pdp-3d-card-cat" style={{ color: accent }}>
                    {product.category}
                  </p>
                ) : null}
                <Link href={href} className="sf-pdp-3d-card-name">
                  {product.name}
                </Link>
                <div className="sf-pdp-3d-card-footer">
                  <span className="sf-pdp-3d-card-price">{fmt(onDeal ? list : getPrice(product), currency)}</span>
                  <button
                    type="button"
                    disabled={!inStock}
                    className="sf-pdp-3d-card-add"
                    style={inStock ? { background: accent } : undefined}
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => {
                      if (needsOptions) {
                        router.push(href);
                        return;
                      }
                      addToCart(product);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SfReveal>
  );
}
