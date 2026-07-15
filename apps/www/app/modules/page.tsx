import type { Metadata } from "next";
import { ModulesIndex } from "@/components/modules/modules-index";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Modules",
  description: `Explore Modufy modules: invoicing, inventory, POS, appointments, storefront, marketing, accounts, AI, and more. Built on ${siteConfig.name} Core.`,
  keywords: [
    "business modules",
    "invoicing software",
    "inventory management",
    "POS",
    "appointment booking",
    "small business platform",
  ],
  alternates: { canonical: `${siteConfig.url}/modules` },
  openGraph: {
    title: `Modules | ${siteConfig.name}`,
    description: `Explore Modufy modules: invoicing, inventory, POS, appointments, and more. Built on ${siteConfig.name} Core.`,
    url: `${siteConfig.url}/modules`,
    type: "website",
  },
};

export default function ModulesPage() {
  return <ModulesIndex />;
}
