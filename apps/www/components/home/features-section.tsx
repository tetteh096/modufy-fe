import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/home/section-label";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { getModuleBySlug } from "@/lib/modules-content";

const homepageModuleSlugs = ["invoices", "inventory", "appointments", "accounts"] as const;

const highlights: Record<(typeof homepageModuleSlugs)[number], readonly string[]> = {
  invoices: ["Branded PDFs your customers trust", "Payments post straight into Accounts"],
  inventory: ["One catalog for products and services", "Stock updates from POS and invoices"],
  appointments: ["Guest booking, no account required", "Deposits and reminders built in"],
  accounts: ["Books that update from every sale", "P&L and cash flow without re-keying"],
};

export function FeaturesSection() {
  const modules = homepageModuleSlugs
    .map((slug) => getModuleBySlug(slug))
    .filter((module): module is NonNullable<typeof module> => Boolean(module));

  return (
    <section id="modules" className="relative overflow-hidden section-padding">
      <div className="texture-noise pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-28 top-32 h-72 w-72 rounded-full bg-brand-leaf-green/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-24 h-64 w-64 rounded-full bg-brand-tangerine/10 blur-[90px]" />

      <div className="container-site relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <SectionLabel>Modules</SectionLabel>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Built in pieces.
            <span className="block text-gradient-leaf mt-1">Runs as one.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            Core is included with every account. Enable only the modules you need: invoicing,
            inventory, appointments, finance, and more.
          </p>
        </FadeIn>

        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {modules.map((module, index) => {
            const reversed = index % 2 === 1;
            const points = highlights[module.slug as (typeof homepageModuleSlugs)[number]] ?? [];

            return (
              <FadeIn key={module.slug} delay={index * 0.04}>
                <article
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                    reversed ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="absolute inset-[12%] rounded-full bg-brand-leaf-green/10 blur-[60px]" />
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eef4ea] via-[#f5f6f3] to-[#fff4e8] p-6 sm:p-10">
                      <Image
                        src={module.image}
                        alt={module.imageAlt}
                        width={640}
                        height={640}
                        className="mx-auto h-auto w-full max-w-[420px] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 90vw, 420px"
                      />
                    </div>
                  </div>

                  <div className={reversed ? "lg:pr-4" : "lg:pl-4"}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {module.name}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                      {module.tagline}
                    </p>

                    <ul className="mt-8 space-y-3 border-t border-border/80 pt-8">
                      {points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-relaxed text-brand-sea-grey"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-leaf-green" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/modules/${module.slug}`}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-leaf-green transition-all duration-300 hover:gap-3 hover:text-brand-tangerine"
                    >
                      Explore {module.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.1} className="mt-16 flex flex-col items-center gap-4 text-center sm:mt-20">
          <p className="text-sm text-muted-foreground">
            Also available: POS, storefront, marketing, blog, and AI.
          </p>
          <Button href="/modules" variant="outline" size="lg">
            See all modules
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
