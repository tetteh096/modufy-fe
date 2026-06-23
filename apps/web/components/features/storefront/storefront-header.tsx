"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingCart } from "lucide-react";
import type { PublicStorefront } from "@/types/api";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  activeServices,
  buildCatalog,
  buildServiceCatalog,
  categoryServicesUrl,
  categoryShopUrl,
  megaMenuPreview,
  MEGA_MENU_ITEMS_PER_GROUP,
  productImage,
} from "./storefront-catalog";
import { serviceCoverImage } from "./storefront-service-media";
import { formatDuration } from "./storefront-utils";
import { useStorefront } from "./storefront-context";

type StorefrontHeaderProps = {
  sf: PublicStorefront;
  accent: string;
  cartCount: number;
  showBook?: boolean;
};

export function StorefrontHeader({ sf, accent, cartCount, showBook }: StorefrontHeaderProps) {
  const pathname = usePathname();
  const base = `/p/${sf.business_slug}`;
  const { setMobileMenuOpen, wishlistCount, setWishlistOpen } = useStorefront();
  const [openMenu, setOpenMenu] = useState<"catalog" | "services" | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const catalog = useMemo(() => buildCatalog(sf.products), [sf.products]);
  const catalogPreview = useMemo(() => megaMenuPreview(catalog), [catalog]);
  const services = useMemo(() => activeServices(sf), [sf]);
  const serviceCatalog = useMemo(() => buildServiceCatalog(services), [services]);
  const servicePreview = useMemo(() => megaMenuPreview(serviceCatalog), [serviceCatalog]);
  const featuredService = serviceCatalog[0]?.services[0];
  const featuredServiceImage = featuredService ? serviceCoverImage(featuredService) : null;
  const showCatalog = sf.show_products && sf.products.length > 0;
  const showServices = services.length > 0;

  useEffect(() => {
    setOpenMenu(null);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isHome = pathname === base;
  const isShop = pathname.startsWith(`${base}/shop`);
  const isSearch = pathname.startsWith(`${base}/search`);
  const isNewArrivals = pathname.startsWith(`${base}/new-arrivals`);
  const isServices = pathname.startsWith(`${base}/services`);
  const isContact = pathname === `${base}/contact`;
  const isBlog = pathname.startsWith(`${base}/blog`);
  const isWork = pathname.startsWith(`${base}/work`);
  const showWork = !!sf.show_work;

  return (
    <header className="storefront-header storefront-header--pve">
      <div className="storefront-header-inner">
        <Link href={base} className="storefront-brand" onClick={() => setMobileMenuOpen(false)}>
          {sf.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveMediaUrl(sf.logo_url)} alt={sf.business_name} className="storefront-brand-logo" />
          ) : (
            <span
              className="storefront-brand-mark flex items-center justify-center font-bold text-white"
              style={{ background: accent }}
            >
              {sf.business_name.slice(0, 1)}
            </span>
          )}
          <span className="storefront-brand-name">{sf.header_text || sf.business_name}</span>
        </Link>

        <nav ref={navRef} className="storefront-nav storefront-nav--mega" aria-label="Store navigation">
          <Link href={base} className={cn("storefront-nav-link", isHome && "is-active")}>
            {sf.nav_home_label || "Home"}
          </Link>

          {showCatalog ? (
            <div
              className={cn("storefront-nav-dropdown", openMenu === "catalog" && "is-open")}
              onMouseEnter={() => setOpenMenu("catalog")}
              onMouseLeave={() => setOpenMenu((m) => (m === "catalog" ? null : m))}
            >
              <button
                type="button"
                className={cn("storefront-nav-link storefront-nav-trigger", isShop && "is-active")}
                onClick={() => setOpenMenu((m) => (m === "catalog" ? null : "catalog"))}
                aria-expanded={openMenu === "catalog"}
              >
                {sf.nav_shop_label || "Catalog"}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="storefront-mega-panel">
                <div className="storefront-mega-grid">
                  <div className="storefront-mega-col">
                    <p className="storefront-mega-label">All collections</p>
                    <Link href={`${base}/shop`} className="storefront-mega-link storefront-mega-link-strong">
                      All products
                    </Link>
                    <Link href={`${base}/new-arrivals`} className="storefront-mega-link">
                      New Arrivals
                    </Link>
                    <Link href={`${base}/search`} className="storefront-mega-link">
                      Search
                    </Link>
                    <p className="storefront-mega-hint">Browse the complete catalog</p>
                  </div>

                  <div className="storefront-mega-col storefront-mega-col-wide">
                    <p className="storefront-mega-label">Categories</p>
                    <div className="storefront-mega-categories">
                      {catalogPreview.visible.map((cat) => (
                        <div key={cat.name} className="storefront-mega-category">
                          <Link href={categoryShopUrl(base, cat.name)} className="storefront-mega-link storefront-mega-link-strong">
                            {cat.name}
                          </Link>
                          <ul>
                            {cat.products.slice(0, MEGA_MENU_ITEMS_PER_GROUP).map((p) => (
                              <li key={p.id}>
                                <Link href={`${base}/shop/${p.id}`}>{p.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {catalogPreview.hiddenGroupCount > 0 ? (
                      <Link href={`${base}/shop`} className="storefront-mega-link storefront-mega-more-link">
                        + {catalogPreview.hiddenGroupCount} more categor
                        {catalogPreview.hiddenGroupCount === 1 ? "y" : "ies"}
                      </Link>
                    ) : null}
                  </div>

                  {catalog[0] ? (
                    <div className="storefront-mega-featured">
                      <p className="storefront-mega-label">Featured</p>
                      <div className="storefront-mega-featured-card">
                        {productImage(catalog[0].products[0]) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={productImage(catalog[0].products[0])!} alt={catalog[0].name} />
                        ) : (
                          <div className="storefront-mega-featured-fallback" style={{ color: accent }}>
                            {catalog[0].name.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <strong>{catalog[0].name}</strong>
                          <p>{catalog[0].count} items ready to shop</p>
                          <Link href={categoryShopUrl(base, catalog[0].name)} className="sf-btn sf-btn-solid sf-btn-sm" style={{ background: accent }}>
                            Shop now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {showCatalog ? (
            <Link
              href={`${base}/new-arrivals`}
              className={cn("storefront-nav-link", isNewArrivals && "is-active")}
            >
              New Arrivals
            </Link>
          ) : null}

          {showServices ? (
            <div
              className={cn("storefront-nav-dropdown", openMenu === "services" && "is-open")}
              onMouseEnter={() => setOpenMenu("services")}
              onMouseLeave={() => setOpenMenu((m) => (m === "services" ? null : m))}
            >
              <button
                type="button"
                className={cn("storefront-nav-link storefront-nav-trigger", isServices && "is-active")}
                onClick={() => setOpenMenu((m) => (m === "services" ? null : "services"))}
                aria-expanded={openMenu === "services"}
              >
                {sf.nav_services_label || "Services"}
                <ChevronDown className="h-4 w-4" />
              </button>

              <div className="storefront-mega-panel">
                <div className="storefront-mega-grid">
                  <div className="storefront-mega-col">
                    <p className="storefront-mega-label">All services</p>
                    <Link href={`${base}/services`} className="storefront-mega-link storefront-mega-link-strong">
                      All services
                    </Link>
                    {showBook ? (
                      <Link href={`${base}/book`} className="storefront-mega-link">
                        Book appointment
                      </Link>
                    ) : null}
                    <p className="storefront-mega-hint">
                      {services.length} service{services.length === 1 ? "" : "s"} · browse by category
                    </p>
                  </div>

                  <div className="storefront-mega-col storefront-mega-col-wide">
                    <p className="storefront-mega-label">Categories</p>
                    <div className="storefront-mega-categories">
                      {servicePreview.visible.map((cat) => (
                        <div key={cat.name} className="storefront-mega-category">
                          <Link
                            href={categoryServicesUrl(base, cat.name)}
                            className="storefront-mega-link storefront-mega-link-strong"
                          >
                            {cat.name}
                          </Link>
                          <ul>
                            {cat.services.slice(0, MEGA_MENU_ITEMS_PER_GROUP).map((s) => (
                              <li key={s.id}>
                                <Link href={`${base}/services/${s.id}`}>{s.name}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {servicePreview.hiddenGroupCount > 0 ? (
                      <Link href={`${base}/services`} className="storefront-mega-link storefront-mega-more-link">
                        + {servicePreview.hiddenGroupCount} more categor
                        {servicePreview.hiddenGroupCount === 1 ? "y" : "ies"}
                      </Link>
                    ) : null}
                  </div>

                  {featuredService ? (
                    <div className="storefront-mega-featured">
                      <p className="storefront-mega-label">Featured</p>
                      <div className="storefront-mega-featured-card">
                        {featuredServiceImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredServiceImage} alt={featuredService.name} />
                        ) : (
                          <div className="storefront-mega-featured-fallback" style={{ color: accent }}>
                            {featuredService.name.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <strong>{featuredService.name}</strong>
                          <p>
                            {featuredService.duration_mins > 0
                              ? formatDuration(featuredService.duration_mins)
                              : "Available to book"}
                          </p>
                          <Link
                            href={`${base}/services/${featuredService.id}`}
                            className="sf-btn sf-btn-solid sf-btn-sm"
                            style={{ background: accent }}
                          >
                            View service
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {showWork ? (
            <Link href={`${base}/work`} className={cn("storefront-nav-link", isWork && "is-active")}>
              {sf.nav_work_label || "Portfolio"}
            </Link>
          ) : null}

          <Link href={`${base}/blog`} className={cn("storefront-nav-link", isBlog && "is-active")}>
            Blog
          </Link>

          <Link href={`${base}/contact`} className={cn("storefront-nav-link", isContact && "is-active")}>
            {sf.nav_contact_label || "Contact"}
          </Link>
        </nav>

        <div className="storefront-header-actions">
          {showCatalog ? (
            <Link
              href={`${base}/search`}
              className={cn("storefront-icon-btn storefront-header-search", isSearch && "is-active")}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
          ) : null}
          {showBook ? (
            <Link href={`${base}/book`} className="storefront-header-book storefront-btn-cart" style={{ borderColor: accent, color: accent }}>
              Book
            </Link>
          ) : null}
          {sf.show_products ? (
            <button
              type="button"
              className="storefront-icon-btn storefront-header-wishlist"
              aria-label="Open wishlist"
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 ? (
                <span className="storefront-cart-badge storefront-wishlist-badge">{wishlistCount}</span>
              ) : null}
            </button>
          ) : null}
          {sf.show_products ? (
            <Link href={`${base}/cart`} className="storefront-btn-cart storefront-header-cart">
              <ShoppingCart className="h-4 w-4" />
              <span className="storefront-header-cart-label">{sf.nav_cart_label || "Cart"}</span>
              {cartCount > 0 ? <span className="storefront-cart-badge">{cartCount}</span> : null}
            </Link>
          ) : null}
          <button
            type="button"
            className="sf-mobile-header-menu"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
