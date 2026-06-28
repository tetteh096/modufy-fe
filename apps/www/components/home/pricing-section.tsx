"use client";

import { PricingPlansGrid } from "@/components/pricing/pricing-plans-grid";
import { pricingPlans } from "@/lib/content";

export function PricingSection({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <PricingPlansGrid
      plans={pricingPlans}
      showTitle={showTitle}
      title="Simple plans that scale with you"
      ctaLabel="Start free trial"
      className="relative overflow-hidden bg-[#faf8f5]"
    />
  );
}
