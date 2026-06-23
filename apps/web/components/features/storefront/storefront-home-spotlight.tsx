"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import type { PublicProduct } from "@/types/api";
import { primaryProductImage } from "./storefront-product-media";
import { fmt, productDisplayPrice } from "./storefront-utils";

export function StorefrontHomeSpotlight({
  product,
  accent,
  currency,
  basePath,
  businessName,
  onAdd,
}: {
  product: PublicProduct;
  accent: string;
  currency: string;
  basePath: string;
  businessName: string;
  onAdd: (product: PublicProduct) => void;
}) {
  const img = primaryProductImage(product);
  const { list, original, onDeal } = productDisplayPrice(product);
  const inStock = product.stock_qty > 0;
  const category = product.category || product.tags?.[0];

  return (
    <section className="sf-spotlight">
      <div className="sf-spotlight-media">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} />
        ) : (
          <div className="sf-spotlight-placeholder">
            <ShoppingBag className="h-16 w-16" />
          </div>
        )}
        {onDeal && inStock ? <span className="sf-spotlight-badge">Limited offer</span> : null}
      </div>

      <div className="sf-spotlight-copy">
        <span className="sf-label">Featured piece</span>
        {category ? <p className="sf-spotlight-cat">{category}</p> : null}
        <h2>{product.name}</h2>
        {product.description ? (
          <p className="sf-spotlight-desc">{product.description}</p>
        ) : (
          <p className="sf-spotlight-desc">
            A standout from {businessName} — crafted for quality and everyday wear.
          </p>
        )}

        <div className="sf-spotlight-price">
          {onDeal ? (
            <>
              <s>{fmt(original, currency)}</s>
              <strong style={{ color: accent }}>{fmt(list, currency)}</strong>
              <span className="sf-spotlight-save">Save on this item</span>
            </>
          ) : (
            <strong>{fmt(list, currency)}</strong>
          )}
        </div>

        <div className="sf-spotlight-actions">
          {inStock ? (
            <button
              type="button"
              className="sf-btn sf-btn-solid"
              style={{ background: accent }}
              onClick={() => onAdd(product)}
            >
              Add to cart
            </button>
          ) : (
            <span className="sf-spotlight-oos">Currently sold out</span>
          )}
          <Link href={`${basePath}/shop/${product.id}`} className="sf-btn sf-btn-ghost">
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
