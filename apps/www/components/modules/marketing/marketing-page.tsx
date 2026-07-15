import { MarketingCapabilities } from "@/components/modules/marketing/marketing-capabilities";
import { MarketingHero } from "@/components/modules/marketing/marketing-hero";
import { MarketingInteractivePreview } from "@/components/modules/marketing/marketing-interactive-preview";
import {
  MarketingAudienceSection,
  MarketingComparisonSection,
  MarketingComplianceSection,
  MarketingConnectionsSection,
  MarketingFinalCta,
  MarketingPricingSection,
  MarketingTestimonialsSection,
} from "@/components/modules/marketing/marketing-sections";
import { MarketingTrustStrip } from "@/components/modules/marketing/marketing-trust-strip";
import { MarketingWorkflow } from "@/components/modules/marketing/marketing-workflow";

export function MarketingPage() {
  return (
    <>
      <MarketingHero />
      <MarketingTrustStrip />
      <MarketingWorkflow />
      <MarketingCapabilities />
      <MarketingInteractivePreview />
      <MarketingComplianceSection />
      <MarketingAudienceSection />
      <MarketingConnectionsSection />
      <MarketingComparisonSection />
      <MarketingTestimonialsSection />
      <MarketingPricingSection />
      <MarketingFinalCta />
    </>
  );
}
