import { NotFoundContent } from "@/components/marketing/not-found-content";
import { PageHero } from "@/components/marketing/page-hero";
import { pageHeroes } from "@/lib/page-heroes";

export default function NotFound() {
  const hero = pageHeroes.notFound;

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
      <NotFoundContent />
    </>
  );
}
