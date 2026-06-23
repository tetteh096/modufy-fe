"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { activeServices, buildCatalog, buildServiceCatalog, categoryServicesUrl, categoryShopUrl, megaMenuPreview, MEGA_MENU_ITEMS_PER_GROUP } from "./storefront-catalog";
import { StorefrontThemeToggle } from "./storefront-theme-toggle";
import { useStorefront } from "./storefront-context";
import { SfDrawerBackdrop, SfDrawerPanel } from "./storefront-motion";

function MobileAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="storefront-mobile-accordion">
      <button type="button" className="sf-mobile-drawer-accordion-btn" onClick={onToggle}>
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open ? <div className="storefront-mobile-accordion-body">{children}</div> : null}
    </div>
  );
}

export function StorefrontMobileMenu() {
  const { sf, cartCount, wishlistCount, mobileMenuOpen, setMobileMenuOpen, setWishlistOpen } = useStorefront();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<"catalog" | "services" | null>(null);

  const base = sf ? `/p/${sf.business_slug}` : "";
  const catalog = useMemo(() => (sf ? buildCatalog(sf.products) : []), [sf]);
  const catalogPreview = useMemo(() => megaMenuPreview(catalog), [catalog]);
  const services = useMemo(() => (sf ? activeServices(sf) : []), [sf]);
  const serviceCatalog = useMemo(() => buildServiceCatalog(services), [services]);
  const servicePreview = useMemo(() => megaMenuPreview(serviceCatalog), [serviceCatalog]);
  const showCatalog = !!(sf?.show_products && sf.products.length > 0);
  const showServices = services.length > 0;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  if (!mounted || !sf) return null;

  const isHome = pathname === base;
  const isContact = pathname === `${base}/contact`;
  const isBlog = pathname.startsWith(`${base}/blog`);
  const isWork = pathname.startsWith(`${base}/work`);
  const showWork = !!sf.show_work;
  const close = () => setMobileMenuOpen(false);

  return createPortal(
    <>
      <SfDrawerBackdrop open={mobileMenuOpen} onClose={close} />
      <SfDrawerPanel open={mobileMenuOpen} className="sf-mobile-drawer is-open" ariaLabel="Store menu">
        <div className="sf-mobile-drawer-head">
          <div>
            <p className="sf-mobile-drawer-kicker">Menu</p>
            <strong>{sf.header_text || sf.business_name}</strong>
          </div>
          <button type="button" className="sf-mobile-drawer-close" aria-label="Close menu" onClick={close}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="sf-mobile-menu-theme">
          <p className="sf-mobile-menu-theme-label">Appearance</p>
          <StorefrontThemeToggle variant="pill" className="sf-mobile-menu-theme-pill" />
        </div>

        {showCatalog ? (
          <div className="sf-mobile-quick-links">
            <Link href={`${base}/shop`} className="sf-mobile-quick-link" onClick={close}>
              {sf.nav_shop_label || "Shop"}
            </Link>
            <Link href={`${base}/new-arrivals`} className="sf-mobile-quick-link" onClick={close}>
              New Arrivals
            </Link>
            <Link href={`${base}/search`} className="sf-mobile-quick-link" onClick={close}>
              Search
            </Link>
            <button
              type="button"
              className="sf-mobile-quick-link"
              onClick={() => {
                setWishlistOpen(true);
                close();
              }}
            >
              <Heart className="h-3.5 w-3.5" />
              Wishlist
              {wishlistCount > 0 ? <span className="sf-mobile-quick-badge">{wishlistCount}</span> : null}
            </button>
            <Link href={`${base}/cart`} className="sf-mobile-quick-link" onClick={close}>
              {sf.nav_cart_label || "Cart"}
              {cartCount > 0 ? <span className="sf-mobile-quick-badge">{cartCount}</span> : null}
            </Link>
          </div>
        ) : null}

        <nav className="sf-mobile-drawer-nav">
          <Link href={base} className={cn("sf-mobile-drawer-link", isHome && "is-active")} onClick={close}>
            {sf.nav_home_label || "Home"}
          </Link>

          {showCatalog ? (
            <MobileAccordion
              label={sf.nav_shop_label || "Catalog"}
              open={openMenu === "catalog"}
              onToggle={() => setOpenMenu((m) => (m === "catalog" ? null : "catalog"))}
            >
              <Link href={`${base}/shop`} className="storefront-mobile-sublink" onClick={close}>
                All products
              </Link>
              {catalogPreview.visible.map((cat) => (
                <div key={cat.name} className="storefront-mobile-cat">
                  <Link
                    href={categoryShopUrl(base, cat.name)}
                    className="storefront-mobile-sublink storefront-mobile-sublink-strong"
                    onClick={close}
                  >
                    {cat.name}
                  </Link>
                  {cat.products.slice(0, MEGA_MENU_ITEMS_PER_GROUP).map((p) => (
                    <Link key={p.id} href={`${base}/shop/${p.id}`} className="storefront-mobile-sublink" onClick={close}>
                      {p.name}
                    </Link>
                  ))}
                </div>
              ))}
              {catalogPreview.hiddenGroupCount > 0 ? (
                <Link href={`${base}/shop`} className="storefront-mobile-sublink storefront-mobile-sublink-strong" onClick={close}>
                  View all categories
                </Link>
              ) : null}
            </MobileAccordion>
          ) : null}

          {showServices ? (
            <MobileAccordion
              label={sf.nav_services_label || "Services"}
              open={openMenu === "services"}
              onToggle={() => setOpenMenu((m) => (m === "services" ? null : "services"))}
            >
              <Link href={`${base}/services`} className="storefront-mobile-sublink storefront-mobile-sublink-strong" onClick={close}>
                All services
              </Link>
              {servicePreview.visible.map((cat) => (
                <div key={cat.name} className="storefront-mobile-cat">
                  <Link
                    href={categoryServicesUrl(base, cat.name)}
                    className="storefront-mobile-sublink storefront-mobile-sublink-strong"
                    onClick={close}
                  >
                    {cat.name}
                  </Link>
                  {cat.services.slice(0, MEGA_MENU_ITEMS_PER_GROUP).map((s) => (
                    <Link key={s.id} href={`${base}/services/${s.id}`} className="storefront-mobile-sublink" onClick={close}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              ))}
              {servicePreview.hiddenGroupCount > 0 ? (
                <Link href={`${base}/services`} className="storefront-mobile-sublink storefront-mobile-sublink-strong" onClick={close}>
                  View all services
                </Link>
              ) : null}
            </MobileAccordion>
          ) : null}

          {showWork ? (
            <Link href={`${base}/work`} className={cn("sf-mobile-drawer-link", isWork && "is-active")} onClick={close}>
              {sf.nav_work_label || "Portfolio"}
            </Link>
          ) : null}

          <Link href={`${base}/blog`} className={cn("sf-mobile-drawer-link", isBlog && "is-active")} onClick={close}>
            Blog
          </Link>

          <Link href={`${base}/contact`} className={cn("sf-mobile-drawer-link", isContact && "is-active")} onClick={close}>
            {sf.nav_contact_label || "Contact"}
          </Link>
        </nav>
      </SfDrawerPanel>
    </>,
    document.body
  );
}
