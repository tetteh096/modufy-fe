"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";

const CHANNELS = ["SMS", "Email"] as const;
type Channel = (typeof CHANNELS)[number];

const CHANNEL_META: Record<
  Channel,
  {
    audience: number;
    body: string;
    detail: string;
    credits: string;
  }
> = {
  SMS: {
    audience: 1284,
    body: "Hi {{first_name}}, your favourites are back this weekend. Show this text at checkout. Reply STOP to opt out.",
    detail: "160 character friendly · SMS wallet deducts on send",
    credits: "1,241 credits estimated",
  },
  Email: {
    audience: 2140,
    body: "Subject: A little something for customers who love us back\n\n{{first_name}}, we saved an early look at this week's restock for you. Browse before stock runs out.",
    detail: "Unsubscribe link added automatically",
    credits: "No wallet debit · email channel",
  },
};

export function MarketingInteractivePreview() {
  const reduceMotion = useReducedMotion();
  const [channel, setChannel] = useState<Channel>("SMS");
  const meta = CHANNEL_META[channel];
  const springAudience = useSpring(meta.audience, { stiffness: 90, damping: 18 });
  const [audienceLabel, setAudienceLabel] = useState(meta.audience.toLocaleString());

  useEffect(() => {
    springAudience.set(meta.audience);
  }, [meta.audience, springAudience]);

  useEffect(() => {
    return springAudience.on("change", (value) => {
      setAudienceLabel(Math.round(value).toLocaleString());
    });
  }, [springAudience]);

  return (
    <section className="relative overflow-hidden bg-[#122038] section-padding text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(70,116,52,0.28),transparent)]" />
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" aria-hidden />

      <div className="container-site relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
            Interactive preview
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            See how a campaign feels before you send.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Switch channels to preview SMS urgency versus a longer email message.
          </p>
        </FadeIn>

        <FadeIn delay={0.08} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            {CHANNELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  channel === item
                    ? "bg-brand-leaf-green text-white shadow-lg shadow-brand-leaf-green/30"
                    : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-[#0e120e] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-bold">Weekend restock promo</p>
                <p className="text-xs text-muted-foreground">Segment · active customers</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={channel}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  className="rounded-full bg-brand-leaf-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-leaf-green"
                >
                  {channel}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Message preview
                </p>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={channel}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#f7f5f1] p-4 font-sans text-sm leading-relaxed text-[#0e120e]"
                  >
                    {meta.body}
                  </motion.pre>
                </AnimatePresence>
              </div>

              <div className="rounded-2xl bg-[#f7f5f1] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Audience preview
                </p>
                <p className="mt-1 text-3xl font-bold text-brand-leaf-green">{audienceLabel}</p>
                <p className="mt-2 text-xs text-muted-foreground">{meta.detail}</p>
                <div className="mt-4 rounded-xl border border-border bg-white p-3 text-sm">
                  <p className="font-semibold text-[#0e120e]">{meta.credits}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Opt-outs and suppressions excluded before send.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
