import { MarketingHero } from "@/components/modules/marketing/marketing-hero";
import {
  MarketingAfterSendSection,
  MarketingAutomationSection,
  MarketingCloseSection,
  MarketingPhoneSection,
  MarketingReachSection,
} from "@/components/modules/marketing/marketing-motion-sections";
import { MarketingTrustStrip } from "@/components/modules/marketing/marketing-trust-strip";

export function MarketingPage() {
  return (
    <>
      <MarketingHero />
      <MarketingTrustStrip />
      <MarketingReachSection />
      <MarketingPhoneSection />
      <MarketingAutomationSection />
      <MarketingAfterSendSection />
      <MarketingCloseSection />
    </>
  );
}
