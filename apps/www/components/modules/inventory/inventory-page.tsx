import { InventoryCapabilities } from "@/components/modules/inventory/inventory-capabilities";
import { InventoryHero } from "@/components/modules/inventory/inventory-hero";
import { InventoryInteractivePreview } from "@/components/modules/inventory/inventory-interactive-preview";
import {
  InventoryAudienceSection,
  InventoryComparisonSection,
  InventoryConnectionsSection,
  InventoryFinalCta,
  InventoryFlowSection,
  InventoryPricingSection,
  InventoryTestimonialsSection,
} from "@/components/modules/inventory/inventory-sections";
import { InventoryTrustStrip } from "@/components/modules/inventory/inventory-trust-strip";
import { InventoryWorkflow } from "@/components/modules/inventory/inventory-workflow";

export function InventoryPage() {
  return (
    <>
      <InventoryHero />
      <InventoryTrustStrip />
      <InventoryWorkflow />
      <InventoryCapabilities />
      <InventoryInteractivePreview />
      <InventoryFlowSection />
      <InventoryAudienceSection />
      <InventoryConnectionsSection />
      <InventoryComparisonSection />
      <InventoryTestimonialsSection />
      <InventoryPricingSection />
      <InventoryFinalCta />
    </>
  );
}
