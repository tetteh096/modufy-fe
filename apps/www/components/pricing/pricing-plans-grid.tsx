"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  includesLabel: string;
  monthly: number;
  yearly: number;
  features: readonly string[];
  highlighted: boolean;
};

type PricingPlansGridProps = {
  plans: readonly PricingPlan[];
  showTitle?: boolean;
  title?: string;
  ctaLabel?: string;
  className?: string;
};

export function PricingPlansGrid({
  plans,
  showTitle = true,
  title = "Rational planning for rapid growth",
  ctaLabel = "Try it for free",
  className,
}: PricingPlansGridProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className={cn("section-padding relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-tangerine/35 to-transparent" />
      <div className="container-site relative z-10">
        {showTitle ? (
          <FadeIn className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-brand-sea-grey">
              {title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-leaf">{title.split(" ").slice(-2).join(" ")}</span>
            </h2>
          </FadeIn>
        ) : null}

        <FadeIn className={cn("flex items-center justify-center gap-4", showTitle ? "mt-10" : "mt-0")}>
          <span className={cn("text-sm font-semibold transition-colors duration-200", !annual ? "text-brand-sea-grey" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual((v) => !v)}
            className={cn(
              "relative h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-tangerine/30",
              annual ? "bg-brand-tangerine" : "bg-border"
            )}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md cursor-pointer"
              style={{ x: annual ? 24 : 0 }}
            />
          </button>
          <span className={cn("text-sm font-semibold transition-colors duration-200", annual ? "text-brand-sea-grey" : "text-muted-foreground")}>
            Annually
          </span>
        </FadeIn>

        <div
          className={cn(
            "mt-12 grid gap-6",
            plans.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3"
          )}
        >
          {plans.map((plan, index) => {
            const price = annual ? plan.yearly : plan.monthly;
            return (
              <FadeIn key={plan.id} delay={index * 0.06}>
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-brand-leaf-green/20 hover:-translate-y-1.5",
                    plan.highlighted
                      ? "border-brand-tangerine shadow-xl shadow-brand-tangerine/12 ring-1 ring-brand-tangerine/15 hover:border-brand-tangerine"
                      : "border-border"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-1",
                      plan.highlighted ? "bg-brand-tangerine" : "bg-brand-leaf-green/25"
                    )}
                  />
                  {plan.highlighted && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-brand-tangerine to-[#ffaa44] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-brand-tangerine/20 z-10">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-brand-sea-grey">{plan.name}</h3>
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-brand-sea-grey/60">$</span>
                      <span className="text-5xl font-black text-brand-sea-grey tracking-tight">{price}</span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                        /{annual ? "Yearly" : "Monthly"}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mt-6 flex-1">
                    <p className="text-sm font-semibold text-brand-sea-grey">{plan.includesLabel}</p>
                    <ul className="mt-3.5 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-brand-sea-grey/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-leaf-green" strokeWidth={3} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    href={appPath("/register")}
                    external
                    variant={plan.highlighted ? "primary" : "outline"}
                    className={cn(
                      "mt-8 w-full transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
                      plan.highlighted ? "shadow-glow-tangerine" : ""
                    )}
                  >
                    {ctaLabel}
                  </Button>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

