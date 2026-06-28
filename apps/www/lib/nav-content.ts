import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  Code,
  HelpCircle,
  Link2,
  MessageSquare,
  Newspaper,
  Store,
  Users,
} from "lucide-react";
import {
  modufyModules,
  moduleCategoryMeta,
  moduleCategoryOrder,
  type ModuleCategoryId,
} from "@/lib/modules-content";
import { homeImages } from "@/lib/home-images";

export type NavModule = {
  label: string;
  href: string;
  description: string;
};

export type NavModuleCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  modules: NavModule[];
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
};

const categoryImages: Record<ModuleCategoryId, { image: string; imageAlt: string }> = {
  revenue: { image: homeImages.features.pipeline, imageAlt: "Grow revenue with Modufy modules" },
  operations: { image: homeImages.features.tracking, imageAlt: "Run operations with Modufy" },
  engage: { image: homeImages.story.support, imageAlt: "Engage customers with Modufy" },
  finance: { image: homeImages.features.analytics, imageAlt: "Control finances with Modufy" },
};

const navCategorySlugs: Record<ModuleCategoryId, string[]> = {
  revenue: ["invoices", "marketing", "marketplace", "core"],
  operations: ["inventory", "pos", "appointments"],
  engage: ["appointments", "blog", "marketing"],
  finance: ["accounts", "ai", "invoices"],
};

export const moduleNavCategories: NavModuleCategory[] = moduleCategoryOrder.map((id) => {
  const meta = moduleCategoryMeta[id];
  const visuals = categoryImages[id];
  const modules = navCategorySlugs[id]
    .map((slug) => modufyModules.find((m) => m.slug === slug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return {
    id,
    label: meta.label,
    description: meta.description,
    icon: meta.icon,
    modules: modules.map((module) => ({
      label: module.name,
      href: `/modules/${module.slug}`,
      description: module.tagline,
    })),
    image: visuals.image,
    imageAlt: visuals.imageAlt,
    cta: { label: "View all modules", href: "/modules" },
  };
});

/** @deprecated use moduleNavCategories */
export const featureModuleCategories = moduleNavCategories;

export const modulesNavHref = "/modules";

export const aboutNavLinks = [
  {
    label: "About Us",
    href: "/about",
    description: "Our story, team, and values.",
    icon: Users,
  },
  {
    label: "Why Us",
    href: "/why-us",
    description: "What makes Modufy different for your business.",
    icon: Store,
  },
  {
    label: "Demo",
    href: "/demo",
    description: "Book a walkthrough with our team.",
    icon: Calendar,
  },
] as const;

export const resourcesNavLinks = [
  {
    label: "Documentation",
    href: "/docs",
    description: "Guides to set up, configure, and grow with Modufy.",
    icon: BookOpen,
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Product updates, tips, and stories from growing teams.",
    icon: Newspaper,
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Quick answers on plans, modules, and getting started.",
    icon: HelpCircle,
  },
  {
    label: "Integrations",
    href: "/integrations",
    description: "Connect Stripe, Shopify, QuickBooks, and more.",
    icon: Link2,
  },
  {
    label: "API reference",
    href: "/docs#api",
    description: "REST endpoints, webhooks, and authentication.",
    icon: Code,
  },
  {
    label: "Help center",
    href: "/contact",
    description: "Talk to our team — support, sales, and onboarding.",
    icon: MessageSquare,
  },
] as const;

export const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

/** @deprecated use modulesNavHref */
export const featuresNavHref = "/modules";
