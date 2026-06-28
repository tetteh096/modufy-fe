import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import {
  ServiceDetailBody,
  ServiceDetailHero,
  ServiceDetailIntegrations,
  ServiceReviewsSection,
} from "@/components/services/service-detail-sections";
import { getServiceBySlug, services } from "@/lib/services-content";
import { pageHeroes } from "@/lib/page-heroes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.description}
        image={pageHeroes.modules.image}
        imageAlt={service.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Modules", href: "/modules" },
          { label: service.title },
        ]}
      />
      <ServiceDetailHero service={service} />
      <ServiceDetailBody service={service} />
      <ServiceReviewsSection />
      <ServiceDetailIntegrations />
    </>
  );
}
