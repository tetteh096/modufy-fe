import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  StorefrontCloseSection,
  StorefrontCustomizeSection,
  StorefrontDiscoverSection,
  StorefrontReadySection,
  StorefrontTrustStrip,
} from "@/components/modules/storefront/storefront-builder-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function StorefrontPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Online Storefront"
        eyebrow="Paid module"
        title="Your vision."
        titleAccent="Your storefront, live."
        description="Customize and publish a catalog from Inventory. Products, services, and bookings on a page you control."
        image={moduleHeroImages.marketplace}
        imageAlt="Online storefront"
      />
      <StorefrontTrustStrip />
      <StorefrontCustomizeSection />
      <StorefrontDiscoverSection />
      <StorefrontReadySection />
      <StorefrontCloseSection />
    </>
  );
}
