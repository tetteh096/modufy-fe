import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  InventoryCatalogMarquee,
  InventoryCloseSection,
  InventoryLiveFeedSection,
  InventoryScanSection,
  InventoryTrustStrip,
  InventoryVisualFeatures,
} from "@/components/modules/inventory/inventory-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function InventoryPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Inventory & Stock"
        eyebrow="Paid module"
        title="Know what you have."
        titleAccent="Know what you sold."
        description="One catalog for products and services. Sell through POS, invoices, or storefront, stock updates in the same place."
        image={moduleHeroImages.inventory}
        imageAlt="Inventory and stock management"
      />
      <InventoryTrustStrip />
      <InventoryCatalogMarquee />
      <InventoryVisualFeatures />
      <InventoryLiveFeedSection />
      <InventoryScanSection />
      <InventoryCloseSection />
    </>
  );
}
