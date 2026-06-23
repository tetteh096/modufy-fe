"use client";

import { Label } from "@/components/ui/label";
import { StorefrontFieldHint } from "./storefront-field-hint";
import type { StorefrontProfile, UpdateStorefrontProfileRequest } from "@/types/api";
import { normalizeDeliverySettings } from "@/lib/storefront-delivery";

export const ACCENT_PRESETS = [
  { hex: "#16a34a", name: "Forest" },
  { hex: "#2563eb", name: "Indigo" },
  { hex: "#7c3aed", name: "Violet" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#dc2626", name: "Red" },
  { hex: "#db2777", name: "Pink" },
  { hex: "#0891b2", name: "Teal" },
  { hex: "#374151", name: "Slate" },
] as const;

export const SITE_BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function profileToDraft(profile: StorefrontProfile): UpdateStorefrontProfileRequest {
  return {
    bio: profile.bio,
    accent_color: profile.accent_color,
    header_text: profile.header_text,
    footer_text: profile.footer_text,
    show_products: profile.show_products,
    show_services: profile.show_services,
    show_phone: profile.show_phone,
    show_email: profile.show_email,
    show_whatsapp: profile.show_whatsapp,
    whatsapp: profile.whatsapp,
    show_deals_section: profile.show_deals_section,
    show_work: profile.show_work,
    nav_work_label: profile.nav_work_label,
    promo_banner: profile.promo_banner,
    hero_headline: profile.hero_headline,
    hero_subheadline: profile.hero_subheadline,
    nav_home_label: profile.nav_home_label,
    nav_shop_label: profile.nav_shop_label,
    nav_services_label: profile.nav_services_label,
    nav_cart_label: profile.nav_cart_label,
    nav_contact_label: profile.nav_contact_label,
    social_instagram: profile.social_instagram,
    social_facebook: profile.social_facebook,
    social_twitter: profile.social_twitter,
    social_tiktok: profile.social_tiktok,
    delivery_settings: normalizeDeliverySettings(profile.delivery_settings),
  };
}

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function ToggleRow({
  label,
  where,
  description,
  checked,
  onChange,
  saving,
}: {
  label: string;
  where: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  saving?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <StorefrontFieldHint where={where} />
        {description ? <p className="text-xs text-muted-foreground mt-1">{description}</p> : null}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={saving} />
    </div>
  );
}

export function LabeledField({
  label,
  where,
  children,
}: {
  label: string;
  where: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <StorefrontFieldHint where={where} />
      {children}
    </div>
  );
}
