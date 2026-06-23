import type { StorefrontDeliverySettings, UpdateStorefrontProfileRequest } from "@/types/api";
import { normalizeDeliverySettings } from "@/lib/storefront-delivery";

export const DRAFT_FIELD_LABELS: Record<keyof UpdateStorefrontProfileRequest, string> = {
  bio: "About text",
  accent_color: "Theme colour",
  header_text: "Header name",
  footer_text: "Footer text",
  show_products: "Products page",
  show_services: "Services page",
  show_phone: "Show phone",
  show_email: "Show email",
  show_whatsapp: "Show WhatsApp",
  whatsapp: "WhatsApp number",
  show_hours: "Show hours",
  show_deals_section: "Deals section",
  show_work: "Portfolio page",
  nav_work_label: "Portfolio menu label",
  work_intro: "Portfolio intro",
  promo_banner: "Promo banner",
  hero_headline: "Hero headline",
  hero_subheadline: "Hero subheadline",
  nav_home_label: "Home menu",
  nav_shop_label: "Shop menu",
  nav_services_label: "Services menu",
  nav_cart_label: "Cart menu",
  nav_contact_label: "Contact menu",
  social_instagram: "Instagram",
  social_facebook: "Facebook",
  social_twitter: "X / Twitter",
  social_tiktok: "TikTok",
  in_directory: "Directory listing",
  delivery_settings: "Checkout & delivery",
};

function deliverySettingsSummary(v: unknown): string {
  const s = normalizeDeliverySettings(v as Partial<StorefrontDeliverySettings> | null | undefined);
  if (!s.enabled) return "Off";
  const parts = [`On`, `${s.rules.length} option${s.rules.length === 1 ? "" : "s"}`];
  if (s.allow_pay_on_delivery) parts.push("pay on delivery");
  if (s.require_map_pin) parts.push("map pin");
  return parts.join(" · ");
}

function displayValue(key: keyof UpdateStorefrontProfileRequest, v: unknown): string {
  if (key === "delivery_settings") {
    return v ? deliverySettingsSummary(v) : "—";
  }
  if (typeof v === "boolean") return v ? "On" : "Off";
  if (v === undefined || v === null || v === "") return "—";
  if (key === "accent_color" && typeof v === "string") return v.toUpperCase();
  const s = String(v);
  return s.length > 42 ? `${s.slice(0, 42)}…` : s;
}

export type DraftChange = {
  key: keyof UpdateStorefrontProfileRequest;
  label: string;
  from: string;
  to: string;
};

export function getDraftChanges(
  saved: UpdateStorefrontProfileRequest,
  draft: UpdateStorefrontProfileRequest,
): DraftChange[] {
  const changes: DraftChange[] = [];
  for (const key of Object.keys(DRAFT_FIELD_LABELS) as (keyof UpdateStorefrontProfileRequest)[]) {
    const from = saved[key];
    const to = draft[key];
    const changed =
      key === "delivery_settings"
        ? JSON.stringify(from ?? null) !== JSON.stringify(to ?? null)
        : from !== to;
    if (changed) {
      changes.push({
        key,
        label: DRAFT_FIELD_LABELS[key],
        from: displayValue(key, from),
        to: displayValue(key, to),
      });
    }
  }
  return changes;
}

/** Send only changed fields so partial saves (e.g. WhatsApp number) persist correctly. */
export function buildChangedPayload(
  draft: UpdateStorefrontProfileRequest,
  changes: DraftChange[],
): UpdateStorefrontProfileRequest {
  const payload: UpdateStorefrontProfileRequest = {};
  for (const c of changes) {
    (payload as Record<string, unknown>)[c.key] = draft[c.key];
  }
  return payload;
}
