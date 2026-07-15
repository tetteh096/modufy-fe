import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ModuleFullBleedHero } from "@/components/modules/module-fullbleed-hero";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { moduleHeroImages, type ModuleHeroKey } from "@/lib/module-heroes";
import { getModuleBySlug, type ModufyModule } from "@/lib/modules-content";
import { appPath } from "@/lib/site-config";

type ModuleDetailProps = {
  module: ModufyModule;
};

function splitHeroTitle(title: string): { title: string; titleAccent?: string } {
  const period = title.indexOf(". ");
  if (period > 0 && period < title.length - 2) {
    return {
      title: title.slice(0, period + 1),
      titleAccent: title.slice(period + 2),
    };
  }
  return { title };
}

export function ModulePageHero({ module }: ModuleDetailProps) {
  const heroImage =
    moduleHeroImages[module.slug as ModuleHeroKey] ?? moduleHeroImages.ai;
  const { title, titleAccent } = splitHeroTitle(module.heroTitle);

  return (
    <ModuleFullBleedHero
      breadcrumb={module.name}
      eyebrow={module.tier === "core" ? "Included with every account" : "Paid module"}
      title={title}
      titleAccent={titleAccent}
      description={module.heroDescription}
      image={heroImage}
      imageAlt={module.imageAlt}
    />
  );
}

export function ModulePageBody({ module }: ModuleDetailProps) {
  const related = module.connectsWith
    .map((slug) => getModuleBySlug(slug))
    .filter((item): item is ModufyModule => Boolean(item))
    .slice(0, 4);

  return (
    <>
      <section className="section-padding">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Overview
            </p>
            <h2 className="mt-3 text-3xl font-bold">What {module.name} does</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              {module.overview.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-7">
            <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
                Key capabilities
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {module.capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-leaf-green" strokeWidth={2.5} />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-[#f5f6f3]">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Who it&apos;s for
            </p>
            <h2 className="mt-3 text-3xl font-bold">Built for teams like yours</h2>
            <ul className="mt-6 space-y-3">
              {module.whoItsFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-tangerine" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Works with
            </p>
            <h2 className="mt-3 text-3xl font-bold">Connects to your stack</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {related.map((relatedModule) => (
                <Link
                  key={relatedModule.slug}
                  href={`/modules/${relatedModule.slug}`}
                  className="group rounded-xl border border-border bg-card p-4 transition hover:border-brand-leaf-green/40 hover:shadow-sm"
                >
                  <p className="font-semibold text-brand-sea-grey group-hover:text-brand-leaf-green">
                    {relatedModule.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {relatedModule.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding border-t border-border">
        <div className="container-site text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to add {module.name}?</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Start on Core free, then enable {module.name} when your business is ready.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href={appPath("/register")} size="lg" external>
                Get started free
              </Button>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 rounded-full px-6 py-3 text-sm font-semibold text-brand-leaf-green hover:text-brand-tangerine"
              >
                View pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
