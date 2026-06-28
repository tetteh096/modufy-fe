"use client";

import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import { FaqAccordion } from "@/components/about/faq-accordion";
import { PricingConfigBar } from "@/components/pricing/pricing-config-bar";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { homeImages } from "@/lib/home-images";
import {
  computePlanPrice,
  currencySymbols,
  pricingAddons,
  pricingComparisonGroups,
  pricingFaqs,
  pricingPlans,
  type BillingCycle,
  type Currency,
} from "@/lib/pricing-content";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-brand-leaf-green" strokeWidth={2.5} />
    ) : (
      <span className="mx-auto block h-0.5 w-3 rounded-full bg-border" />
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

export function PricingPageView() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [teamSize, setTeamSize] = useState(3);
  const [billing, setBilling] = useState<BillingCycle>("yearly");

  const symbol = currencySymbols[currency];

  return (
    <>
      <section className="relative -mt-[5.75rem] overflow-hidden bg-brand-sea-grey pb-16 pt-32 sm:-mt-[6.25rem] sm:pb-20 sm:pt-36">
        <Image
          src={homeImages.features.analytics}
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-sea-grey/80 via-brand-sea-grey/90 to-brand-sea-grey" />
        <div className="texture-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />

        <div className="container-site relative">
          <FadeIn>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-tangerine">
              14-day free trial · No credit card
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold uppercase leading-[0.95] text-brand-tangerine sm:text-5xl lg:text-6xl">
              Pay less.
              <br />
              Grow more.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
              Pricing that scales with your team. Pick a plan, add modules when you need them, and
              switch billing anytime.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-10 max-w-4xl">
            <PricingConfigBar
              currency={currency}
              onCurrencyChange={setCurrency}
              teamSize={teamSize}
              onTeamSizeChange={setTeamSize}
              billing={billing}
              onBillingChange={setBilling}
              variant="dark"
            />
          </FadeIn>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-16 md:pb-24">
        <div className="container-site">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan, index) => {
              const price = computePlanPrice(plan, { teamSize, billing, currency });
              const monthlyEquivalent =
                billing === "yearly" ? computePlanPrice(plan, { teamSize, billing: "monthly", currency }) : null;

              return (
                <FadeIn key={plan.id} delay={index * 0.05}>
                  <article
                    className={cn(
                      "relative flex h-full flex-col rounded-[1.75rem] border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg",
                      plan.highlighted
                        ? "border-brand-tangerine shadow-xl shadow-brand-tangerine/15 ring-2 ring-brand-tangerine/20"
                        : "border-border"
                    )}
                  >
                    {plan.badge ? (
                      <span className="absolute -top-3 left-6 rounded-full bg-brand-tangerine px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                        {plan.badge}
                      </span>
                    ) : null}

                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
                        {plan.tagline}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-border pt-6">
                      <div className="flex items-end gap-1">
                        <span className="text-lg font-semibold text-muted-foreground">{symbol}</span>
                        <span className="text-5xl font-bold tracking-tight">{price}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        /{billing === "yearly" ? "mo, billed yearly" : "month"}
                      </p>
                      {monthlyEquivalent && monthlyEquivalent > price ? (
                        <p className="mt-1 text-xs text-muted-foreground line-through">
                          {symbol}
                          {monthlyEquivalent}/mo monthly
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-6 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf-green">
                        {plan.includesFrom ? `Everything in ${plan.includesFrom}, plus:` : "Includes:"}
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-leaf-green" strokeWidth={2.5} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      href={appPath("/register")}
                      external
                      variant={plan.highlighted ? "primary" : "outline"}
                      className="mt-8 w-full"
                    >
                      Start free trial
                    </Button>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-[#faf8f5]">
        <div className="container-site">
          <FadeIn className="mb-12 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Compare plans
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">See what&apos;s included</h2>
          </FadeIn>

          <div className="space-y-8">
            {pricingComparisonGroups.map((group) => (
              <FadeIn key={group.title}>
                <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm">
                  <p className="border-b border-border bg-muted/40 px-5 py-3 text-sm font-semibold text-brand-sea-grey">
                    {group.title}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-5 py-3 font-medium text-muted-foreground">Feature</th>
                          {pricingPlans.map((plan) => (
                            <th key={plan.id} className="px-4 py-3 text-center font-semibold">
                              {plan.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row) => (
                          <tr key={row.feature} className="border-b border-border last:border-0">
                            <td className="px-5 py-3.5 font-medium">{row.feature}</td>
                            <td className="px-4 py-3.5 text-center">
                              <ComparisonCell value={row.starter} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <ComparisonCell value={row.growth} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <ComparisonCell value={row.professional} />
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <ComparisonCell value={row.ultimate} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <FadeIn className="mb-10 max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              Add-ons
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Extra tools. One click away.</h2>
            <p className="mt-3 text-muted-foreground">
              Level up your plan with analytics, custom integrations, or guided onboarding.
            </p>
          </FadeIn>

          <div className="grid gap-4 md:grid-cols-3">
            {pricingAddons.map((addon, index) => (
              <FadeIn key={addon.title} delay={index * 0.06}>
                <article className="flex h-full flex-col rounded-[1.5rem] border border-border bg-card p-6 transition hover:border-brand-leaf-green/30 hover:shadow-md">
                  <p className="text-sm font-bold text-brand-tangerine">{addon.price}</p>
                  <h3 className="mt-2 text-lg font-bold">{addon.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {addon.description}
                  </p>
                  <Button href="/contact" variant="ghost" size="sm" className="mt-4 w-fit px-0">
                    Learn more →
                  </Button>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-border bg-secondary/30">
        <div className="container-site">
          <FadeIn className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">All your questions, answered</h2>
          </FadeIn>
          <FaqAccordion items={pricingFaqs} />
        </div>
      </section>
    </>
  );
}
