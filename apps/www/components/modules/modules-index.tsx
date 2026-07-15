"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { getModuleBadge, moduleBadges } from "@/lib/module-badges";
import {
  modufyModules,
  moduleCategoryMeta,
  moduleCategoryOrder,
  type ModufyModule,
} from "@/lib/modules-content";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const TRUST = ["Core included free", "Enable only what you need", "One shared customer book"] as const;

const FLOATING = [
  { src: moduleBadges.invoices, className: "left-[2%] top-[8%] w-[28%] -rotate-8", delay: 0 },
  { src: moduleBadges.inventory, className: "right-[4%] top-[4%] w-[26%] rotate-6", delay: 0.1 },
  { src: moduleBadges.pos, className: "right-[0%] bottom-[18%] w-[30%] rotate-3", delay: 0.2 },
  { src: moduleBadges.marketing, className: "left-[6%] bottom-[10%] w-[27%] -rotate-4", delay: 0.28 },
] as const;

export function ModulesIndex() {
  const reduceMotion = useReducedMotion();
  const core = modufyModules.find((module) => module.slug === "core");

  return (
    <>
      <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f7f4ef] pb-14 pt-28 sm:-mt-[6.25rem] sm:pb-20 sm:pt-32">
        <div className="texture-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <motion.div
          className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brand-leaf-green/15 blur-[90px]"
          animate={reduceMotion ? undefined : { x: [0, 20, 0], y: [0, 14, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-tangerine/12 blur-[100px]"
          animate={reduceMotion ? undefined : { x: [0, -18, 0], y: [0, -16, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />

        <div className="container-site relative">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-brand-leaf-green">
                  Home
                </Link>
              </li>
              <li className="text-border">/</li>
              <li className="font-medium text-[#1a2744]">Modules</li>
            </ol>
          </nav>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <FadeIn className="lg:col-span-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
                Modules
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1a2744] sm:text-5xl lg:text-[3.5rem]">
                Pick what you need.
                <span className="mt-1 block text-gradient-leaf">Add more as you grow.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Core is included with every account. Enable invoicing, inventory, POS, appointments,
                and more when you are ready — without rebuilding your stack.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={appPath("/register")} size="lg" external variant="secondary">
                  Start free trial
                </Button>
                <Button href="/pricing" variant="outline" size="lg">
                  View pricing
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {TRUST.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2744]/75"
                  >
                    <CheckCircle2 className="h-4 w-4 text-brand-leaf-green" />
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="lg:col-span-6">
              <div className="relative mx-auto aspect-square w-full max-w-[520px]">
                <div className="absolute inset-[18%] rounded-full bg-brand-leaf-green/20 blur-[70px]" />
                {FLOATING.map((item) => (
                  <motion.div
                    key={item.src}
                    className={cn("absolute drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]", item.className)}
                    initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.92 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: reduceMotion ? 0 : [0, -8, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.55, delay: item.delay },
                      scale: { duration: 0.55, delay: item.delay },
                      y: {
                        duration: 5.2 + item.delay * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay,
                      },
                    }}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      width={280}
                      height={280}
                      className="h-auto w-full"
                      priority
                    />
                  </motion.div>
                ))}
                <motion.div
                  className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_28px_50px_rgba(0,0,0,0.22)]"
                  animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={moduleBadges.core}
                    alt="Modufy Core module"
                    width={420}
                    height={420}
                    className="h-auto w-full"
                    priority
                  />
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {core && (
        <section className="section-padding bg-[#122038] text-white">
          <div className="container-site">
            <FadeIn>
              <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <span className="inline-flex rounded-full bg-brand-leaf-green/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ed089]">
                    Included
                  </span>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {core.name}
                  </h2>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
                    {core.tagline}. Every paid module plugs into this foundation — customers, sales,
                    expenses, team access, and alerts stay in one place.
                  </p>
                  <Link
                    href="/modules/core"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-leaf-green px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Explore Core <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="relative mx-auto w-full max-w-[300px] lg:col-span-5">
                  <Image
                    src={getModuleBadge(core.slug)}
                    alt={core.imageAlt}
                    width={480}
                    height={480}
                    className="h-auto w-full drop-shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {moduleCategoryOrder.map((categoryId) => {
        const meta = moduleCategoryMeta[categoryId];
        const modules = modufyModules.filter(
          (module) => module.category === categoryId && module.slug !== "core"
        );
        if (modules.length === 0) return null;
        const Icon = meta.icon;

        return (
          <section
            key={categoryId}
            className="section-padding border-b border-border last:border-0"
          >
            <div className="container-site">
              <FadeIn className="mb-10 flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-brand-leaf-green">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#1a2744] sm:text-3xl">
                    {meta.label}
                  </h2>
                  <p className="mt-1 max-w-xl text-muted-foreground">{meta.description}</p>
                </div>
              </FadeIn>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {modules.map((module, index) => (
                  <ModuleBadgeCard key={module.slug} module={module} index={index} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="pb-20 pt-4">
        <div className="container-site">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-14 text-center text-white shadow-2xl sm:px-12">
              <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
              <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-brand-leaf-green/25 blur-[70px]" />
              <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-brand-tangerine/18 blur-[80px]" />
              <div className="relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Ready to build your stack?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                  Start free on Core, then enable only the modules your business needs as you grow.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href={appPath("/register")} size="lg" external variant="secondary">
                    Get started free
                  </Button>
                  <Button
                    href="/demo"
                    size="lg"
                    variant="outline"
                    className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    Book a demo
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

function ModuleBadgeCard({ module, index }: { module: ModufyModule; index: number }) {
  const badge = getModuleBadge(module.slug);

  return (
    <FadeIn delay={index * 0.04}>
      <Link
        href={`/modules/${module.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-leaf-green/30 hover:shadow-[0_20px_40px_rgba(70,116,52,0.1)]"
      >
        <div className="relative flex aspect-[4/3] items-center justify-center bg-[#141414]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(70,116,52,0.28),transparent)]" />
          <Image
            src={badge}
            alt={module.imageAlt}
            width={320}
            height={320}
            className="relative z-10 h-auto w-[70%] max-w-[220px] transition duration-500 group-hover:scale-[1.05]"
            sizes="220px"
          />
          <span className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {module.tier === "core" ? "Included" : "Paid"}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-bold text-[#1a2744] transition group-hover:text-brand-leaf-green">
            {module.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {module.tagline}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-leaf-green">
            Learn more
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}
