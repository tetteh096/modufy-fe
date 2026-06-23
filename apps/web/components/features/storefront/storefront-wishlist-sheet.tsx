"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useStorefront } from "./storefront-context";
import { primaryProductImage } from "./storefront-product-media";
import { fmt, getPrice, productInStock, productNeedsVariantSelection } from "./storefront-utils";

export function StorefrontWishlistSheet() {
  const {
    sf,
    accent,
    currency,
    basePath,
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useStorefront();

  const router = useRouter();

  if (!sf) return null;

  const items = wishlist
    .map((id) => sf.products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="right" className="sf-wishlist-sheet w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="sf-wishlist-sheet-head border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-2 text-left">
            <Heart className="h-5 w-5" style={{ color: accent }} />
            Wishlist
            {items.length > 0 ? (
              <span className="sf-wishlist-sheet-count">{items.length}</span>
            ) : null}
          </SheetTitle>
        </SheetHeader>

        <div className="sf-wishlist-sheet-body">
          {items.length === 0 ? (
            <div className="sf-wishlist-empty">
              <Heart className="h-12 w-12" />
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart on any product to save it here for later.</p>
              <Link
                href={`${basePath}/shop`}
                className="sf-wishlist-empty-btn"
                style={{ background: accent }}
                onClick={() => setWishlistOpen(false)}
              >
                Browse shop
              </Link>
            </div>
          ) : (
            <ul className="sf-wishlist-list">
              {items.map((product) => {
                const img = primaryProductImage(product);
                const inStock = productInStock(product);
                const needsOptions = productNeedsVariantSelection(product);

                return (
                  <li key={product.id} className="sf-wishlist-item">
                    <Link
                      href={`${basePath}/shop/${product.id}`}
                      className="sf-wishlist-item-thumb"
                      onClick={() => setWishlistOpen(false)}
                    >
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={product.name} />
                      ) : (
                        <ShoppingBag className="h-5 w-5" />
                      )}
                    </Link>
                    <div className="sf-wishlist-item-copy">
                      <Link
                        href={`${basePath}/shop/${product.id}`}
                        className="sf-wishlist-item-name"
                        onClick={() => setWishlistOpen(false)}
                      >
                        {product.name}
                      </Link>
                      <p className="sf-wishlist-item-price">{fmt(getPrice(product), currency)}</p>
                      <div className="sf-wishlist-item-actions">
                        <button
                          type="button"
                          disabled={!inStock}
                          className="sf-wishlist-item-add"
                          style={inStock ? { background: accent } : undefined}
                          onClick={() => {
                            if (needsOptions) {
                              setWishlistOpen(false);
                              router.push(`${basePath}/shop/${product.id}`);
                              return;
                            }
                            addToCart(product);
                            setWishlistOpen(false);
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {!inStock ? "Sold out" : needsOptions ? "Pick options" : "Add to bag"}
                        </button>
                        <button
                          type="button"
                          className="sf-wishlist-item-remove"
                          aria-label={`Remove ${product.name} from wishlist`}
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="sf-wishlist-sheet-foot">
            <Link
              href={`${basePath}/shop`}
              className="sf-wishlist-foot-link"
              style={{ color: accent }}
              onClick={() => setWishlistOpen(false)}
            >
              Continue shopping
            </Link>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
