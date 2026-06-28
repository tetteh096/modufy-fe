import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  const hero = pageHeroes.terms;

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
      <div className="section-padding">
        <div className="container-site max-w-3xl prose prose-neutral">
          <FadeIn>
            <p className="text-muted-foreground">
              This is a placeholder terms page for {siteConfig.name}. Replace with your legal copy
              before launch.
            </p>
            <p className="text-muted-foreground">
              By using {siteConfig.name}, you agree to use the platform responsibly and in compliance
              with applicable laws in your jurisdiction.
            </p>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
