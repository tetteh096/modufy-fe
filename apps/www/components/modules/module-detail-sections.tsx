import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { getModuleBySlug, type ModufyModule } from "@/lib/modules-content";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type ModuleDetailProps = {
  module: ModufyModule;
};

export function ModulePageHero({ module }: ModuleDetailProps) {
  const Icon = module.icon;

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-brand-sea-grey pb-14 pt-32 sm:-mt-[6.25rem] sm:pb-16 sm:pt-36">
      <Image src={module.image} alt="" fill className="object-cover opacity-35" sizes="100vw" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-sea-grey/75 via-brand-sea-grey/88 to-brand-sea-grey" />

      <div className="container-site relative">
        <FadeIn>
          <nav aria-label="Breadcrumb" className="text-sm text-white/50">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/modules" className="hover:text-white">
                  Modules
                </Link>
              </li>
              <li>/</li>
              <li className="text-white/90">{module.name}</li>
            </ol>
          </nav>

          <div className="mt-8 flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-tangerine/20 text-brand-tangerine backdrop-blur-sm">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                  module.tier === "core"
                    ? "bg-brand-leaf-green/30 text-brand-leaf-green"
                    : "bg-white/15 text-white/80"
                )}
              >
                {module.tier === "core" ? "Included" : "Paid module"}
              </span>
              <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                {module.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65">
                {module.heroDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={appPath("/register")} size="lg" external>
              Start free trial
            </Button>
            <Button
              href="/demo"
              variant="outline"
              size="lg"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              Book a demo
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
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

      <section className="section-padding border-t border-border bg-[#faf8f5]">
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
