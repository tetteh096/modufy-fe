"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { publicApi, getApiErrorMessage } from "@/lib/api";
import type { PlaceOrderLine, ValidateCouponResponse } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  deliveryFeeSummary,
  normalizeDeliverySettings,
  orderTotalWithDelivery,
} from "@/lib/storefront-delivery";
import { useStorefront } from "./storefront-context";
import { cartItemStockQty, fmt, effectivePrice, productNeedsVariantSelection } from "./storefront-utils";
import { hasValidCoords } from "@/lib/geo";
import { storefrontIsClosed } from "@/lib/storefront-hours";
import { Spinner } from "@/components/shared/spinner";

const DeliveryMapPicker = dynamic(
  () =>
    import("@/components/shared/delivery-map-picker").then((m) => ({
      default: m.DeliveryMapPicker,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="delivery-map-picker-loading-wrap">
        <Spinner />
      </div>
    ),
  },
);

export type CheckoutStep = "cart" | "form" | "done";

export function StorefrontCheckout({
  onStepChange,
  initialCouponCode,
}: {
  onStepChange?: (step: CheckoutStep) => void;
  initialCouponCode?: string;
}) {
  const {
    slug,
    sf,
    accent,
    currency,
    basePath,
    cart,
    updateQty,
    removeFromCart,
    clearCart,
  } = useStorefront();

  const [step, setStep] = useState<CheckoutStep>("cart");

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);
  const [busy, setBusy] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    guest_phone: "",
    guest_email: "",
    payment_method: "cod" as "cod" | "paystack",
    delivery_option_id: "",
    notes: "",
    shipping_addr: "",
    delivery_address: "",
    delivery_lat: null as number | null,
    delivery_lng: null as number | null,
  });

  const subtotal = cart.reduce((s, i) => s + effectivePrice(i.product, i.variant) * i.qty, 0);
  const discountAmount = appliedCoupon?.discount_amount ?? 0;
  const total = appliedCoupon?.total ?? subtotal;
  const deliverySettings = useMemo(() => normalizeDeliverySettings(sf?.delivery_settings), [sf?.delivery_settings]);
  const selectedDeliveryRule = useMemo(() => {
    if (!deliverySettings.enabled) return null;
    return (
      deliverySettings.rules.find((r) => r.id === form.delivery_option_id) ?? deliverySettings.rules[0] ?? null
    );
  }, [deliverySettings, form.delivery_option_id]);
  const deliveryFee =
    selectedDeliveryRule?.fee_type === "fixed" ? Math.max(0, selectedDeliveryRule.fee_amount ?? 0) : 0;
  const grandTotal = orderTotalWithDelivery(total, deliveryFee);
  const storeClosed = storefrontIsClosed(sf);

  const handleDeliveryPinChange = useCallback(
    (lat: number | null, lng: number | null, address?: string | null) => {
      setForm((f) => ({
        ...f,
        delivery_lat: lat,
        delivery_lng: lng,
        delivery_address:
          lat === null ? "" : address !== undefined && address !== null ? address : f.delivery_address,
      }));
    },
    [],
  );

  useEffect(() => {
    if (!sf) return;
    const firstRule = deliverySettings.rules[0];
    setForm((f) => ({
      ...f,
      delivery_option_id: f.delivery_option_id || firstRule?.id || "",
      payment_method:
        deliverySettings.allow_pay_on_delivery
          ? "cod"
          : deliverySettings.allow_pay_online
            ? "paystack"
            : "cod",
    }));
  }, [sf, deliverySettings.rules, deliverySettings.allow_pay_on_delivery, deliverySettings.allow_pay_online]);

  function cartLines(): PlaceOrderLine[] {
    return cart.map((i) => ({
      product_id: i.product.id,
      variant_id: i.variant?.id,
      qty: i.qty,
    }));
  }

  const couponPrefilled = useRef(false);

  useEffect(() => {
    setAppliedCoupon(null);
    couponPrefilled.current = false;
  }, [cart]);

  useEffect(() => {
    const code = initialCouponCode?.trim();
    if (!code || cart.length === 0 || couponPrefilled.current) return;
    couponPrefilled.current = true;
    setCouponInput(code.toUpperCase());
    (async () => {
      setCouponBusy(true);
      try {
        const result = await publicApi.validateCoupon(slug, {
          code,
          lines: cart.map((i) => ({
            product_id: i.product.id,
            variant_id: i.variant?.id,
            qty: i.qty,
          })),
        });
        setAppliedCoupon(result);
        setCouponInput(result.code);
        toast.success("Coupon from your link was applied");
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      } finally {
        setCouponBusy(false);
      }
    })();
  }, [initialCouponCode, cart.length, slug]);

  async function applyCoupon(guestPhone?: string) {
    const code = couponInput.trim();
    if (!code) {
      toast.error("Enter a coupon code");
      return;
    }
    setCouponBusy(true);
    try {
      const result = await publicApi.validateCoupon(slug, {
        code,
        guest_phone: guestPhone || form.guest_phone || undefined,
        lines: cartLines(),
      });
      setAppliedCoupon(result);
      setCouponInput(result.code);
      toast.success("Coupon applied");
    } catch (err) {
      setAppliedCoupon(null);
      toast.error(getApiErrorMessage(err));
    } finally {
      setCouponBusy(false);
    }
  }

  function clearCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
  }

  async function submit() {
    if (storeClosed) {
      toast.error("This store is closed — check opening hours and try again");
      return;
    }
    for (const item of cart) {
      if (productNeedsVariantSelection(item.product) && !item.variant?.id) {
        toast.error(`Pick a size or colour for ${item.product.name} before checkout`);
        return;
      }
      const maxQty = cartItemStockQty(item.product, item.variant);
      if (item.qty > maxQty) {
        toast.error(`Only ${maxQty} of ${item.product.name} available — update your cart`);
        return;
      }
    }
    if (!form.guest_name.trim() || !form.guest_phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    if (deliverySettings.enabled && !form.delivery_option_id) {
      toast.error("Choose a delivery option");
      return;
    }
    if (deliverySettings.enabled && deliverySettings.require_map_pin && !hasValidCoords(form.delivery_lat, form.delivery_lng)) {
      toast.error("Drop a pin on the map so we know where to deliver");
      return;
    }
    if (form.payment_method === "paystack" && !deliverySettings.allow_pay_online) {
      toast.error("Online payment is not available yet — choose pay on delivery");
      return;
    }
    if (form.payment_method === "cod" && !deliverySettings.allow_pay_on_delivery) {
      toast.error("Pay on delivery is not available for this store");
      return;
    }
    setBusy(true);
    try {
      const lines = cartLines();
      await publicApi.placeOrder(slug, {
        guest_name: form.guest_name,
        guest_phone: form.guest_phone,
        guest_email: form.guest_email || undefined,
        payment_method: form.payment_method,
        notes: form.notes || undefined,
        shipping_addr: form.shipping_addr || undefined,
        delivery_address: form.delivery_address || undefined,
        delivery_lat: form.delivery_lat ?? undefined,
        delivery_lng: form.delivery_lng ?? undefined,
        delivery_option_id: deliverySettings.enabled ? form.delivery_option_id : undefined,
        coupon_code: appliedCoupon?.code || undefined,
        lines,
      });
      setStep("done");
      clearCart();
      clearCoupon();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!sf) return null;

  if (step === "done") {
    return (
      <div className="sf-checkout-success">
        <div className="sf-checkout-success-icon" style={{ background: `color-mix(in srgb, ${accent} 15%, white)` }}>
          <Star className="h-9 w-9" style={{ color: accent }} fill={accent} />
        </div>
        <h2>Thank you, {form.guest_name}!</h2>
        <p>
          Your order is in. {sf.business_name} will reach out on <strong>{form.guest_phone}</strong> to confirm
          delivery.
        </p>
        <div className="sf-checkout-success-actions">
          <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
            Continue shopping
          </Link>
          <Link href={`${basePath}/contact`} className="sf-btn sf-btn-ghost">
            Contact store
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step === "cart") {
    return (
      <div className="sf-cart-empty-panel">
        <div className="sf-cart-empty-icon">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2>Nothing in your bag yet</h2>
        <p>Explore the shop or check out new arrivals.</p>
        <div className="sf-cart-empty-actions">
          <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
            Browse shop
          </Link>
          <Link href={`${basePath}/new-arrivals`} className="sf-btn sf-btn-ghost">
            New Arrivals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="storefront-checkout sf-cart-checkout">
      <div className="sf-cart-steps">
        <button
          type="button"
          className={step === "cart" ? "is-active" : ""}
          style={step === "cart" ? { borderColor: accent, color: accent } : undefined}
          onClick={() => setStep("cart")}
        >
          <span>1</span>
          Cart
        </button>
        <button
          type="button"
          className={step === "form" ? "is-active" : ""}
          style={step === "form" ? { borderColor: accent, color: accent } : undefined}
          onClick={() => cart.length > 0 && setStep("form")}
          disabled={cart.length === 0}
        >
          <span>2</span>
          Details
        </button>
      </div>

      {step === "cart" ? (
        <div className="sf-cart-layout">
          <div className="sf-cart-items-panel">
            <h2 className="sf-cart-panel-title">Items</h2>
            <div className="sf-cart-items">
              {cart.map((item, idx) => {
                const p = item.product;
                const v = item.variant;
                const img = resolveMediaUrl(v?.image_url || p.photo_url) || null;
                const lineTotal = effectivePrice(p, v) * item.qty;
                return (
                  <article key={idx} className="sf-cart-item">
                    <Link href={`${basePath}/shop/${p.id}`} className="sf-cart-item-media">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={p.name} />
                      ) : (
                        <ShoppingBag className="h-6 w-6" />
                      )}
                    </Link>
                    <div className="sf-cart-item-body">
                      <Link href={`${basePath}/shop/${p.id}`} className="sf-cart-item-name">
                        {p.name}
                      </Link>
                      {v ? (
                        <p className="sf-cart-item-variant">
                          {[v.color, v.size].filter(Boolean).join(" · ")}
                        </p>
                      ) : null}
                      <p className="sf-cart-item-unit">
                        {fmt(effectivePrice(p, v), currency)} each
                      </p>
                    </div>
                    <div className="sf-cart-item-actions">
                      <div className="sf-cart-item-qty">
                        <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(idx, item.qty - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span>{item.qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => updateQty(idx, item.qty + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <strong className="sf-cart-item-price">{fmt(lineTotal, currency)}</strong>
                      <button
                        type="button"
                        className="sf-cart-item-remove"
                        aria-label={`Remove ${p.name}`}
                        onClick={() => removeFromCart(idx)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="sf-cart-summary-panel">
            <h2 className="sf-cart-panel-title">Order summary</h2>
            <div className="sf-checkout-coupon">
              <label className="sf-checkout-coupon-label" htmlFor="sf-coupon-cart">
                Coupon code
              </label>
              <div className="sf-checkout-coupon-row">
                <input
                  id="sf-coupon-cart"
                  type="text"
                  className="sf-checkout-coupon-input"
                  placeholder="e.g. SAVE10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                {appliedCoupon ? (
                  <button type="button" className="sf-checkout-coupon-btn" onClick={clearCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sf-checkout-coupon-btn"
                    style={{ color: accent }}
                    disabled={couponBusy}
                    onClick={() => applyCoupon()}
                  >
                    {couponBusy ? "…" : "Apply"}
                  </button>
                )}
              </div>
            </div>
            <div className="sf-cart-summary-lines">
              <div className="sf-cart-summary-line">
                <span>Subtotal ({cart.length} line{cart.length !== 1 ? "s" : ""})</span>
                <span>{fmt(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="sf-cart-summary-line sf-cart-summary-discount">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-{fmt(discountAmount, currency)}</span>
                </div>
              ) : null}
              <div className="sf-cart-summary-line sf-cart-summary-muted">
                <span>Delivery</span>
                <span>
                  {deliverySettings.enabled && selectedDeliveryRule
                    ? deliveryFeeSummary(selectedDeliveryRule, currency)
                    : "Arrange with store"}
                </span>
              </div>
            </div>
            <div className="sf-cart-summary-total">
              <span>Total</span>
              <strong>{fmt(total, currency)}</strong>
            </div>
            <button
              type="button"
              className="sf-cart-checkout-btn"
              style={{ background: accent }}
              disabled={storeClosed}
              onClick={() => setStep("form")}
            >
              {storeClosed ? "Store closed" : "Proceed to checkout"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link href={`${basePath}/shop`} className="sf-cart-continue-link">
              Continue shopping
            </Link>
          </aside>
        </div>
      ) : (
        <div className="sf-checkout-details-layout">
          <div className="sf-checkout-form-panel">
            <div className="sf-checkout-form-intro">
              <span className="sf-checkout-form-kicker">
                <User className="h-4 w-4" />
                Your details
              </span>
              <h2>Where should we send your order?</h2>
              <p>A few details so {sf.business_name} can confirm and deliver.</p>
            </div>

            <div className="sf-checkout-form-card">
              <h3 className="sf-checkout-form-section">Contact</h3>
              <div className="sf-checkout-fields">
                <label className="sf-checkout-field">
                  <span>Full name *</span>
                  <input
                    value={form.guest_name}
                    onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
                <label className="sf-checkout-field">
                  <span>Phone *</span>
                  <input
                    value={form.guest_phone}
                    onChange={(e) => setForm((f) => ({ ...f, guest_phone: e.target.value }))}
                    placeholder="+233 24 000 0000"
                    type="tel"
                    autoComplete="tel"
                  />
                </label>
                <label className="sf-checkout-field">
                  <span>Email (optional)</span>
                  <input
                    value={form.guest_email}
                    onChange={(e) => setForm((f) => ({ ...f, guest_email: e.target.value }))}
                    placeholder="you@email.com"
                    type="email"
                    autoComplete="email"
                  />
                </label>
              </div>
            </div>

            <div className="sf-checkout-form-card">
              <h3 className="sf-checkout-form-section">
                <MapPin className="h-4 w-4" style={{ color: accent }} />
                Delivery
              </h3>
              {deliverySettings.instructions?.trim() ? (
                <p className="sf-checkout-delivery-terms">{deliverySettings.instructions}</p>
              ) : null}
              {deliverySettings.enabled ? (
                <>
                  <p className="sf-checkout-form-hint">Choose how you want to receive your order</p>
                  <div className="sf-checkout-pay-options">
                    {deliverySettings.rules.map((rule) => (
                      <button
                        key={rule.id}
                        type="button"
                        className={`sf-checkout-pay-option${form.delivery_option_id === rule.id ? " is-active" : ""}`}
                        style={form.delivery_option_id === rule.id ? { borderColor: accent } : undefined}
                        onClick={() => setForm((f) => ({ ...f, delivery_option_id: rule.id }))}
                      >
                        <Truck className="h-5 w-5" style={{ color: accent }} />
                        <span>
                          <strong>{rule.label}</strong>
                          <small>
                            {rule.description || deliveryFeeSummary(rule, currency)}
                            {rule.fee_type === "fixed" || rule.fee_type === "free"
                              ? ` · ${deliveryFeeSummary(rule, currency)}`
                              : rule.fee_note
                                ? ` · ${rule.fee_note}`
                                : ""}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                  {deliverySettings.require_map_pin ? (
                    <div className="sf-checkout-map-block">
                      <DeliveryMapPicker
                        latitude={form.delivery_lat}
                        longitude={form.delivery_lng}
                        country={sf.country}
                        accentColor={accent}
                        height="20rem"
                        className="sf-checkout-map"
                        onChange={handleDeliveryPinChange}
                      />
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="sf-checkout-form-hint">
                  Delivery is not configured for online checkout — add notes below or contact the store after ordering.
                </p>
              )}
              <label className="sf-checkout-field sf-checkout-field-full">
                <span>Landmark or directions (optional)</span>
                <input
                  value={form.shipping_addr}
                  onChange={(e) => setForm((f) => ({ ...f, shipping_addr: e.target.value }))}
                  placeholder="Blue gate, House 12, near Shell station…"
                  autoComplete="street-address"
                />
              </label>
              <label className="sf-checkout-field sf-checkout-field-full">
                <span>Order notes (optional)</span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Gate code, preferred time, special instructions…"
                />
              </label>
            </div>

            <div className="sf-checkout-form-card">
              <h3 className="sf-checkout-form-section">Payment method</h3>
              <div className="sf-checkout-pay-options">
                {deliverySettings.allow_pay_on_delivery ? (
                  <button
                    type="button"
                    className={`sf-checkout-pay-option${form.payment_method === "cod" ? " is-active" : ""}`}
                    style={form.payment_method === "cod" ? { borderColor: accent } : undefined}
                    onClick={() => setForm((f) => ({ ...f, payment_method: "cod" }))}
                  >
                    <Banknote className="h-5 w-5" style={{ color: accent }} />
                    <span>
                      <strong>Pay on delivery</strong>
                      <small>Cash or mobile money when your order arrives</small>
                    </span>
                  </button>
                ) : null}
                {deliverySettings.allow_pay_online ? (
                  <button
                    type="button"
                    className={`sf-checkout-pay-option${form.payment_method === "paystack" ? " is-active" : ""}`}
                    style={form.payment_method === "paystack" ? { borderColor: accent } : undefined}
                    onClick={() => setForm((f) => ({ ...f, payment_method: "paystack" }))}
                  >
                    <CreditCard className="h-5 w-5" style={{ color: accent }} />
                    <span>
                      <strong>Pay online</strong>
                      <small>Secure card or mobile payment</small>
                    </span>
                  </button>
                ) : (
                  <p className="sf-checkout-form-hint text-sm text-muted-foreground px-1">
                    Online payment via card or MoMo is coming soon — pay on delivery for now.
                  </p>
                )}
              </div>
            </div>

            <button type="button" className="sf-checkout-back-link" onClick={() => setStep("cart")}>
              ← Back to cart
            </button>
          </div>

          <aside className="sf-cart-summary-panel sf-checkout-summary-panel">
            <h2 className="sf-cart-panel-title">Order summary</h2>
            <div className="sf-checkout-summary-items">
              {cart.map((i, idx) => {
                const img = resolveMediaUrl(i.variant?.image_url || i.product.photo_url) || null;
                return (
                  <div key={idx} className="sf-checkout-summary-item">
                    <div className="sf-checkout-summary-thumb">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                    </div>
                    <div className="sf-checkout-summary-copy">
                      <strong>
                        {i.qty}× {i.product.name}
                      </strong>
                      {i.variant ? (
                        <span>{[i.variant.color, i.variant.size].filter(Boolean).join(" · ")}</span>
                      ) : null}
                    </div>
                    <span>{fmt(effectivePrice(i.product, i.variant) * i.qty, currency)}</span>
                  </div>
                );
              })}
            </div>
            <div className="sf-checkout-coupon">
              <label className="sf-checkout-coupon-label" htmlFor="sf-coupon-form">
                Coupon code
              </label>
              <div className="sf-checkout-coupon-row">
                <input
                  id="sf-coupon-form"
                  type="text"
                  className="sf-checkout-coupon-input"
                  placeholder="e.g. SAVE10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                {appliedCoupon ? (
                  <button type="button" className="sf-checkout-coupon-btn" onClick={clearCoupon}>
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sf-checkout-coupon-btn"
                    style={{ color: accent }}
                    disabled={couponBusy}
                    onClick={() => applyCoupon(form.guest_phone)}
                  >
                    {couponBusy ? "…" : "Apply"}
                  </button>
                )}
              </div>
              {!appliedCoupon && form.guest_phone ? (
                <p className="sf-checkout-coupon-hint">Use Apply after entering your phone for restricted coupons.</p>
              ) : null}
            </div>
            <div className="sf-cart-summary-lines">
              <div className="sf-cart-summary-line">
                <span>Subtotal</span>
                <span>{fmt(subtotal, currency)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="sf-cart-summary-line sf-cart-summary-discount">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-{fmt(discountAmount, currency)}</span>
                </div>
              ) : null}
              {deliveryFee > 0 ? (
                <div className="sf-cart-summary-line">
                  <span>Delivery{selectedDeliveryRule ? ` · ${selectedDeliveryRule.label}` : ""}</span>
                  <span>{fmt(deliveryFee, currency)}</span>
                </div>
              ) : selectedDeliveryRule && deliverySettings.enabled ? (
                <div className="sf-cart-summary-line sf-cart-summary-muted">
                  <span>Delivery · {selectedDeliveryRule.label}</span>
                  <span>{deliveryFeeSummary(selectedDeliveryRule, currency)}</span>
                </div>
              ) : null}
              <div className="sf-cart-summary-line sf-cart-summary-muted">
                <span>Payment</span>
                <span>{form.payment_method === "cod" ? "On delivery" : "Online"}</span>
              </div>
            </div>
            <div className="sf-cart-summary-total">
              <span>Total</span>
              <strong>{fmt(grandTotal, currency)}</strong>
            </div>
            <button
              type="button"
              className="sf-cart-checkout-btn"
              style={{ background: accent }}
              disabled={busy || storeClosed}
              onClick={submit}
            >
              {storeClosed ? "Store closed" : busy ? "Placing order…" : "Place order"}
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="sf-checkout-secure-note">Your details are only shared with {sf.business_name}.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
