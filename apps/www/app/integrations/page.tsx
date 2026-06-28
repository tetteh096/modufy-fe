import type { Metadata } from "next";
import { IntegrationsSection } from "@/components/home/integrations-section";
import { PageHero } from "@/components/marketing/page-hero";
import { pageHeroes } from "@/lib/page-heroes";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect Modufy with the tools your team already uses.",
};

export default function IntegrationsPage() {
  const hero = pageHeroes.integrations;

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
      <IntegrationsSection />
    </>
  );
}
