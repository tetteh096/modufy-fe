import type { LucideIcon } from "lucide-react";
import {
  Building2,
  MapPin,
  Palette,
  Store,
  Receipt,
  Coins,
  Clock,
  Users,
  Puzzle,
  FileText,
  Package,
  CalendarDays,
  BarChart3,
  Bell,
  PenLine,
  ScrollText,
  Monitor,
  Sparkles,
  LifeBuoy,
} from "lucide-react";

export type SettingsNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Module key — when set, item only appears if module is enabled (or show locked preview) */
  module?: string;
};

export const SETTINGS_BUSINESS_NAV: SettingsNavItem[] = [
  {
    href: "/settings/general",
    label: "General",
    description: "Name, location, and contact",
    icon: Building2,
  },
  {
    href: "/settings/branches",
    label: "Branches",
    description: "Shop locations and branch access",
    icon: MapPin,
  },
  {
    href: "/settings/branding",
    label: "Branding",
    description: "Logo and brand colour",
    icon: Palette,
  },
  {
    href: "/settings/storefront",
    label: "Storefront",
    description: "Public shop URL slug",
    icon: Store,
  },
  {
    href: "/settings/tax",
    label: "Tax & VAT",
    description: "Registration and tax IDs",
    icon: Receipt,
  },
  {
    href: "/settings/currency",
    label: "Currency",
    description: "Default and accepted currencies",
    icon: Coins,
  },
  {
    href: "/settings/hours",
    label: "Business hours",
    description: "Opening times per day",
    icon: Clock,
  },
  {
    href: "/settings/team",
    label: "Team",
    description: "Staff invites and roles",
    icon: Users,
  },
  {
    href: "/settings/activity",
    label: "Activity log",
    description: "Who did what across your business",
    icon: ScrollText,
  },
  {
    href: "/settings/support",
    label: "Support access",
    description: "Grant Modufy help without sharing your password",
    icon: LifeBuoy,
  },
  {
    href: "/settings/alerts",
    label: "Alerts",
    description: "When to notify you about invoices, stock, and tax",
    icon: Bell,
  },
  {
    href: "/settings/modules",
    label: "Your plan",
    description: "Enabled modules on your account",
    icon: Puzzle,
  },
];

export const SETTINGS_MODULE_NAV: SettingsNavItem[] = [
  {
    href: "/settings/invoices",
    label: "Invoices",
    description: "VAT, templates, and e-VAT",
    icon: FileText,
    module: "invoices",
  },
  {
    href: "/settings/inventory",
    label: "Inventory",
    description: "Stock alerts and product defaults",
    icon: Package,
    module: "inventory",
  },
  {
    href: "/settings/pos",
    label: "POS",
    description: "Receipts, payments, and register defaults",
    icon: Monitor,
    module: "pos",
  },
  {
    href: "/settings/appointments",
    label: "Appointments",
    description: "Booking rules and reminders",
    icon: CalendarDays,
    module: "appointments",
  },
  {
    href: "/settings/marketplace",
    label: "Marketplace",
    description: "Storefront and discovery",
    icon: Store,
    module: "marketplace",
  },
  {
    href: "/settings/accounts",
    label: "Accounts",
    description: "Reports and fiscal periods",
    icon: BarChart3,
    module: "accounts",
  },
  {
    href: "/settings/blog",
    label: "Blog",
    description: "SEO and publishing defaults",
    icon: PenLine,
    module: "blog",
  },
  {
    href: "/settings/ai",
    label: "AI",
    description: "Budget, billing mode, and provider keys",
    icon: Sparkles,
    module: "ai",
  },
];

export const MODULE_LABELS: Record<string, string> = {
  invoices: "Invoices",
  inventory: "Inventory",
  appointments: "Appointments",
  marketplace: "Marketplace",
  accounts: "Accounts",
  blog: "Blog",
  pos: "POS",
  ai: "AI",
};

const ALL_SETTINGS_NAV: SettingsNavItem[] = [
  ...SETTINGS_BUSINESS_NAV,
  ...SETTINGS_MODULE_NAV,
];

export function getSettingsNavMeta(pathname: string): SettingsNavItem | undefined {
  return ALL_SETTINGS_NAV.find((item) => pathname === item.href);
}
