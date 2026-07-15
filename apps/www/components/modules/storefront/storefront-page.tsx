import { StorefrontCapabilities } from "@/components/modules/storefront/storefront-capabilities";
import { StorefrontHero } from "@/components/modules/storefront/storefront-hero";
import { StorefrontInteractivePreview } from "@/components/modules/storefront/storefront-interactive-preview";
import {
  StorefrontAudienceSection,
  StorefrontComparisonSection,
  StorefrontConnectionsSection,
  StorefrontFinalCta,
  StorefrontPresenceSection,
  StorefrontPricingSection,
  StorefrontTestimonialsSection,
} from "@/components/modules/storefront/storefront-sections";
import { StorefrontTrustStrip } from "@/components/modules/storefront/storefront-trust-strip";
import { StorefrontWorkflow } from "@/components/modules/storefront/storefront-workflow";

export function StorefrontPage() {
  return (
    <>
      <StorefrontHero />
      <StorefrontTrustStrip />
      <StorefrontWorkflow />
      <StorefrontCapabilities />
      <StorefrontInteractivePreview />
      <StorefrontPresenceSection />
      <StorefrontAudienceSection />
      <StorefrontConnectionsSection />
      <StorefrontComparisonSection />
      <StorefrontTestimonialsSection />
      <StorefrontPricingSection />
      <StorefrontFinalCta />
    </>
  );
}
