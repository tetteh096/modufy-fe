import { BrandSlider } from "@/components/home/brand-slider";
import { BuildFastSection } from "@/components/home/build-fast-section";
import { CohostSection } from "@/components/home/cohost-section";
import { CtaSection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeStorySection } from "@/components/home/home-story-section";
import { PlatformGlassSection } from "@/components/home/platform-glass-section";
import { ScaleAudienceSection } from "@/components/home/scale-audience-section";
import { SellEverywhereSection } from "@/components/home/sell-everywhere-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SellEverywhereSection />
      <PlatformGlassSection />
      <BrandSlider />
      <CohostSection />
      <HomeStorySection />
      <TestimonialsSection />
      <ScaleAudienceSection />
      <BuildFastSection />
      <CtaSection />
    </>
  );
}
