import type { Metadata } from "next";
import { FaqAccordion } from "@/components/about/faq-accordion";
import { ContactCtaBand } from "@/components/marketing/contact-cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import { pageHeroes } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Modufy plans, modules, security, and getting started.",
};

export default function FaqPage() {
  const hero = pageHeroes.faq;

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
      <section className="section-padding">
        <div className="container-site">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Common questions</h2>
            <p className="mt-3 text-muted-foreground">
              Can&apos;t find what you need?{" "}
              <a href="/contact" className="font-semibold text-brand-leaf-green hover:text-brand-tangerine">
                Contact us
              </a>{" "}
              and we&apos;ll help.
            </p>
          </FadeIn>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>
      <ContactCtaBand />
    </>
  );
}
