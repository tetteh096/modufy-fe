"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BaggageClaim,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import type { PublicProduct, PublicVariant } from "@/types/api";
import { cn } from "@/lib/utils";
import { useStorefront } from "./storefront-context";
import {
  colorGalleryIndex,
  colorHasStock,
  colorToHex,
  colorsFromVariants,
  findVariant,
  firstInStockColor,
  firstInStockSize,
  productDetailGallery,
  sizeHasStock,
  sizesForColor,
} from "./storefront-product-media";
import { daysSinceCreated, fmt, getPrice, isDiscountActive, productDisplayPrice } from "./storefront-utils";
import { StorefrontPdpRelated } from "./storefront-pdp-related";
import { SfReveal } from "./storefront-motion";

type TabId = "description" | "reviews" | "offers";

function useOfferCountdown(endsAt?: string) {
  const [left, setLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!endsAt) {
      setLeft(null);
      return;
    }
    const end = new Date(endsAt).getTime();
    if (Number.isNaN(end)) {
      setLeft(null);
      return;
    }

    function tick() {
      const diff = end - Date.now();
      if (diff <= 0) {
        setLeft(null);
        return;
      }
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return left;
}

export function StorefrontProductDetail({
  product,
  relatedProducts = [],
}: {
  product: PublicProduct;
  relatedProducts?: PublicProduct[];
}) {
  const router = useRouter();
  const {
    sf,
    accent,
    currency,
    basePath,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setWishlistOpen,
  } = useStorefront();

  const variants = product.variants ?? [];
  const colors = colorsFromVariants(variants);
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeVariant, setActiveVariant] = useState<PublicVariant | undefined>(
    product.has_variants && variants.length > 0 ? variants[0] : undefined,
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabId>("description");
  const [descExpanded, setDescExpanded] = useState(false);
  const offerActive = isDiscountActive(product);
  const countdown = useOfferCountdown(
    offerActive && product.discount_ends_at ? product.discount_ends_at : undefined,
  );

  const availableSizes = useMemo(() => {
    if (selectedColor) return sizesForColor(variants, selectedColor);
    return sizes;
  }, [variants, selectedColor, sizes]);

  useEffect(() => {
    const color = firstInStockColor(variants);
    setSelectedColor(color);
    setSelectedSize(firstInStockSize(variants, color || undefined));
    setImageIndex(0);
    setQty(1);
    setDescExpanded(false);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!product.has_variants) return;
    const match = findVariant(variants, selectedColor || undefined, selectedSize || undefined);
    setActiveVariant(match ?? variants[0]);
  }, [selectedColor, selectedSize, product.has_variants, variants, product.id]);

  useEffect(() => {
    if (selectedColor && availableSizes.length > 0) {
      if (!availableSizes.includes(selectedSize) || !sizeHasStock(variants, selectedColor, selectedSize)) {
        setSelectedSize(firstInStockSize(variants, selectedColor));
      }
    }
  }, [selectedColor, availableSizes, selectedSize, variants]);

  const gallery = useMemo(
    () => productDetailGallery(product, variants),
    [product, variants],
  );

  useEffect(() => {
    if (imageIndex >= gallery.length) setImageIndex(0);
  }, [gallery.length, imageIndex]);

  const displayImg = gallery[imageIndex]?.url ?? null;
  const { list, original, onDeal } = productDisplayPrice(product, activeVariant);
  const availableQty = Math.max(
    0,
    Math.floor(activeVariant?.stock_qty ?? product.stock_qty),
  );
  const inStock = availableQty > 0;

  useEffect(() => {
    if (qty > availableQty && availableQty > 0) setQty(availableQty);
    if (availableQty === 0 && qty !== 1) setQty(1);
  }, [availableQty, qty]);

  const wishlisted = isWishlisted(product.id);
  const discountPct = onDeal && original > 0 ? Math.round((1 - list / original) * 100) : 0;
  const isNew = daysSinceCreated(product) !== null && (daysSinceCreated(product) ?? 99) <= 30;
  const description = product.description?.trim() ?? "";
  const descPreview = description.length > 200 ? `${description.slice(0, 200)}…` : description;
  const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(" · ");
  const tags = product.tags ?? [];

  function selectColor(color: string) {
    if (!colorHasStock(variants, color)) return;
    setSelectedColor(color);
    setSelectedSize(firstInStockSize(variants, color));
    setImageIndex(colorGalleryIndex(gallery, color));
    setQty(1);
  }

  function selectImage(index: number) {
    setImageIndex(index);
    const item = gallery[index];
    if (item?.color && colorHasStock(variants, item.color)) {
      setSelectedColor(item.color);
      setSelectedSize(firstInStockSize(variants, item.color));
      setQty(1);
    }
  }

  function selectSize(size: string) {
    if (!sizeHasStock(variants, selectedColor || undefined, size)) return;
    setSelectedSize(size);
    setQty(1);
  }

  function handleAdd(goToCart = false) {
    if (!inStock) return;
    addToCart(product, activeVariant, qty);
    if (goToCart) router.push(`${basePath}/cart`);
  }

  const reviews = sf?.reviews ?? [];
  const promo = sf?.promo_banner?.trim();

  return (
    <div className="sf-pdp">
      <div className="sf-pdp-layout">
        {/* Gallery */}
        <SfReveal className="sf-pdp-gallery-wrap" variant="scale" amount={0.12}>
          <div className={cn("sf-pdp-gallery-inner", gallery.length > 1 && "has-thumbs")}>
            {gallery.length > 1 ? (
              <div className="sf-pdp-thumbs sf-pdp-thumbs-rail" role="list" aria-label="Product images">
                {gallery.map((item, i) => (
                  <button
                    key={`${item.url}-${i}`}
                    type="button"
                    role="listitem"
                    className={cn(
                      "sf-pdp-thumb",
                      i === imageIndex && "is-active",
                      item.color && "has-color",
                    )}
                    style={i === imageIndex ? { borderColor: accent } : undefined}
                    onClick={() => selectImage(i)}
                    aria-label={
                      item.color ? `View ${item.color} colour photo` : `View image ${i + 1}`
                    }
                    title={item.color ?? undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt="" />
                    {item.color ? (
                      <span
                        className="sf-pdp-thumb-color-dot"
                        style={{ background: colorToHex(item.color) }}
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="sf-pdp-gallery-main">
              {onDeal ? <span className="sf-pdp-badge-deal">-{discountPct}%</span> : null}
              {isNew && !onDeal ? <span className="sf-pdp-badge-new-float">New</span> : null}

              {gallery.length > 1 ? (
                <span className="sf-pdp-image-counter">
                  {imageIndex + 1} / {gallery.length}
                </span>
              ) : null}

              <button
                type="button"
                className={cn("sf-pdp-wishlist-float", wishlisted && "is-active")}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
              </button>

              {displayImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImg} alt={product.name} className="sf-pdp-gallery-img" />
              ) : (
                <div className="sf-pdp-gallery-placeholder">
                  <ShoppingBag className="h-14 w-14" />
                </div>
              )}

              {gallery.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="sf-pdp-gallery-nav prev"
                    onClick={() => selectImage((imageIndex - 1 + gallery.length) % gallery.length)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="sf-pdp-gallery-nav next"
                    onClick={() => selectImage((imageIndex + 1) % gallery.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </SfReveal>

        {/* Buy panel */}
        <SfReveal className="sf-pdp-buy-panel" variant="up" delay={0.12}>
          <div className="sf-pdp-buy-panel-inner">
            <div className="sf-pdp-info-head">
              <div className="sf-pdp-badges">
                {product.category ? (
                  <span className="sf-pdp-badge-cat">{product.category}</span>
                ) : null}
                {onDeal ? <span className="sf-pdp-badge-deal-inline">On sale</span> : null}
                {isNew && !onDeal ? <span className="sf-pdp-badge-new">New arrival</span> : null}
              </div>
              {sf && sf.review_count > 0 ? (
                <div className="sf-pdp-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.round(sf.avg_rating) ? "sf-pdp-star-filled" : "sf-pdp-star-empty",
                      )}
                    />
                  ))}
                  <span>{sf.avg_rating.toFixed(1)} · {sf.review_count} reviews</span>
                </div>
              ) : null}
            </div>

            <h1 className="sf-pdp-title">{product.name}</h1>
            {sf ? <p className="sf-pdp-brand-line">by {sf.business_name}</p> : null}

            <div className="sf-pdp-price-row">
              {onDeal ? (
                <>
                  <span className="sf-pdp-price-now" style={{ color: accent }}>
                    {fmt(list, currency)}
                  </span>
                  <span className="sf-pdp-price-old">{fmt(original, currency)}</span>
                  <span className="sf-pdp-price-off">Save {discountPct}%</span>
                </>
              ) : (
                <span className="sf-pdp-price-now">{fmt(getPrice(product, activeVariant), currency)}</span>
              )}
            </div>

            {tags.length > 0 ? (
              <div className="sf-pdp-tag-chips">
                {tags.map((t) => (
                  <span key={t} className="sf-pdp-tag-chip">{t}</span>
                ))}
              </div>
            ) : null}

            {onDeal ? (
              <div className="sf-pdp-deal-banner">
                <p>
                  <strong>Limited offer</strong> — was {fmt(original, currency)}, now {fmt(list, currency)}
                </p>
                {countdown ? (
                  <div className="sf-pdp-countdown-inline">
                    {(
                      [
                        ["d", countdown.days],
                        ["h", countdown.hours],
                        ["m", countdown.minutes],
                        ["s", countdown.seconds],
                      ] as const
                    ).map(([label, value]) => (
                      <span key={label}>
                        <strong>{String(value).padStart(2, "0")}</strong>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : promo ? (
              <div className="sf-pdp-deal-banner sf-pdp-deal-banner-muted">
                <p>{promo}</p>
              </div>
            ) : null}

            {colors.length > 0 ? (
              <div className="sf-pdp-option">
                <div className="sf-pdp-option-head">
                  <p className="sf-pdp-option-label">Colour</p>
                  <span className="sf-pdp-option-value">{selectedColor || "—"}</span>
                </div>
                <div className="sf-pdp-color-swatches">
                  {colors.map((c) => {
                    const oos = !colorHasStock(variants, c);
                    return (
                      <button
                        key={c}
                        type="button"
                        disabled={oos}
                        title={c}
                        className={cn(
                          "sf-pdp-color-swatch",
                          selectedColor === c && "is-active",
                          oos && "is-disabled",
                        )}
                        style={
                          selectedColor === c && !oos
                            ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${accent}` }
                            : undefined
                        }
                        aria-label={oos ? `Colour ${c} — sold out` : `Colour ${c}`}
                        aria-pressed={selectedColor === c}
                        onClick={() => selectColor(c)}
                      >
                        <span style={{ background: colorToHex(c) }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {availableSizes.length > 0 ? (
              <div className="sf-pdp-option">
                <div className="sf-pdp-option-head">
                  <p className="sf-pdp-option-label">Size</p>
                  <span className="sf-pdp-option-value">{selectedSize || "—"}</span>
                </div>
                <div className="sf-pdp-size-options">
                  {availableSizes.map((s) => {
                    const oos = !sizeHasStock(variants, selectedColor || undefined, s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={oos}
                        className={cn("sf-pdp-size-btn", selectedSize === s && "is-active", oos && "is-disabled")}
                        style={
                          selectedSize === s && !oos
                            ? { borderColor: accent, color: accent, background: `color-mix(in srgb, ${accent} 8%, white)` }
                            : undefined
                        }
                        onClick={() => selectSize(s)}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="sf-pdp-stock-row">
              <span className={inStock ? "sf-pdp-in-stock" : "sf-pdp-out-of-stock"}>
                {inStock ? (
                  <>
                    <Check className="h-4 w-4" />
                    In stock
                    {availableQty <= 5 ? (
                      <span className="sf-pdp-low-stock"> — only {availableQty} left</span>
                    ) : (
                      <span className="sf-pdp-stock-qty"> · {availableQty} available</span>
                    )}
                  </>
                ) : (
                  "Sold out"
                )}
              </span>
              {variantLabel ? (
                <span className="sf-pdp-variant-pill">{variantLabel}</span>
              ) : null}
            </div>

            <div className="sf-pdp-purchase-box">
              <div className="sf-pdp-purchase-qty">
                <span className="sf-pdp-purchase-qty-label">Qty</span>
                <div className="sf-pdp-qty">
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    disabled={!inStock || qty >= availableQty}
                    onClick={() => setQty((q) => Math.min(availableQty, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="sf-pdp-purchase-actions sf-pdp-actions-desktop">
                <button
                  type="button"
                  disabled={!inStock}
                  className="sf-pdp-btn sf-pdp-btn-bag"
                  onClick={() => handleAdd(false)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to bag
                </button>
                <button
                  type="button"
                  disabled={!inStock}
                  className="sf-pdp-btn sf-pdp-btn-buy"
                  style={{ background: accent }}
                  onClick={() => handleAdd(true)}
                >
                  <BaggageClaim className="h-4 w-4" />
                  Buy now
                </button>
              </div>
            </div>

            <div className="sf-pdp-trust-row">
              <div className="sf-pdp-trust-item">
                <Truck className="h-4 w-4" />
                <span>Ready to ship</span>
              </div>
              <div className="sf-pdp-trust-item">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
              <div className="sf-pdp-trust-item">
                <Package className="h-4 w-4" />
                <span>Quality assured</span>
              </div>
            </div>

            {description ? (
              <div className="sf-pdp-desc-block">
                <h3>About this item</h3>
                <p>{descExpanded ? description : descPreview}</p>
                {description.length > 200 ? (
                  <button type="button" className="sf-pdp-read-more" onClick={() => setDescExpanded((v) => !v)}>
                    {descExpanded ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              className={cn("sf-pdp-wishlist-link", wishlisted && "is-active")}
              onClick={() => (wishlisted ? setWishlistOpen(true) : toggleWishlist(product.id))}
            >
              <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
              {wishlisted ? "View wishlist" : "Save to wishlist"}
            </button>
            {wishlisted ? (
              <button
                type="button"
                className="sf-pdp-wishlist-open"
                style={{ color: accent }}
                onClick={() => setWishlistOpen(true)}
              >
                Open saved items →
              </button>
            ) : null}

            {activeVariant?.sku ? (
              <p className="sf-pdp-sku">SKU: {activeVariant.sku}</p>
            ) : null}
          </div>
        </SfReveal>
      </div>

      {relatedProducts.length > 0 ? (
        <StorefrontPdpRelated products={relatedProducts} accent={accent} currency={currency} />
      ) : null}

      {/* Mobile sticky bar */}
      <div className="sf-pdp-mobile-bar">
        <div className="sf-pdp-mobile-bar-copy">
          <strong style={{ color: onDeal ? accent : undefined }}>
            {fmt(onDeal ? list : getPrice(product, activeVariant), currency)}
          </strong>
          <span className={inStock ? "sf-pdp-in-stock" : "sf-pdp-out-of-stock"}>
            {inStock ? "In stock" : "Sold out"}
          </span>
        </div>
        <div className="sf-pdp-mobile-bar-actions">
          <button
            type="button"
            disabled={!inStock}
            className="sf-pdp-mobile-btn sf-pdp-mobile-btn-bag"
            onClick={() => handleAdd(false)}
          >
            <ShoppingBag className="h-4 w-4" />
            Add
          </button>
          <button
            type="button"
            disabled={!inStock}
            className="sf-pdp-mobile-btn sf-pdp-mobile-btn-buy"
            style={{ background: accent }}
            onClick={() => handleAdd(true)}
          >
            Buy now
          </button>
        </div>
      </div>

      {/* Details tabs */}
      <SfReveal className="sf-pdp-tabs-card" variant="fade" delay={0.2}>
        <div className="sf-pdp-tabs-nav" role="tablist">
          {(
            [
              ["description", "Description"],
              ["reviews", `Reviews${sf && sf.review_count > 0 ? ` (${sf.review_count})` : ""}`],
              ["offers", "Offers"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={cn("sf-pdp-tab", tab === id && "is-active")}
              style={tab === id ? { color: accent, borderColor: accent } : undefined}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sf-pdp-tab-panel">
          {tab === "description" ? (
            <div className="sf-pdp-tab-description">
              <p className="sf-pdp-tab-lead">
                {description ||
                  `${product.name} from ${sf?.business_name ?? "our store"} — thoughtfully selected for quality and everyday use.`}
              </p>
              <div className="sf-pdp-spec-cards">
                {product.category ? (
                  <div className="sf-pdp-spec-card">
                    <span>Category</span>
                    <strong>{product.category}</strong>
                  </div>
                ) : null}
                {selectedColor ? (
                  <div className="sf-pdp-spec-card">
                    <span>Colour</span>
                    <strong>{selectedColor}</strong>
                  </div>
                ) : null}
                {selectedSize ? (
                  <div className="sf-pdp-spec-card">
                    <span>Size</span>
                    <strong>{selectedSize}</strong>
                  </div>
                ) : null}
                <div className="sf-pdp-spec-card">
                  <span>Availability</span>
                  <strong>{inStock ? `${availableQty} in stock` : "Sold out"}</strong>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "reviews" ? (
            <div className="sf-pdp-reviews">
              {reviews.length === 0 ? (
                <p className="sf-pdp-muted">No reviews yet. Be the first to shop and share feedback.</p>
              ) : (
                <>
                  {sf && sf.review_count > 0 ? (
                    <div className="sf-pdp-reviews-summary">
                      <strong>{sf.avg_rating.toFixed(1)}</strong>
                      <div>
                        <div className="sf-pdp-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.round(sf.avg_rating) ? "sf-pdp-star-filled" : "sf-pdp-star-empty",
                              )}
                            />
                          ))}
                        </div>
                        <span>{sf.review_count} reviews for {sf.business_name}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="sf-pdp-reviews-list">
                    {reviews.map((r) => (
                      <blockquote key={r.id} className="sf-pdp-review">
                        <div className="sf-pdp-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < r.rating ? "sf-pdp-star-filled" : "sf-pdp-star-empty",
                              )}
                            />
                          ))}
                        </div>
                        {r.comment ? <p>&ldquo;{r.comment}&rdquo;</p> : null}
                        <footer>— {r.reviewer_name}</footer>
                      </blockquote>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}

          {tab === "offers" ? (
            <div className="sf-pdp-offers">
              {onDeal ? (
                <div className="sf-pdp-offer-card" style={{ borderColor: accent }}>
                  <strong>Active deal — {discountPct}% off</strong>
                  <p>
                    Now {fmt(list, currency)}
                    {original > list ? ` (was ${fmt(original, currency)})` : ""}
                  </p>
                  {product.discount_ends_at ? (
                    <p className="sf-pdp-muted">
                      Ends {new Date(product.discount_ends_at).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {promo ? (
                <div className="sf-pdp-offer-card">
                  <strong>Store promo</strong>
                  <p>{promo}</p>
                </div>
              ) : null}
              <div className="sf-pdp-offer-card">
                <strong>Returns & support</strong>
                <p>
                  Shop with confidence from {sf?.business_name ?? "this store"}. Contact the merchant
                  for returns and warranty on this item.
                </p>
                <Link href={`${basePath}/contact`} className="sf-pdp-read-more">
                  Contact merchant
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </SfReveal>
    </div>
  );
}
