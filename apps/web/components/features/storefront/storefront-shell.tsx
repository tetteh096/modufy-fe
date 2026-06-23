"use client";

import { AlertCircle } from "lucide-react";
import { StorefrontFooter } from "./storefront-footer";
import { StorefrontHeader } from "./storefront-header";
import { StorefrontHoursBanner } from "./storefront-hours";
import { StorefrontMobileMenu } from "./storefront-mobile-menu";
import { StorefrontMobileTabBar } from "./storefront-mobile-tab-bar";
import { StorefrontWishlistSheet } from "./storefront-wishlist-sheet";
import { StorefrontWhatsAppFloat } from "./storefront-whatsapp-float";
import { useStorefront } from "./storefront-context";
import { SfPageEnter, StorefrontLoadingMotion } from "./storefront-motion";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const { sf, loading, error, accent, cartCount, showBook } = useStorefront();

  if (loading) {
    return <StorefrontLoadingMotion />;
  }

  if (error || !sf) {
    return (
      <div className="storefront-not-found">
        <AlertCircle className="storefront-not-found-icon" />
        <h1>Storefront not found</h1>
        <p>This page doesn&apos;t exist or hasn&apos;t been published yet.</p>
      </div>
    );
  }

  return (
    <>
      <StorefrontHeader sf={sf} accent={accent} cartCount={cartCount} showBook={showBook} />
      {sf.show_hours && sf.hours_enabled && sf.hours?.length ? (
        <StorefrontHoursBanner hours={sf.hours} isOpen={sf.is_open_now} accent={accent} />
      ) : null}
      <SfPageEnter>{children}</SfPageEnter>
      <StorefrontFooter sf={sf} accent={accent} />
      <StorefrontMobileMenu />
      <StorefrontMobileTabBar />
      <StorefrontWishlistSheet />
      <StorefrontWhatsAppFloat sf={sf} />
    </>
  );
}
