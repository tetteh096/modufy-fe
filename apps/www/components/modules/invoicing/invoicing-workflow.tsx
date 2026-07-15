"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";

const STAGES = ["Draft", "Sent", "Viewed", "Partially paid", "Paid"] as const;

export function InvoicingWorkflow() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 45%"],
  });
  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const progressWidth = useTransform(progressPercent, (value) => `${value}%`);

  return (
    <section className="section-padding bg-[#fdfbf8]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            What Invoicing does
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Turn every sale into a document your customer can trust.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>Pull products from Inventory or enter line items manually — same professional PDF.</p>
            <p>
              When a payment lands, Accounts updates automatically. No re-keying between billing and
              books.
            </p>
            <p>One invoice record follows the customer from quote to paid, with history you can trust.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-7">
          <div
            ref={ref}
            className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm sm:p-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Invoice lifecycle
            </p>

            <div className="mt-8 hidden md:block">
              <div className="relative mb-8 h-1.5 overflow-hidden rounded-full bg-[#efece6]">
                {reduceMotion ? (
                  <div className="h-full w-full rounded-full bg-brand-leaf-green" />
                ) : (
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-leaf-green to-[#6f9a58]"
                    style={{ width: progressWidth }}
                  />
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {STAGES.map((stage, index) => (
                  <StageCard
                    key={stage}
                    stage={stage}
                    index={index}
                    progress={scrollYProgress}
                    reduceMotion={!!reduceMotion}
                  />
                ))}
              </div>
            </div>

            <ol className="relative space-y-4 md:hidden">
              <div className="absolute bottom-3 left-[15px] top-3 w-px bg-[#efece6]" />
              {STAGES.map((stage, index) => (
                <li key={stage} className="relative flex items-center gap-4 pl-1">
                  <span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-brand-leaf-green/30 bg-brand-leaf-green/10 text-xs font-bold text-brand-leaf-green">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#1a2744]">{stage}</span>
                </li>
              ))}
            </ol>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function StageCard({
  stage,
  index,
  progress,
  reduceMotion,
}: {
  stage: string;
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const threshold = index / (STAGES.length - 1);
  const opacity = useTransform(progress, [threshold - 0.08, threshold + 0.05], [0.45, 1]);
  const scale = useTransform(progress, [threshold - 0.08, threshold + 0.05], [0.96, 1]);

  return (
    <motion.div
      style={reduceMotion ? undefined : { opacity, scale }}
      className="rounded-2xl border border-border bg-[#faf8f5] px-2 py-4 text-center"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-leaf-green">
        0{index + 1}
      </p>
      <p className="mt-1 text-xs font-semibold leading-snug text-[#1a2744]">{stage}</p>
    </motion.div>
  );
}
