import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ContactCtaBand } from "@/components/marketing/contact-cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Why Us",
  description: `Discover why teams choose ${siteConfig.name} to run sales, operations, and customer engagement.`,
};

const reasons = [
  {
    title: "One platform, not ten tabs",
    description:
      "Modufy brings CRM, invoicing, inventory, POS, and more into a single workspace, so your team stops copying data between tools.",
  },
  {
    title: "Modular by design",
    description:
      "Turn on only the modules you need today and add more as you grow. You pay for capability, not clutter.",
  },
  {
    title: "Built for growing teams",
    description:
      "From solo founders to multi-location businesses, Modufy scales with permissions, reporting, and workflows that stay simple.",
  },
  {
    title: "Support that shows up",
    description:
      "Real humans, clear documentation, and a product team that listens: because your operations can't wait on a ticket queue.",
  },
] as const;

export default function WhyUsPage() {
  const hero = pageHeroes.whyUs;

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

      <section className="section-padding pb-10">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-leaf-green">Why us</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Business software that feels designed, not assembled
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Most teams stitch together spreadsheets, chat threads, and disconnected apps. Modufy gives
              you a calmer way to run the business: with modules that share the same customers, products,
              and numbers.
            </p>
            <div className="mt-8">
              <Button href="/demo" size="lg">
                Book a demo
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src={homeImages.pages.whyUs}
                alt="Modufy platform preview"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-leaf-green/30 via-transparent to-brand-tangerine/20" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container-site">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What teams get with Modufy</h2>
          </FadeIn>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {reasons.map((reason, index) => (
              <FadeIn key={reason.title} delay={index * 0.06}>
                <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-leaf-green text-white">
                    <Check className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <ContactCtaBand />
    </>
  );
}
