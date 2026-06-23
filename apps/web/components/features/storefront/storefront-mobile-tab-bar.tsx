"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStorefront } from "./storefront-context";

export function StorefrontMobileTabBar() {
  const { sf, basePath, cartCount, mobileMenuOpen, setMobileMenuOpen } = useStorefront();
  const pathname = usePathname();

  if (!sf) return null;

  const showCatalog = sf.show_products && sf.products.length > 0;

  const tabs = [
    {
      key: "home",
      href: basePath,
      label: sf.nav_home_label || "Home",
      icon: Home,
      active: pathname === basePath,
      show: true,
    },
    {
      key: "shop",
      href: `${basePath}/shop`,
      label: sf.nav_shop_label || "Shop",
      icon: ShoppingBag,
      active: pathname.startsWith(`${basePath}/shop`),
      show: showCatalog,
    },
    {
      key: "new",
      href: `${basePath}/new-arrivals`,
      label: "New",
      icon: Sparkles,
      active: pathname.startsWith(`${basePath}/new-arrivals`),
      show: showCatalog,
    },
    {
      key: "cart",
      href: `${basePath}/cart`,
      label: sf.nav_cart_label || "Cart",
      icon: ShoppingCart,
      active: pathname.startsWith(`${basePath}/cart`),
      badge: cartCount,
      show: sf.show_products,
    },
  ].filter((t) => t.show);

  return (
    <nav className="sf-mobile-tab-bar" aria-label="Quick navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn("sf-mobile-tab", tab.active && "is-active")}
            aria-current={tab.active ? "page" : undefined}
          >
            <span className="sf-mobile-tab-icon">
              <Icon className="h-5 w-5" />
              {"badge" in tab && tab.badge && tab.badge > 0 ? (
                <span className="sf-mobile-tab-badge">{tab.badge > 9 ? "9+" : tab.badge}</span>
              ) : null}
            </span>
            <span className="sf-mobile-tab-label">{tab.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        className={cn("sf-mobile-tab", mobileMenuOpen && "is-active")}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className="sf-mobile-tab-icon">
          <Menu className="h-5 w-5" />
        </span>
        <span className="sf-mobile-tab-label">Menu</span>
      </button>
    </nav>
  );
}
