import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import { InvoicingCapabilities } from "@/components/modules/invoicing/invoicing-capabilities";
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
import { moduleHeroImages } from "@/lib/module-heroes";

export function InvoicingPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Invoicing"
        eyebrow="Paid module"
        title="Bill professionally."
        titleAccent="Get paid faster."
        description="Create branded invoices, track what is owed, and collect payments, then keep inventory and books in sync."
        image={moduleHeroImages.invoices}
        imageAlt="Professional invoicing"
      />
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
