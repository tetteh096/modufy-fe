"use client";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import type { PublicProduct } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { primaryProductImage } from "./storefront-product-media";
import { effectivePrice, fmt, productDisplayPrice } from "./storefront-utils";

export function StorefrontHomeProductCard({
  product,
  accent,
  currency,
  onAdd,
  featured,
}: {
  product: PublicProduct;
  accent: string;
  currency: string;
  onAdd: (product: PublicProduct) => void;
  featured?: boolean;
}) {
  const { basePath } = useStorefront();
  const href = `${basePath}/shop/${product.id}`;
  const img = primaryProductImage(product);
  const { list, original, onDeal } = productDisplayPrice(product);
  const inStock = product.stock_qty > 0;
  const category = product.category || product.tags?.[0];

  return (
    <article className={`sf-pcard sf-pcard-luxury${featured ? " sf-pcard-featured" : ""}`}>
      <Link href={href} className="sf-pcard-media sf-pcard-luxury-media">
        <div className="sf-pcard-media-inner">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.name} loading="lazy" className="sf-pcard-img" />
          ) : (
            <div className="sf-pcard-placeholder">
              <ShoppingBag className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="sf-pcard-luxury-overlay" />
        {onDeal && inStock ? <span className="sf-pcard-badge sf-luxury-badge-sale">Sale</span> : null}
        {!inStock ? <span className="sf-pcard-badge sf-pcard-badge-muted sf-luxury-badge-soldout">Sold out</span> : null}
        {inStock ? (
          <button
            type="button"
            className="sf-pcard-quick sf-luxury-quick-add"
            style={{ background: accent }}
            onClick={(e) => {
              e.preventDefault();
              onAdd(product);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
            <span>Quick add</span>
          </button>
        ) : null}
      </Link>
      <div className="sf-pcard-info sf-pcard-luxury-info">
        <div className="sf-pcard-luxury-header">
          {category ? <p className="sf-pcard-cat sf-luxury-cat">{category}</p> : null}
          <span className="sf-luxury-status-dot" style={{ background: inStock ? accent : "#d1d5db" }} />
        </div>
        <Link href={href} className="sf-pcard-title-link">
          <h3 className="sf-luxury-title">{product.name}</h3>
        </Link>
        <div className="sf-pcard-price sf-luxury-price">
          {onDeal ? (
            <>
              <span className="sf-pcard-price-old sf-luxury-price-old">{fmt(original, currency)}</span>
              <span className="sf-luxury-price-active" style={{ color: accent }}>
                {fmt(list, currency)}
              </span>
            </>
          ) : (
            <span className="sf-luxury-price-active">{fmt(effectivePrice(product), currency)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
