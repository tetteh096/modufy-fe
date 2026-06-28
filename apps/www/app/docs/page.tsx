import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, HelpCircle, Link2, Rocket } from "lucide-react";
import { ContactCtaBand } from "@/components/marketing/contact-cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/ui/fade-in";
import { pageHeroes } from "@/lib/page-heroes";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Documentation",
  description: `Guides and references for getting started with ${siteConfig.name}.`,
};

const docSections = [
  {
    icon: Rocket,
    title: "Quickstart",
    description: "Create your account, invite your team, and enable your first modules in under 15 minutes.",
    href: "/register",
    label: "Create account",
  },
  {
    icon: BookOpen,
    title: "User guides",
    description: "Step-by-step walkthroughs for sales, invoicing, inventory, POS, and marketing.",
    href: "/modules",
    label: "Browse modules",
  },
  {
    icon: Link2,
    title: "Integrations",
    description: "Connect payment providers, ecommerce platforms, and accounting tools.",
    href: "/integrations",
    label: "View integrations",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Answers on billing, permissions, data import, and module add-ons.",
    href: "/faq",
    label: "Read FAQ",
  },
] as const;

const apiTopics = [
  "Authentication with API keys and OAuth",
  "Webhooks for sales, invoices, and inventory events",
  "Rate limits and pagination",
  "Sandbox environment for testing",
] as const;

export default function DocsPage() {
  const hero = pageHeroes.docs;

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

      <section className="section-padding">
        <div className="container-site">
          <div className="grid gap-5 sm:grid-cols-2">
            {docSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <FadeIn key={section.title} delay={index * 0.05}>
                  <article className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-6 shadow-sm transition hover:border-brand-leaf-green/30 hover:shadow-md">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-brand-leaf-green">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-xl font-bold">{section.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                    <Link
                      href={section.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-leaf-green hover:text-brand-tangerine"
                    >
                      {section.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section id="api" className="section-padding border-t border-border bg-[#faf8f5]">
        <div className="container-site">
          <FadeIn className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-sea-grey text-white">
                <Code className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">API reference</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Build custom integrations with our REST API. Available on Professional and Ultimate
                plans — full reference docs ship with your developer portal after signup.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-leaf-green hover:text-brand-tangerine"
              >
                Request API access <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <FadeIn delay={0.08} className="lg:col-span-7">
              <ul className="space-y-3 rounded-[1.5rem] border border-border bg-card p-6">
                {apiTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-tangerine" />
                    {topic}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </FadeIn>
        </div>
      </section>

      <ContactCtaBand />
    </>
  );
}
