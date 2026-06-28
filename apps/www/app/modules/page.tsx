import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import {
  modufyModules,
  moduleCategoryMeta,
  moduleCategoryOrder,
} from "@/lib/modules-content";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Modules",
  description: `Explore Modufy modules — invoicing, inventory, POS, appointments, storefront, marketing, accounts, AI, and more. Built on ${siteConfig.name} Core.`,
  keywords: [
    "business modules",
    "invoicing software",
    "inventory management",
    "POS",
    "appointment booking",
    "small business platform",
  ],
  alternates: { canonical: `${siteConfig.url}/modules` },
  openGraph: {
    title: `Modules | ${siteConfig.name}`,
    description: `Explore Modufy modules — invoicing, inventory, POS, appointments, and more. Built on ${siteConfig.name} Core.`,
    url: `${siteConfig.url}/modules`,
    type: "website",
  },
};

export default function ModulesPage() {
  const hero = pageHeroes.modules;

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

      {moduleCategoryOrder.map((categoryId) => {
        const meta = moduleCategoryMeta[categoryId];
        const modules = modufyModules.filter((module) => module.category === categoryId);
        const Icon = meta.icon;

        return (
          <section
            key={categoryId}
            className="section-padding border-b border-border last:border-0"
          >
            <div className="container-site">
              <FadeIn className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-brand-leaf-green">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">{meta.label}</h2>
                    <p className="mt-1 max-w-xl text-muted-foreground">{meta.description}</p>
                  </div>
                </div>
              </FadeIn>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module, index) => {
                  const ModuleIcon = module.icon;
                  return (
                    <FadeIn key={module.slug} delay={index * 0.04}>
                      <Link
                        href={`/modules/${module.slug}`}
                        className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-6 transition hover:border-brand-leaf-green/35 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-brand-leaf-green">
                            <ModuleIcon className="h-5 w-5" />
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {module.tier === "core" ? "Included" : "Paid"}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-bold group-hover:text-brand-leaf-green">
                          {module.name}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {module.tagline}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-leaf-green">
                          Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
