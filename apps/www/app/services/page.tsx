import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingPlansGrid } from "@/components/pricing/pricing-plans-grid";
import { ServicesGrid } from "@/components/services/services-grid";
import { ServicesTestimonialBlock } from "@/components/services/services-testimonial-block";
import { FadeIn } from "@/components/ui/fade-in";
import { pricingPagePlans } from "@/lib/pricing-content";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Services",
  description: `Explore ${siteConfig.name} services — customer support, marketing, finance, and more.`,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Modules"
        title="Our Services"
        subtitle="This page has moved — explore Modufy modules instead."
        image={pageHeroes.modules.image}
        imageAlt={pageHeroes.modules.imageAlt}
        breadcrumbs={[{ label: "Home", href: "/" }]}
      />
      <section className="section-padding">
        <div className="container-site">
          <FadeIn className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold sm:text-4xl">Wide range of SaaS solutions</h2>
            </div>
            <div className="flex items-center lg:col-span-5">
              <p className="text-base leading-relaxed text-muted-foreground">
                Discovered our all customized services and you can double, triple, or quadruple your
                income & beat your competition with professional services!
              </p>
            </div>
          </FadeIn>
          <div className="mt-12">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <PricingPlansGrid plans={pricingPagePlans} className="border-t border-border bg-muted/20" />
      <ServicesTestimonialBlock />
    </>
  );
}
