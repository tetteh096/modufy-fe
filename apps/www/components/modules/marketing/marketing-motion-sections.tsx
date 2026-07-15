"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Mail,
  MessageSquare,
  Pause,
  Play,
  Users,
  Wallet,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

const OFFER_CARDS = [
  {
    kind: "sms" as const,
    title: "Weekend restock",
    meta: "SMS · 1,241 queued",
    body: "Hi {{first_name}}, favourites are back. Show this at checkout.",
  },
  {
    kind: "segment" as const,
    title: "Bought · last 90 days",
    meta: "Live segment",
    body: "1,284 contacts · evaluated at send time",
  },
  {
    kind: "email" as const,
    title: "Welcome back",
    meta: "Email · merge tags on",
    body: "We're glad you're here. Enjoy 15% off with WELCOME15.",
  },
  {
    kind: "wallet" as const,
    title: "SMS wallet",
    meta: "Credits checked",
    body: "2,410 remaining · deducts on send",
  },
  {
    kind: "sms" as const,
    title: "Win-back nudge",
    meta: "SMS · quiet hours respected",
    body: "Miss you, here's an early look at this week's drop.",
  },
  {
    kind: "segment" as const,
    title: "High-value customers",
    meta: "Live segment",
    body: "486 contacts · spent over $200",
  },
] as const;

const BACKDROP_IMAGES = [
  { src: homeImages.features.marketing, alt: "Campaign creative" },
  { src: homeImages.features.mobile, alt: "Mobile messaging" },
  { src: homeImages.pages.testimonials, alt: "Customers engaging" },
  { src: homeImages.features.orders, alt: "Retail offers" },
] as const;

