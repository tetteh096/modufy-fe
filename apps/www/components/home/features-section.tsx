import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SectionLabel } from "@/components/home/section-label";
import { FadeIn } from "@/components/ui/fade-in";
import { getModuleBySlug } from "@/lib/modules-content";

const homepageModuleSlugs = ["invoices", "inventory", "appointments", "accounts"] as const;

const featureVisuals = [
  { span: "lg:col-span-7 lg:row-span-2", minH: "min-h-[320px] lg:min-h-[440px]" },
  { span: "lg:col-span-5", minH: "min-h-[240px] lg:min-h-[260px]" },
  { span: "lg:col-span-5", minH: "min-h-[240px] lg:min-h-[260px]" },
  { span: "lg:col-span-7", minH: "min-h-[260px] lg:min-h-[280px]" },
] as const;

export function FeaturesSection() {
  const modules = homepageModuleSlugs
    .map((slug) => getModuleBySlug(slug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));

  return (
    <section id="modules" className="relative overflow-hidden section-padding">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-site relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-7">
            <SectionLabel>Modules</SectionLabel>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Built in pieces.
              <span className="block text-gradient-leaf mt-1">Runs as one.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.08} className="lg:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground lg:text-right">
              Core is included with every account. Add invoicing, inventory, POS, appointments, and
              more — only pay for the modules you enable.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {modules.map((module, index) => {
            const visual = featureVisuals[index];
            return (
              <FadeIn
                key={module.slug}
                delay={index * 0.06}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-all duration-500 hover:border-brand-tangerine/30 hover:shadow-xl hover:shadow-brand-tangerine/5 ${visual.span} ${visual.minH}`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={module.image}
                    alt={module.imageAlt}
                    fill
                    className="object-cover transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:brightness-95"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/95 via-brand-sea-grey/52 to-brand-sea-grey/10 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/12 to-transparent" />
                </div>

                <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                  <module.icon className="h-4 w-4 text-brand-tangerine" />
                  {module.category}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
                        {module.tier === "core" ? "Core" : "Module"}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">{module.name}</h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75">
                        {module.tagline}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {module.connectsWith.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/75"
                          >
                            <CheckCircle2 className="h-3 w-3 text-brand-tangerine" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/modules/${module.slug}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:border-brand-tangerine hover:bg-brand-tangerine hover:scale-105 active:scale-95"
                      aria-label={`Learn about ${module.name}`}
                    >
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

