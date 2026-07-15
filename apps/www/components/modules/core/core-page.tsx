import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  CoreCloseSection,
  CoreFoundationSection,
  CoreReadyStrip,
  CoreTrustStrip,
  CoreVisualFeatures,
} from "@/components/modules/core/core-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";

export function CorePage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Modufy Core"
        eyebrow="Included with every account"
        title="Run your business"
        titleAccent="from one foundation."
        description="Customers, sales, expenses, and team access: always on. Add paid modules later without starting over."
        image={moduleHeroImages.core}
        imageAlt="Modufy Core business foundation"
        note="Free to start. No card required."
      />
      <CoreTrustStrip />
      <CoreVisualFeatures />
      <CoreFoundationSection />
      <CoreReadyStrip />
      <CoreCloseSection />
    </>
  );
}
