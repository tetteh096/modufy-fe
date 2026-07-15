"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

export function MarketingConnectionsSection() {
  const connections = [
    { slug: "core", name: "Modufy Core", detail: "Customer book & one-to-one" },
    { slug: "invoices", name: "Invoicing", detail: "Follow up after bills" },
    { slug: "marketplace", name: "Storefront", detail: "Promote live offers" },
    { slug: "appointments", name: "Appointments", detail: "Fill open slots" },
  ] as const;

  return (
    <section className="section-padding">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Connected modules
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Marketing works because the data already lives here.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {connections.map((item) => (
              <Link
                key={item.slug}
                href={`/modules/${item.slug}`}
                className="group rounded-2xl border border-border bg-white p-4 transition hover:border-brand-leaf-green/30 hover:shadow-md"
              >
                <p className="font-semibold text-[#1a2744] group-hover:text-brand-leaf-green">
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
            <Image
              src={homeImages.story.salesTeam}
              alt="Team running Modufy marketing campaigns"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function MarketingComparisonSection() {
  const before = [
    "Copying numbers into another SMS tool",
    "Stale CSV lists",
    "Guessing who received the message",
  ] as const;
  const after = [
    "Campaigns from your live customer book",
    "Segments evaluated at send time",
    "Sent, failed, and skipped rollups",
  ] as const;

  return (
    <section className="section-padding bg-[#fdfbf8]">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Less tool-switching. Clearer campaigns.
          </h2>
        </FadeIn>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          <FadeIn>
            <div className="h-full rounded-[1.5rem] border border-border bg-white p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Without Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {before.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="h-full rounded-[1.5rem] border border-brand-leaf-green/25 bg-brand-leaf-green/[0.04] p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-leaf-green">
                With Modufy
              </p>
              <ul className="mt-5 space-y-3">
                {after.map((item) => (
                  <li key={item} className="text-sm font-medium text-[#1a2744]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function MarketingPricingSection() {
  return (
    <section className="section-padding">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Start free. Add Marketing when you are ready.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Begin with Modufy Core, then enable Marketing Campaigns when your customer list is ready
            — without exporting contacts to another tool.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={appPath("/register")} size="lg" external variant="secondary">
              Start free trial
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              View pricing
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="rounded-[1.75rem] border border-border bg-[#faf8f5] p-6 sm:p-8">
            <p className="text-sm font-bold text-[#1a2744]">Marketing Campaigns</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Enable anytime — segments, templates, SMS + email, wallet tracking.
            </p>
            <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-semibold text-brand-leaf-green">
              Marketing active — build a segment and send.
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function MarketingFinalCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="pb-20 pt-4">
      <div className="container-site">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-14 text-center text-white shadow-2xl sm:px-12">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <motion.div
              className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-brand-leaf-green/25 blur-[70px]"
              animate={reduceMotion ? undefined : { y: [0, 16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to message customers with confidence?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
                Segments, SMS or email, delivery tracking, and opt-outs — from the same place you
                already run the business.
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
              <Link
                href="/modules"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-tangerine transition hover:gap-2.5"
              >
                Explore more modules <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
