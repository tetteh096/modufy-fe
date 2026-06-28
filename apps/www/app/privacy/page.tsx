import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  const hero = pageHeroes.privacy;

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
              This is a placeholder privacy policy for {siteConfig.name}. Replace with your legal copy
              before launch.
            </p>
            <p className="text-muted-foreground">
              We collect only the information needed to provide our services, improve the product, and
              communicate with you about your account.
            </p>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