export function MarketingReachSection() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const shouldMove = !reduceMotion && !paused;

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Find customers
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Get your message in front of the right people
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative">
              <div className="relative h-[440px] overflow-hidden rounded-[1.75rem] bg-[#ebe7e0] sm:h-[500px]">
                <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
                  <OfferMarquee
                    cards={OFFER_CARDS.filter((_, i) => i % 2 === 0)}
                    duration={24}
                    moving={shouldMove}
                  />
                  <OfferMarquee
                    cards={OFFER_CARDS.filter((_, i) => i % 2 === 1)}
                    duration={28}
                    reverse
                    moving={shouldMove}
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#f6f6f4] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#f6f6f4] to-transparent" />
              </div>

              {!reduceMotion && (
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  className="absolute bottom-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2744] text-white shadow-lg transition hover:bg-brand-leaf-green"
                  aria-label={paused ? "Play motion" : "Pause motion"}
                >
                  {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="space-y-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a2744]/50">
                  SMS
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">Send when it matters</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Short messages to past buyers. Preview the audience and check wallet credits
                  before anything leaves.
                </p>
              </div>

              <div className="border-t border-border pt-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a2744]/50">
                  Email
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#1a2744]">Tell the fuller story</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Longer offers with merge tags and automatic unsubscribe, from the same customer
                  book you already run.
                </p>
              </div>

              <Button
                href={appPath("/register")}
                external
                variant="outline"
                className="rounded-full"
              >
                Start free trial
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function MarketingPhoneSection() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const shouldMove = !reduceMotion && !paused;
  const loop = [...BACKDROP_IMAGES, ...BACKDROP_IMAGES];

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            On their phone
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Meet them on the screen they check first
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            SMS for urgency. Email for depth. Both pull from live segments, so every send feels
            personal, not copy-pasted.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-[#1a2744]">
            {[
              "Opt-outs filtered before send",
              "Merge tags like {{first_name}}",
              "Delivery rollups after every campaign",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-leaf-green" />
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative mx-auto flex h-[460px] w-full max-w-md items-center justify-center sm:h-[520px]">
            <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#f0ece5]">
              <motion.div
                className="flex w-max gap-3 p-4"
                animate={shouldMove ? { x: ["0%", "-50%"] } : undefined}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              >
                {loop.map((item, index) => (
                  <div
                    key={`a-${item.src}-${index}`}
                    className="relative h-40 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-48 sm:w-32"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                ))}
              </motion.div>
              <motion.div
                className="absolute inset-x-0 bottom-4 flex w-max gap-3 px-4"
                animate={shouldMove ? { x: ["-50%", "0%"] } : undefined}
                transition={{ duration: 34, ease: "linear", repeat: Infinity }}
              >
                {loop.map((item, index) => (
                  <div
                    key={`b-${item.src}-${index}`}
                    className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl opacity-85 sm:h-32 sm:w-40"
                  >
                    <Image src={item.src} alt="" fill className="object-cover" sizes="160px" aria-hidden />
                  </div>
                ))}
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-white/25" />
            </div>

            <div className="relative z-10 w-[200px] sm:w-[230px]">
              <div className="overflow-hidden rounded-[2rem] border-[6px] border-[#121212] bg-[#121212] shadow-2xl shadow-black/35">
                <div className="bg-white px-3.5 pb-5 pt-3">
                  <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#e5e0d6]" />
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-leaf-green text-[10px] font-bold text-white">
                      M
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1a2744]">Modufy Trading</p>
                      <p className="text-[10px] text-muted-foreground">Just now · SMS</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-[#f7f5f1] p-3.5">
                    <p className="text-[12px] leading-relaxed text-[#1a2744]">
                      Hi Alex, your favourites are back this weekend. Show this at checkout. Reply
                      STOP to opt out.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
                    <span className="text-[10px] font-semibold text-muted-foreground">Credits</span>
                    <span className="text-xs font-bold text-brand-leaf-green">−1</span>
                  </div>
                </div>
              </div>
            </div>

            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="absolute bottom-3 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#1a2744] text-white shadow-lg transition hover:bg-brand-leaf-green"
                aria-label={paused ? "Play motion" : "Pause motion"}
              >
                {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function MarketingAutomationSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_50%,rgba(70,116,52,0.2),transparent)]" />
      <div className="container-site relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
            Automate
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.5rem]">
            Campaign tools built into Modufy
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Segment who to reach, send branded SMS or email, then refine the next campaign with
            delivery rollups, no exported customer list required.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            {["Templates", "Segments", "Opt-outs", "Wallet"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <Button
            href={appPath("/register")}
            external
            size="lg"
            variant="outline"
            className="mt-8 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Explore campaigns
          </Button>
        </FadeIn>

        <FadeIn delay={0.08}>
          <motion.div
            className="mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] bg-white text-[#1a2744] shadow-2xl"
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="border-b border-border px-5 py-4 text-sm">
              <Field label="To" value="Customers · bought in last 90 days" />
              <Field label="Subject" value="We're glad you're here: enjoy 15% off" />
              <Field label="Preview" value="Your early code for this week's restock" />
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src={homeImages.features.marketing}
                alt="Branded campaign creative"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-2xl font-bold">Welcome back</p>
                <p className="mt-1 text-xs text-white/80">Use code WELCOME15 · Shop now →</p>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

/** Clear post-send report: replaces the old “Results” sparkline cards. */
export function MarketingAfterSendSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            After you send
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            A simple delivery report, not another spreadsheet
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            When a campaign finishes, Modufy shows who got the message, who was skipped, and what
            it cost. Nothing to export. Nothing to guess.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <article>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="border-b border-border bg-[#faf8f5] px-5 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Campaign report
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1a2744]">Weekend restock promo</p>
                </div>
                <div className="space-y-3 p-5">
                  {[
                    { label: "Sent", value: "1,241", tone: "text-brand-leaf-green" },
                    { label: "Skipped (opt-outs)", value: "43", tone: "text-[#1a2744]" },
                    { label: "Failed", value: "0", tone: "text-[#1a2744]" },
                  ].map((row, index) => (
                    <motion.div
                      key={row.label}
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className={`text-lg font-extrabold ${row.tone}`}>{row.value}</span>
                    </motion.div>
                  ))}
                  <div className="flex items-center justify-between rounded-xl bg-[#1a2744] px-4 py-3 text-white">
                    <span className="text-sm text-white/70">SMS credits used</span>
                    <span className="font-bold">1,241</span>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1a2744]">Know who got the message</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sent, skipped, and failed, clear numbers after every SMS or email campaign.
              </p>
            </article>
          </FadeIn>

          <FadeIn delay={0.08}>
            <article>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="relative aspect-[5/4] bg-[#ebe7e0] p-5 sm:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(70,116,52,0.12),transparent)]" />
                  <div className="relative mx-auto flex h-full max-w-sm flex-col justify-center gap-3">
                    <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-md">
                      <div className="flex items-center gap-2 text-brand-leaf-green">
                        <Users className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Opt-outs applied
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#1a2744]">
                        43 contacts excluded before send
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-md">
                      <div className="flex items-center gap-2 text-brand-tangerine">
                        <Wallet className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          SMS wallet
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#1a2744]">
                        2,410 credits remaining
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#1a2744]">Respect first. Then spend.</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Opt-outs are filtered automatically, and wallet credits update so you always know
                what a campaign cost.
              </p>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function OfferMarquee({
  cards,
  duration,
  reverse,
  moving,
}: {
  cards: readonly (typeof OFFER_CARDS)[number][];
  duration: number;
  reverse?: boolean;
  moving: boolean;
}) {
  const loop = [...cards, ...cards];

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3"
        animate={moving ? { y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] } : undefined}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loop.map((card, index) => (
          <OfferCard key={`${card.title}-${index}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

function OfferCard({ card }: { card: (typeof OFFER_CARDS)[number] }) {
  const icon =
    card.kind === "sms" ? (
      <MessageSquare className="h-3.5 w-3.5" />
    ) : card.kind === "email" ? (
      <Mail className="h-3.5 w-3.5" />
    ) : card.kind === "segment" ? (
      <Users className="h-3.5 w-3.5" />
    ) : (
      <Wallet className="h-3.5 w-3.5" />
    );

  return (
    <article className="shrink-0 rounded-2xl border border-border/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-brand-leaf-green">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{card.meta}</span>
      </div>
      <h3 className="mt-2 text-sm font-bold text-[#1a2744]">{card.title}</h3>
      <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{card.body}</p>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-2.5 last:border-b-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}

export function MarketingCloseSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Add Marketing when you are ready.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Begin with Modufy Core, then enable campaigns when your customer list is ready -
              without exporting contacts elsewhere.
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Works with
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/modules/core", label: "Core" },
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/marketplace", label: "Storefront" },
                { href: "/modules/appointments", label: "Appointments" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-[#1a2744] transition hover:border-brand-leaf-green/40 hover:text-brand-leaf-green"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to message with confidence?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm text-white/60">
              Segments, SMS or email, delivery tracking, and opt-outs: in the same place you run
              the business.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
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
        </FadeIn>
      </div>
    </section>
  );
}
