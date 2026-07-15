import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import {
  PosCloseSection,
  PosConnectedSection,
  PosDevicesSection,
  PosFeaturesGrid,
  PosGetStartedSection,
  PosOmnichannelSection,
  PosScaleSection,
} from "@/components/modules/pos/pos-visual-sections";
import { moduleHeroImages } from "@/lib/module-heroes";
import { appPath } from "@/lib/site-config";

export function PosPage() {
  return (
    <>
      <ModuleFullBleedHero
        breadcrumb="Point of Sale"
        eyebrow="POS system"
        title="The point of sale"
        titleAccent="for every sale."
        description="From first sale to full scale: scan, sell, and receipt at the counter while Inventory, customers, and books stay in sync."
        image={moduleHeroImages.pos}
        imageAlt="Retail point of sale counter"
        primaryCta={{ href: appPath("/register"), label: "Start for free", external: true }}
        secondaryCta={{ href: "/demo", label: "Get in touch" }}
        note="Already on Modufy? Enable Point of Sale on your account anytime."
      />
      <PosScaleSection />
      <PosOmnichannelSection />
      <PosConnectedSection />
      <PosDevicesSection />
      <PosFeaturesGrid />
      <PosGetStartedSection />
      <PosCloseSection />
    </>
  );
}
