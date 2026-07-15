import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  MarketingAfterSendSection,
  MarketingAutomationSection,
  MarketingCloseSection,
  MarketingPhoneSection,
  MarketingReachSection,
} from "@/components/modules/marketing/marketing-motion-sections";
import { MarketingTrustStrip } from "@/components/modules/marketing/marketing-trust-strip";
import { moduleHeroImages } from "@/lib/module-heroes";

export function MarketingPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Marketing Campaigns"
        eyebrow="Paid module"
        title="Unify your messaging."
        titleAccent="Reach customers who already know you."
        description="Campaigns, segments, and automations for people already in your business: email and SMS from one place."
        image={moduleHeroImages.marketing}
        imageAlt="Marketing campaigns"
      />
      <MarketingTrustStrip />
      <MarketingReachSection />
      <MarketingPhoneSection />
      <MarketingAutomationSection />
      <MarketingAfterSendSection />
      <MarketingCloseSection />
    </>
  );
}
