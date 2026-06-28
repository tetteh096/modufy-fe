import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModulePageBody, ModulePageHero } from "@/components/modules/module-detail-sections";
import { getModuleBySlug, modufyModules } from "@/lib/modules-content";
import { siteConfig } from "@/lib/site-config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return modufyModules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) return { title: "Module" };

  const canonical = `${siteConfig.url}/modules/${module.slug}`;

  return {
    title: module.seo.title,
    description: module.seo.description,
    keywords: module.seo.keywords,
    alternates: { canonical },
    openGraph: {
      title: `${module.seo.title} | ${siteConfig.name}`,
      description: module.seo.description,
      url: canonical,
      type: "website",
    },
  };
}

function moduleJsonLd(module: NonNullable<ReturnType<typeof getModuleBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: module.name,
    applicationCategory: "BusinessApplication",
    description: module.seo.description,
    url: `${siteConfig.url}/modules/${module.slug}`,
    offers: {
      "@type": "Offer",
      price: module.tier === "core" ? "0" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    isPartOf: {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(moduleJsonLd(module)) }}
      />
      <ModulePageHero module={module} />
      <ModulePageBody module={module} />
    </>
  );
}
