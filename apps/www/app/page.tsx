import { BrandSlider } from "@/components/home/brand-slider";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { HomeStorySection } from "@/components/home/home-story-section";
import { IntegrationsSection } from "@/components/home/integrations-section";
import { PricingSection } from "@/components/home/pricing-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandSlider />
      <FeaturesSection />
      <HomeStorySection />
      <TestimonialsSection />
      <PricingSection />
      <IntegrationsSection />
      <CtaSection />
    </>
  );
}
