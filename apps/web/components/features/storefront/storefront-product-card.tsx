"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { useStorefront } from "./storefront-context";
import { primaryProductImage } from "./storefront-product-media";
import { fmt, getPrice, productDisplayPrice, productInStock, productNeedsVariantSelection } from "./storefront-utils";

export function StorefrontProductCard({
  product,
  accent,
  currency,
  onAdd,
}: {
  product: PublicProduct;
  accent: string;
  currency: string;
  onAdd: (product: PublicProduct, variant?: PublicVariant) => void;
}) {
  const router = useRouter();
  const { basePath } = useStorefront();
  const productHref = `${basePath}/shop/${product.id}`;
  const variants = product.variants ?? [];
  const cardImage = primaryProductImage(product);
  const needsOptions = productNeedsVariantSelection(product);
  const { list, original, onDeal } = productDisplayPrice(product);
  const inStock = productInStock(product);
  const categoryLabel = product.category || (product.tags ?? [])[0] || "";

  function handleAdd() {
    if (needsOptions) {
      router.push(productHref);
      return;
    }
    onAdd(product);
  }

  return (
    <article className="storefront-product-card">
      <Link href={productHref} className="storefront-product-card-media">
        {cardImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cardImage} alt={product.name} className="storefront-product-card-img" />
        ) : (
          <div className="storefront-product-card-placeholder">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        {onDeal && inStock && (
          <span className="storefront-product-badge">Sale</span>
        )}
        {!inStock && (
          <span className="storefront-product-badge storefront-product-badge-muted">
            Sold out
          </span>
        )}
      </Link>

      <div className="storefront-product-card-body">
        {categoryLabel && (
          <p className="storefront-product-category" style={{ color: accent }}>
            {categoryLabel}
          </p>
        )}
        <Link href={productHref} className="storefront-product-name-link">
          <h3 className="storefront-product-name">{product.name}</h3>
        </Link>
      </div>

      <div className="storefront-product-card-footer">
        <div className="storefront-product-prices">
          {onDeal ? (
            <>
              <span className="storefront-product-price-old">{fmt(original, currency)}</span>
              <span className="storefront-product-price-sale" style={{ color: accent }}>
                {fmt(list, currency)}
              </span>
            </>
          ) : (
            <span className="storefront-product-price-sale">
              {fmt(getPrice(product), currency)}
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={handleAdd}
          className="storefront-product-cart-btn"
          style={
            inStock
              ? { background: accent, color: "white" }
              : { background: "#9ca3af", color: "white" }
          }
          aria-label={
            needsOptions
              ? `View ${product.name} options`
              : `Add ${product.name} to cart`
          }
        >
          <ShoppingCart className="h-4 w-4" />
          {!inStock ? "Sold out" : needsOptions ? "View options" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
