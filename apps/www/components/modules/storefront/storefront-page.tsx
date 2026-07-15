import {
  StorefrontCloseSection,
  StorefrontCustomizeSection,
  StorefrontDiscoverSection,
  StorefrontHero,
  StorefrontReadySection,
  StorefrontTrustStrip,
} from "@/components/modules/storefront/storefront-builder-sections";

export function StorefrontPage() {
  return (
    <>
      <StorefrontHero />
      <StorefrontTrustStrip />
      <StorefrontCustomizeSection />
      <StorefrontDiscoverSection />
      <StorefrontReadySection />
      <StorefrontCloseSection />
    </>
  );
}
