import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Package,
  BarChart3,
  CalendarDays,
  Store,
  PenLine,
  Monitor,
  Sparkles,
  Megaphone,
} from "lucide-react";

export type AppModuleKey =
  | "invoices"
  | "inventory"
  | "accounts"
  | "appointments"
  | "marketplace"
  | "blog"
  | "pos"
  | "ai"
  | "marketing";

export type AppModuleSubNavItem = {
  label: string;
  href: string;
  isActive: (pathname: string, search: URLSearchParams) => boolean;
};

export type AppModuleNavConfig = {
  key: AppModuleKey;
  label: string;
  icon: LucideIcon;
  href: string;
  isInModule: (pathname: string) => boolean;
  subNav: AppModuleSubNavItem[];
};

const SETTINGS_INVOICES = "/settings/invoices";
const SETTINGS_APPOINTMENTS = "/settings/appointments";

export const APP_MODULE_NAV: AppModuleNavConfig[] = [
  {
    key: "ai",
    label: "AI Assistant",
    icon: Sparkles,
    href: "/ai",
    isInModule: (pathname) =>
      pathname === "/ai" ||
      pathname.startsWith("/ai/") ||
      pathname === "/settings/ai",
    subNav: [
      { label: "Assistant", href: "/ai", isActive: (pathname) => pathname === "/ai" },
      {
        label: "Usage & settings",
        href: "/settings/ai",
        isActive: (pathname) => pathname === "/settings/ai",
      },
    ],
  },
  {
    key: "pos",
    label: "POS",
    icon: Monitor,
    href: "/pos",
    isInModule: (pathname) => pathname === "/pos" || pathname.startsWith("/pos/"),
    subNav: [
      { label: "Register", href: "/pos/register", isActive: (pathname) => pathname === "/pos/register" },
      { label: "POS sales", href: "/pos/sales", isActive: (pathname) => pathname === "/pos/sales" },
      {
        label: "Settings",
        href: "/settings/pos",
        isActive: (pathname) => pathname === "/settings/pos",
      },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    icon: Megaphone,
    href: "/marketing",
    isInModule: (pathname) =>
      pathname === "/marketing" || pathname.startsWith("/marketing/"),
    subNav: [
      {
        label: "Campaigns",
        href: "/marketing",
        isActive: (pathname) => pathname === "/marketing",
      },
      {
        label: "Templates",
        href: "/marketing/templates",
        isActive: (pathname) => pathname.startsWith("/marketing/templates"),
      },
      {
        label: "Segments",
        href: "/marketing/segments",
        isActive: (pathname) => pathname.startsWith("/marketing/segments"),
      },
      {
        label: "Opt-outs",
        href: "/marketing/opt-outs",
        isActive: (pathname) => pathname.startsWith("/marketing/opt-outs"),
      },
    ],
  },
  {
    key: "marketplace",
    label: "Marketplace",
    icon: Store,
    href: "/marketplace",
    isInModule: (pathname) =>
      pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    subNav: [
      {
        label: "Storefront",
        href: "/marketplace",
        isActive: (pathname) => pathname === "/marketplace",
      },
      {
        label: "Products",
        href: "/marketplace/products",
        isActive: (pathname) => pathname === "/marketplace/products",
      },
      {
        label: "Deals",
        href: "/marketplace/deals",
        isActive: (pathname) => pathname.startsWith("/marketplace/deals"),
      },
      {
        label: "Coupons",
        href: "/marketplace/coupons",
        isActive: (pathname) => pathname.startsWith("/marketplace/coupons"),
      },
      {
        label: "Orders",
        href: "/orders",
        isActive: (pathname) =>
          pathname === "/orders" ||
          pathname.startsWith("/orders/") ||
          pathname === "/marketplace/orders" ||
          pathname.startsWith("/marketplace/orders/"),
      },
      {
        label: "Enquiries",
        href: "/marketplace/enquiries",
        isActive: (pathname) =>
          pathname === "/marketplace/enquiries" || pathname.startsWith("/marketplace/enquiries/"),
      },
      {
        label: "Photos",
        href: "/marketplace/portfolio",
        isActive: (pathname) => pathname === "/marketplace/portfolio",
      },
      {
        label: "Portfolio",
        href: "/marketplace/work",
        isActive: (pathname) =>
          pathname === "/marketplace/work" || pathname.startsWith("/marketplace/work/"),
      },
      {
        label: "Reviews",
        href: "/marketplace/reviews",
        isActive: (pathname) => pathname === "/marketplace/reviews",
      },
    ],
  },
  {
    key: "invoices",
    label: "Invoices",
    icon: FileText,
    href: "/invoices",
    isInModule: (pathname) =>
      pathname === "/invoices" ||
      pathname.startsWith("/invoices/") ||
      pathname === SETTINGS_INVOICES ||
      pathname.startsWith(SETTINGS_INVOICES + "/"),
    subNav: [
      {
        label: "All documents",
        href: "/invoices",
        isActive: (pathname) => pathname === "/invoices",
      },
      {
        label: "New invoice",
        href: "/invoices/new",
        isActive: (pathname, search) =>
          pathname === "/invoices/new" &&
          search.get("type") !== "quote" &&
          search.get("type") !== "proforma",
      },
      {
        label: "New quote",
        href: "/invoices/new?type=quote",
        isActive: (pathname, search) =>
          pathname === "/invoices/new" && search.get("type") === "quote",
      },
      {
        label: "New proforma",
        href: "/invoices/new?type=proforma",
        isActive: (pathname, search) =>
          pathname === "/invoices/new" && search.get("type") === "proforma",
      },
      {
        label: "Appearance",
        href: SETTINGS_INVOICES,
        isActive: (pathname) =>
          pathname === SETTINGS_INVOICES || pathname.startsWith(SETTINGS_INVOICES + "/"),
      },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    isInModule: (pathname) =>
      pathname === "/inventory" || pathname.startsWith("/inventory/"),
    subNav: [
      { label: "Products", href: "/inventory", isActive: (pathname) => pathname === "/inventory" },
      {
        label: "Services",
        href: "/inventory/services",
        isActive: (pathname) =>
          pathname === "/inventory/services" || pathname.startsWith("/inventory/services/"),
      },
      {
        label: "Low stock",
        href: "/inventory/low-stock",
        isActive: (pathname) =>
          pathname === "/inventory/low-stock" || pathname.startsWith("/inventory/low-stock/"),
      },
      {
        label: "Suppliers",
        href: "/inventory/suppliers",
        isActive: (pathname) =>
          pathname === "/inventory/suppliers" || pathname.startsWith("/inventory/suppliers/"),
      },
      {
        label: "Purchase orders",
        href: "/inventory/purchase-orders",
        isActive: (pathname) =>
          pathname === "/inventory/purchase-orders" ||
          pathname.startsWith("/inventory/purchase-orders/"),
      },
    ],
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: BarChart3,
    href: "/accounts",
    isInModule: (pathname) =>
      pathname === "/accounts" || pathname.startsWith("/accounts/"),
    subNav: [
      { label: "Overview", href: "/accounts", isActive: (pathname) => pathname === "/accounts" },
      {
        label: "P&L report",
        href: "/accounts/pnl",
        isActive: (pathname) =>
          pathname === "/accounts/pnl" || pathname.startsWith("/accounts/pnl/"),
      },
      {
        label: "Cash flow",
        href: "/accounts/cashflow",
        isActive: (pathname) =>
          pathname === "/accounts/cashflow" || pathname.startsWith("/accounts/cashflow/"),
      },
      {
        label: "Tax & VAT",
        href: "/accounts/tax",
        isActive: (pathname) =>
          pathname === "/accounts/tax" || pathname.startsWith("/accounts/tax/"),
      },
      {
        label: "Journal",
        href: "/accounts/journal",
        isActive: (pathname) =>
          pathname === "/accounts/journal" || pathname.startsWith("/accounts/journal/"),
      },
    ],
  },
  {
    key: "appointments",
    label: "Appointments",
    icon: CalendarDays,
    href: "/appointments",
    isInModule: (pathname) =>
      pathname === "/appointments" ||
      pathname.startsWith("/appointments/") ||
      pathname === SETTINGS_APPOINTMENTS ||
      pathname.startsWith(SETTINGS_APPOINTMENTS + "/"),
    subNav: [
      {
        label: "Calendar",
        href: "/appointments",
        isActive: (pathname) =>
          pathname === "/appointments" ||
          (pathname.startsWith("/appointments/") &&
            pathname !== "/appointments/new" &&
            pathname !== "/appointments/schedule"),
      },
      {
        label: "New booking",
        href: "/appointments/new",
        isActive: (pathname) => pathname === "/appointments/new",
      },
      {
        label: "Schedule",
        href: "/appointments/schedule",
        isActive: (pathname) => pathname === "/appointments/schedule",
      },
      {
        label: "Settings",
        href: SETTINGS_APPOINTMENTS,
        isActive: (pathname) =>
          pathname === SETTINGS_APPOINTMENTS ||
          pathname.startsWith(SETTINGS_APPOINTMENTS + "/"),
      },
    ],
  },
  {
    key: "blog",
    label: "Blog",
    icon: PenLine,
    href: "/blog",
    isInModule: (pathname) =>
      pathname === "/blog" || pathname.startsWith("/blog/"),
    subNav: [
      {
        label: "All posts",
        href: "/blog",
        isActive: (pathname) => pathname === "/blog",
      },
      {
        label: "New post",
        href: "/blog/new",
        isActive: (pathname) => pathname === "/blog/new",
      },
    ],
  },
];
