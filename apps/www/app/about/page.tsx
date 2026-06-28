import type { Metadata } from "next";
import { FaqSection } from "@/components/about/faq-section";
import { JourneySection } from "@/components/about/journey-section";
import { AboutStatsSection } from "@/components/about/stats-section";
import { TeamSection } from "@/components/about/team-section";
import { ValuesSection } from "@/components/about/values-section";
import { PageHero } from "@/components/marketing/page-hero";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — our mission, team, and the modular platform we built for growing businesses.`,
};

export default function AboutPage() {
  const hero = pageHeroes.about;

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
      <JourneySection />
      <AboutStatsSection />
      <ValuesSection />
      <TeamSection />
      <FaqSection />
    </>
  );
}
