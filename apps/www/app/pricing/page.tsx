import type { Metadata } from "next";
import { PricingPageView } from "@/components/pricing/pricing-page-view";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Simple, transparent pricing that scales with your team — ${siteConfig.name}.`,
};

export default function PricingPage() {
  return <PricingPageView />;
}
