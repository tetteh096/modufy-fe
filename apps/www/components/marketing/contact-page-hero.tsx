import { PageHero } from "@/components/marketing/page-hero";
import { pageHeroes } from "@/lib/page-heroes";

export function ContactPageHero() {
  const hero = pageHeroes.contact;
  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      subtitle={hero.subtitle}
      image={hero.image}
      imageAlt={hero.imageAlt}
      breadcrumbs={[{ label: "Home", href: "/" }]}
      tags={hero.tags}
    />
  );
}
