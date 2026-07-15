"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, Mail, MessageSquare, Users, Wallet } from "lucide-react";

export function CampaignMockup() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => {
    if (reduceMotion) {
      setSent(true);
      return;
    }
    const timer = window.setTimeout(() => setSent(true), 2000);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative mx-auto w-full max-w-[520px]"
    >
      <div className="absolute -left-6 top-8 h-40 w-40 rounded-full bg-brand-leaf-green/30 blur-[70px]" />
      <div className="absolute -right-4 bottom-6 h-44 w-44 rounded-full bg-brand-tangerine/20 blur-[80px]" />

      <motion.div
        style={reduceMotion ? undefined : { transform }}
        className="relative"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,28,46,0.22)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Campaign
              </p>
              <p className="mt-0.5 text-sm font-bold text-[#1a2744]">Weekend restock promo</p>
            </div>
            <motion.span
              key={sent ? "sent" : "draft"}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                sent
                  ? "bg-brand-leaf-green/15 text-brand-leaf-green shadow-[0_0_24px_rgba(70,116,52,0.3)]"
                  : "bg-[#f4f1ea] text-[#6f6f6f]"
              }`}
            >
              {sent ? "Sending" : "Draft"}
            </motion.span>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="grid grid-cols-2 gap-3">
              <ChannelChip active icon={MessageSquare} label="SMS" />
              <ChannelChip icon={Mail} label="Email" />
            </div>

            <div className="rounded-2xl border border-border bg-[#f7f5f1] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1a2744]">
                <Users className="h-4 w-4 text-brand-leaf-green" />
                Segment · Bought in last 90 days
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Hi {"{{first_name}}"}, your favourites are back in stock this weekend. Reply STOP to
                opt out.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Audience preview</span>
                <span className="font-bold text-brand-leaf-green">1,284 contacts</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Queued", sent ? "1,241" : "—"],
                ["Skipped", sent ? "43" : "—"],
                ["Failed", sent ? "0" : "—"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-white px-2 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a2744]">{value}</p>
                </div>
              ))}
            </div>

            {sent && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 rounded-xl border border-brand-leaf-green/20 bg-brand-leaf-green/5 px-3 py-2.5 text-xs text-brand-leaf-green"
              >
                <Check className="h-4 w-4 shrink-0" />
                Opt-outs respected · suppression list applied
              </motion.div>
            )}
          </div>
        </div>

        <motion.div
          className="absolute -left-2 bottom-20 hidden w-[180px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tangerine/15 text-brand-tangerine">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                SMS wallet
              </p>
              <p className="text-xs font-semibold text-[#1a2744]">2,410 credits</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -right-1 top-24 hidden w-[170px] rounded-2xl border border-white/80 bg-[#1a2744] p-3 text-white shadow-xl sm:block"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Delivery</p>
          <p className="mt-1 text-xs font-semibold">{sent ? "Batch in progress" : "Ready to send"}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-brand-leaf-green"
              animate={{ width: sent ? "72%" : "8%" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ChannelChip({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Mail;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold ${
        active
          ? "border-brand-leaf-green/30 bg-brand-leaf-green/10 text-brand-leaf-green"
          : "border-border bg-white text-muted-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
