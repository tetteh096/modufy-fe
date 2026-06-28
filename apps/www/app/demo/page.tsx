import type { Metadata } from "next";
import { FaqAccordion } from "@/components/about/faq-accordion";
import { DemoPageIntro } from "@/components/marketing/demo-page-intro";
import { DemoRequestForm } from "@/components/marketing/demo-request-form";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import { demoFaqs } from "@/lib/demo-content";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: `Schedule a personalized Modufy walkthrough — see Core, invoicing, inventory, POS, and the modules that fit your business. ${siteConfig.name}.`,
};

export default function DemoPage() {
  const hero = pageHeroes.demo;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        image={hero.image}
        imageAlt={hero.imageAlt}
        breadcrumbs={[{ label: "Home", href: "/" }]}
        tags={hero.tags}
      />

      <section className="relative z-10 -mt-6 pb-16 md:pb-24">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <DemoPageIntro />
            <FadeIn delay={0.08}>
              <DemoRequestForm />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-[#faf8f5]">
        <div className="container-site">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Before you book
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Common demo questions</h2>
            <p className="mt-3 text-muted-foreground">
              Still unsure? These come up often — or skip the call and{" "}
              <a href="/pricing" className="font-semibold text-brand-leaf-green hover:text-brand-tangerine">
                start free on Core
              </a>
              .
            </p>
          </FadeIn>
          <div className="mt-12">
            <FaqAccordion items={demoFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
