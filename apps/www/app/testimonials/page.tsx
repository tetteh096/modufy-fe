import type { Metadata } from "next";
import { ContactCtaBand } from "@/components/marketing/contact-cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceReviewsSection } from "@/components/services/service-detail-sections";
import { pageHeroes } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "See what Modufy customers say about us.",
};

export default function TestimonialsPage() {
  const hero = pageHeroes.testimonials;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        image={hero.image}
        imageAlt={hero.imageAlt}
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />
      <ServiceReviewsSection />
      <ContactCtaBand />
    </>
  );
}
