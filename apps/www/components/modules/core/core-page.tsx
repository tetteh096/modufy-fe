import { CoreCapabilities } from "@/components/modules/core/core-capabilities";
import { CoreHero } from "@/components/modules/core/core-hero";
import { CoreInteractivePreview } from "@/components/modules/core/core-interactive-preview";
import {
  CoreAudienceSection,
  CoreComparisonSection,
  CoreConnectionsSection,
  CoreFinalCta,
  CoreFoundationSection,
  CorePricingSection,
  CoreTestimonialsSection,
} from "@/components/modules/core/core-sections";
import { CoreTrustStrip } from "@/components/modules/core/core-trust-strip";
import { CoreWorkflow } from "@/components/modules/core/core-workflow";

export function CorePage() {
  return (
    <>
      <CoreHero />
      <CoreTrustStrip />
      <CoreWorkflow />
      <CoreCapabilities />
      <CoreInteractivePreview />
      <CoreFoundationSection />
      <CoreAudienceSection />
      <CoreConnectionsSection />
      <CoreComparisonSection />
      <CoreTestimonialsSection />
      <CorePricingSection />
      <CoreFinalCta />
    </>
  );
}
