"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { FadeIn } from "@/components/ui/fade-in";

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Number.isInteger(value) ? Math.round(latest).toString() : latest.toFixed(1));
    });
    return unsubscribe;
  }, [spring, value]);

  return (
    <div ref={ref}>
      <p className="text-4xl font-bold text-brand-tangerine sm:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function CustomerServiceSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn className="relative">
            <DashboardPreview variant="compact" />
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-leaf-green">
              Customer service
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Enables improved customer service</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              CRM software enables better customer service by tracking all customer inquiries,
              issues, and support requests. Support teams can respond more effectively and promptly,
              leading to higher customer satisfaction.
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <AnimatedStat value={99} suffix="%" label="Customer satisfaction" />
              <AnimatedStat value={3.5} suffix="X" label="Close deals faster" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function LeadsPlatformSection() {
  return (
    <section className="section-padding bg-secondary/60">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn className="order-2 lg:order-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-leaf-green">
              Lead management
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A single platform to manage leads</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Our software is designed to meet your specific needs. Offers sales automation, marketing
              tools, and comprehensive analytics.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Team management",
                  description:
                    "Chat or video calls for quick communication with your sales team. Organize daily planning meetings.",
                },
                {
                  title: "Online marketing",
                  description:
                    "Run marketing campaigns within our tools such as email marketing, ad targeting and more.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.45 }}
                  className="flex gap-4"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-leaf-green text-white">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="order-1 lg:order-2">
            <DashboardPreview variant="compact" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
