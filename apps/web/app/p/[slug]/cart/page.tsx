"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { StorefrontTextHero } from "@/components/features/storefront/storefront-text-hero";
import {
  StorefrontCheckout,
  type CheckoutStep,
} from "@/components/features/storefront/storefront-checkout";
import { useStorefront } from "@/components/features/storefront/storefront-context";
import { fmt, effectivePrice } from "@/components/features/storefront/storefront-utils";
import { Spinner } from "@/components/shared/spinner";

function StorefrontCartContent() {
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get("coupon") ?? undefined;
  const { sf, accent, currency, cart, cartCount, basePath } = useStorefront();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");

  if (!sf) return null;

  const subtotal = cart.reduce((s, i) => s + effectivePrice(i.product, i.variant) * i.qty, 0);

  const hero =
    checkoutStep === "form"
      ? {
          watermark: "CHECKOUT",
          eyebrow: "Step 2 · Details",
          title: "Almost there",
          description: `Tell ${sf.business_name} where to send your order and how you'd like to pay.`,
        }
      : checkoutStep === "done"
        ? {
            watermark: "THANKS",
            eyebrow: "Order placed",
            title: "You're all set",
            description: `${sf.business_name} has your order and will be in touch soon.`,
          }
        : {
            watermark: "CART",
            eyebrow: sf.nav_cart_label || "Your bag",
            title:
              cartCount > 0
                ? `${cartCount} item${cartCount !== 1 ? "s" : ""} in your bag`
                : "Your bag is waiting",
            description:
              cartCount > 0
                ? `Review your order from ${sf.business_name} and checkout when you're ready.`
                : "Discover something you love and it will show up here.",
          };

  return (
    <main className="storefront-main storefront-main--flush">
      <StorefrontTextHero
        watermark={hero.watermark}
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        accent={accent}
        crumbs={[{ label: sf.nav_cart_label || "Cart" }]}
        meta={
          checkoutStep === "cart" && cartCount > 0 ? (
            <>
              <span className="sf-text-hero-stat">
                <strong>{fmt(subtotal, currency)}</strong>
                <span>Estimated total</span>
              </span>
              <Link href={`${basePath}/shop`} className="sf-text-hero-link">
                Continue shopping
              </Link>
            </>
          ) : checkoutStep === "form" && cartCount > 0 ? (
            <span className="sf-text-hero-stat">
              <strong>{fmt(subtotal, currency)}</strong>
              <span>Order total</span>
            </span>
          ) : checkoutStep === "cart" && cartCount === 0 ? (
            <Link href={`${basePath}/shop`} className="sf-btn sf-btn-solid" style={{ background: accent }}>
              Browse shop
            </Link>
          ) : null
        }
      />

      <div className="sf-cart-page">
        {cartCount > 0 && checkoutStep !== "done" ? (
          <div className="sf-cart-trust">
            <span>
              <ShieldCheck className="h-4 w-4" />
              Secure checkout
            </span>
            <span>
              <Truck className="h-4 w-4" />
              Fast processing
            </span>
            <span>
              <Headphones className="h-4 w-4" />
              Merchant support
            </span>
          </div>
        ) : null}
        <StorefrontCheckout onStepChange={setCheckoutStep} initialCouponCode={initialCoupon} />
      </div>
    </main>
  );
}

export default function StorefrontCartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      }
    >
      <StorefrontCartContent />
    </Suspense>
  );
}
