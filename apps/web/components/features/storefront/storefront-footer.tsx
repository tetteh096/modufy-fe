"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { buildCatalog, categoryShopUrl } from "./storefront-catalog";
import { StorefrontThemeToggle } from "./storefront-theme-toggle";

type StorefrontFooterProps = {
  sf: PublicStorefront;
  accent: string;
};

const SOCIAL_LABELS: Record<"instagram" | "facebook" | "twitter" | "tiktok" | "whatsapp", string> = {
  instagram: "IG",
  facebook: "FB",
  twitter: "X",
  tiktok: "TT",
  whatsapp: "WA",
};

function SocialIcon({ platform }: { platform: keyof typeof SOCIAL_LABELS }) {
  if (platform === "whatsapp") {
    return <MessageCircle className="h-4 w-4" />;
  }
  return <span className="text-[10px] font-bold leading-none">{SOCIAL_LABELS[platform]}</span>;
}

export function StorefrontFooter({ sf, accent }: StorefrontFooterProps) {
  const base = `/p/${sf.business_slug}`;
  const catalog = buildCatalog(sf.products);
  const year = new Date().getFullYear();

  const socials = [
    sf.social_instagram ? { href: sf.social_instagram, platform: "instagram" as const, label: "Instagram" } : null,
    sf.social_facebook ? { href: sf.social_facebook, platform: "facebook" as const, label: "Facebook" } : null,
    sf.social_twitter ? { href: sf.social_twitter, platform: "twitter" as const, label: "Twitter" } : null,
    sf.social_tiktok ? { href: sf.social_tiktok, platform: "tiktok" as const, label: "TikTok" } : null,
    sf.show_whatsapp && sf.whatsapp
      ? {
          href: `https://wa.me/${sf.whatsapp.replace(/\D/g, "")}`,
          platform: "whatsapp" as const,
          label: "WhatsApp",
        }
      : null,
  ].filter(Boolean) as { href: string; platform: "instagram" | "facebook" | "twitter" | "tiktok" | "whatsapp"; label: string }[];

  return (
    <footer
      className="storefront-footer"
      style={{
        ["--sf-footer-accent" as string]: accent,
        /* Default black — override when merchant footer colour is supported */
        ["--sf-footer-bg" as string]: "#000000",
      }}
    >
      <div className="storefront-footer-accent-wash" aria-hidden />
      <div className="storefront-footer-accent-bar" style={{ background: accent }} aria-hidden />

      <div className="storefront-footer-inner">
        <div className="storefront-footer-brand-col">
          <div className="storefront-footer-brand">
            {sf.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveMediaUrl(sf.logo_url)} alt={sf.business_name} className="storefront-footer-logo" />
            ) : (
              <span className="storefront-footer-mark" style={{ background: accent }}>
                {sf.business_name.slice(0, 1)}
              </span>
            )}
            <p className="storefront-footer-name">{sf.business_name}</p>
          </div>
          <p className="storefront-footer-tagline">
            {sf.footer_text || sf.bio || sf.tagline || `Quality products and service from ${sf.business_name}.`}
          </p>
          {socials.length > 0 ? (
            <div className="storefront-social">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="storefront-social-link"
                  aria-label={s.label}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="storefront-footer-title">Explore</p>
          <div className="storefront-footer-links">
            <Link href={base}>{sf.nav_home_label || "Home"}</Link>
            {sf.show_products && sf.products.length > 0 ? (
              <>
                <Link href={`${base}/shop`}>{sf.nav_shop_label || "Shop"}</Link>
                <Link href={`${base}/new-arrivals`}>New Arrivals</Link>
                <Link href={`${base}/search`}>Search</Link>
              </>
            ) : null}
            {sf.show_services && sf.services.length > 0 ? (
              <Link href={`${base}/services`}>{sf.nav_services_label || "Services"}</Link>
            ) : null}
            <Link href={`${base}/blog`}>Blog</Link>
            <Link href={`${base}/contact`}>{sf.nav_contact_label || "Contact"}</Link>
          </div>
        </div>

        {catalog.length > 0 ? (
          <div>
            <p className="storefront-footer-title">Collections</p>
            <div className="storefront-footer-links">
              {catalog.slice(0, 5).map((cat) => (
                <Link key={cat.name} href={categoryShopUrl(base, cat.name)}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="storefront-footer-title">Contact</p>
            <div className="storefront-footer-links">
              {sf.show_phone && sf.phone ? <a href={`tel:${sf.phone}`}>{sf.phone}</a> : null}
              {sf.show_email && sf.email ? <a href={`mailto:${sf.email}`}>{sf.email}</a> : null}
              {sf.city ? <span>{[sf.area, sf.city, sf.country].filter(Boolean).join(", ")}</span> : null}
            </div>
          </div>
        )}
      </div>

      <div className="storefront-footer-bottom">
        <span>© {year} {sf.business_name}. All rights reserved.</span>
        <StorefrontThemeToggle variant="footer" className="storefront-footer-theme" />
        <span>
          Powered by{" "}
          <a href="https://bizos.app" className="storefront-footer-bizos">
            BizOS
          </a>
        </span>
      </div>
    </footer>
  );
}
