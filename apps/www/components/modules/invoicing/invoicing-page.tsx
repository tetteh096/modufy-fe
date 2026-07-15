import { InvoicingCapabilities } from "@/components/modules/invoicing/invoicing-capabilities";
import { InvoicingHero } from "@/components/modules/invoicing/invoicing-hero";
import { InvoicingInteractivePreview } from "@/components/modules/invoicing/invoicing-interactive-preview";
import {
  InvoicingComparisonSection,
  InvoicingConnectionsSection,
  InvoicingFinalCta,
  InvoicingPricingSection,
  InvoicingSpotlightSection,
  InvoicingVisualFeatures,
} from "@/components/modules/invoicing/invoicing-sections";
import { InvoicingTrustStrip } from "@/components/modules/invoicing/invoicing-trust-strip";
import { InvoicingWorkflow } from "@/components/modules/invoicing/invoicing-workflow";

export function InvoicingPage() {
  return (
    <>
      <InvoicingHero />
      <InvoicingTrustStrip />
      <InvoicingSpotlightSection />
      <InvoicingWorkflow />
      <InvoicingCapabilities />
      <InvoicingVisualFeatures />
      <InvoicingInteractivePreview />
      <InvoicingConnectionsSection />
      <InvoicingComparisonSection />
      <InvoicingPricingSection />
      <InvoicingFinalCta />
    </>
  );
}
