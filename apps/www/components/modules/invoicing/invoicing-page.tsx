import { InvoicingCapabilities } from "@/components/modules/invoicing/invoicing-capabilities";
import { InvoicingHero } from "@/components/modules/invoicing/invoicing-hero";
import { InvoicingInteractivePreview } from "@/components/modules/invoicing/invoicing-interactive-preview";
import {
  InvoicingAudienceSection,
  InvoicingComparisonSection,
  InvoicingConnectionsSection,
  InvoicingFinalCta,
  InvoicingGhanaSection,
  InvoicingPricingSection,
  InvoicingTestimonialsSection,
} from "@/components/modules/invoicing/invoicing-sections";
import { InvoicingTrustStrip } from "@/components/modules/invoicing/invoicing-trust-strip";
import { InvoicingWorkflow } from "@/components/modules/invoicing/invoicing-workflow";

export function InvoicingPage() {
  return (
    <>
      <InvoicingHero />
      <InvoicingTrustStrip />
      <InvoicingWorkflow />
      <InvoicingCapabilities />
      <InvoicingInteractivePreview />
      <InvoicingGhanaSection />
      <InvoicingAudienceSection />
      <InvoicingConnectionsSection />
      <InvoicingComparisonSection />
      <InvoicingTestimonialsSection />
      <InvoicingPricingSection />
      <InvoicingFinalCta />
    </>
  );
}
