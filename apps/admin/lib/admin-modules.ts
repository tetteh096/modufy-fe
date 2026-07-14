import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarClock,
  FileText,
  Megaphone,
  PieChart,
  ShoppingCart,
  Sparkles,
  Store,
  Warehouse,
} from "lucide-react";

export type AdminModuleCategory = "sell" | "operate" | "grow";

export type AdminModuleDef = {
  key: string;
  label: string;
  description: string;
  category: AdminModuleCategory;
  icon: LucideIcon;
  tint: string;
  iconBg: string;
};

export const ADMIN_MODULE_CATEGORIES: {
  id: AdminModuleCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "sell",
    label: "Sell & get paid",
    description: "Checkout, invoicing, and storefront tools",
  },
  {
    id: "operate",
    label: "Run the business",
    description: "Stock, bookings, and finance",
  },
  {
    id: "grow",
    label: "Grow & engage",
    description: "Marketing, content, and AI",
  },
];

export const ADMIN_MODULES: AdminModuleDef[] = [
  {
    key: "invoices",
    label: "Invoices",
    description: "Professional invoices, VAT, PDF export, and WhatsApp delivery.",
    category: "sell",
    icon: FileText,
    tint: "border-blue-500/20 bg-blue-500/[0.04]",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    key: "pos",
    label: "Point of sale",
    description: "In-store register, receipts, and pickup fulfilment.",
    category: "sell",
    icon: ShoppingCart,
    tint: "border-violet-500/20 bg-violet-500/[0.04]",
    iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    key: "marketplace",
    label: "Marketplace",
    description: "Public storefront, online catalog, and guest booking.",
    category: "sell",
    icon: Store,
    tint: "border-teal-500/20 bg-teal-500/[0.04]",
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    key: "inventory",
    label: "Inventory",
    description: "Products, variants, stock levels, and purchase orders.",
    category: "operate",
    icon: Warehouse,
    tint: "border-purple-500/20 bg-purple-500/[0.04]",
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    key: "appointments",
    label: "Appointments",
    description: "Booking calendar, deposits, reminders, and auto-invoice.",
    category: "operate",
    icon: CalendarClock,
    tint: "border-pink-500/20 bg-pink-500/[0.04]",
    iconBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    key: "accounts",
    label: "Accounts",
    description: "P&L, journals, VAT returns, and accountant-friendly exports.",
    category: "operate",
    icon: PieChart,
    tint: "border-amber-500/20 bg-amber-500/[0.04]",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "SMS and email campaigns, segments, and opt-out management.",
    category: "grow",
    icon: Megaphone,
    tint: "border-orange-500/20 bg-orange-500/[0.04]",
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    key: "blog",
    label: "Blog",
    description: "SEO blog with rich editor and public posts.",
    category: "grow",
    icon: BookOpen,
    tint: "border-emerald-500/20 bg-emerald-500/[0.04]",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "ai",
    label: "AI Assistant",
    description: "Drafting, insights, and document AI with usage budgets.",
    category: "grow",
    icon: Sparkles,
    tint: "border-fuchsia-500/20 bg-fuchsia-500/[0.04]",
    iconBg: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  },
];

export function getAdminModule(key: string) {
  return ADMIN_MODULES.find((m) => m.key === key);
}
