"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Bell,
  CalendarDays,
  Check,
  CreditCard,
  FileText,
  Smartphone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { AppointmentsMockup } from "@/components/modules/appointments/appointments-mockup";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const FLOW = [
  {
    title: "Guest picks a time",
    copy: "Name and phone only, no account friction for first visits.",
    icon: UserRound,
  },
  {
    title: "Deposit locks the slot",
    copy: "Collect card or mobile money so no-shows drop before they book.",
    icon: CreditCard,
  },
  {
    title: "Reminders go out",
    copy: "SMS and email before the appointment keep the calendar full.",
    icon: Bell,
  },
  {
    title: "Invoice on complete",
    copy: "Mark done and Modufy drafts the invoice from the booked service.",
    icon: FileText,
  },
] as const;

const FLOATING_SLOTS = [
  "Tue · 10:30 · Colour",
  "Wed · 14:00 · Consult",
  "Thu · 11:00 · Facial",
  "Fri · 16:30 · Cut + style",
  "Sat · 09:00 · Bridal trial",
  "Mon · 13:00 · Open",
] as const;

export function AppointmentsHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f3f1ea] pb-14 pt-28 sm:-mt-[6.25rem] sm:pb-20 sm:pt-32">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-10 top-32 h-64 w-64 rounded-full bg-[#e8f0a8]/70 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 18, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-brand-leaf-green/15 blur-3xl"
            animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <div className="container-site relative">
        <nav aria-label="Breadcrumb" className="text-base text-[#1a2744]/45">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-brand-leaf-green">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/modules" className="transition hover:text-brand-leaf-green">
                Modules
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-[#1a2744]">Appointments & Bookings</li>
          </ol>
        </nav>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-[0.2em] text-brand-leaf-green sm:text-sm"
            >
              Paid module
            </motion.p>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-[#1a2744] sm:text-6xl lg:text-[3.75rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Fill your calendar
              </motion.span>
              <motion.span
                className="mt-1 block text-gradient-leaf"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                without the back-and-forth.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-lg leading-relaxed text-[#1a2744]/60"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              Guests book from your storefront. Collect a deposit, send reminders, and auto-create
              an invoice when the session is done.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button href="/demo" variant="outline" size="lg">
                Book a demo
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
          >
            <AppointmentsMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AppointmentsSlotMarquee() {
  const reduceMotion = useReducedMotion();
  const loop = [...FLOATING_SLOTS, ...FLOATING_SLOTS];

  return (
    <section className="border-y border-[#1a2744]/08 bg-white py-5">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-3">
            {FLOATING_SLOTS.slice(0, 4).map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-2 rounded-full border border-[#1a2744]/10 bg-[#f6f6f4] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <CalendarDays className="h-4 w-4 text-brand-leaf-green" />
                {slot}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-3 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {loop.map((slot, i) => (
              <span
                key={`${slot}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#1a2744]/10 bg-[#f6f6f4] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <CalendarDays className="h-4 w-4 text-brand-leaf-green" />
                {slot}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function AppointmentsFlowSection() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FLOW.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Booking flow
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl lg:text-[2.75rem]">
            From empty slot to paid session, animated quietly.
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#1a2744] p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#e8f0a8]/20 blur-2xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={FLOW[active].title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0a8] text-[#1a2744]">
                    {(() => {
                      const Icon = FLOW[active].icon;
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </span>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/40">
                    Step 0{active + 1}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                    {FLOW[active].title}
                  </h3>
                  <p className="mt-3 max-w-md text-lg leading-relaxed text-white/60">
                    {FLOW[active].copy}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex gap-2">
                {FLOW.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={item.title}
                    onClick={() => setActive(index)}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition",
                      index === active ? "bg-[#e8f0a8]" : "bg-white/20 hover:bg-white/35"
                    )}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="space-y-3">
              {FLOW.map((item, index) => {
                const Icon = item.icon;
                const on = index === active;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition sm:px-5",
                        on
                          ? "border-brand-leaf-green/35 bg-[#e8f0a8]/40"
                          : "border-[#1a2744]/08 bg-[#f6f6f4] hover:border-[#1a2744]/15"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          on ? "bg-brand-leaf-green text-white" : "bg-white text-[#1a2744]/50"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold text-[#1a2744]">{item.title}</p>
                        <p className="mt-1 text-base leading-relaxed text-[#1a2744]/55">{item.copy}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function AppointmentsVisualFeatures() {
  const features = [
    {
      title: "Week and day views",
      copy: "See the floor at a glance: staff know what’s next without chatting in WhatsApp.",
      image: homeImages.features.appointments,
      alt: "Appointment calendar in Modufy",
    },
    {
      title: "Bookable services from Inventory",
      copy: "Duration, price, and deposit settings stay on the service, not a separate booking tool.",
      image: homeImages.features.inventoryPhoto,
      alt: "Services catalog for bookings",
    },
    {
      title: "Public booking on your storefront",
      copy: "Customers pick a slot on your page. You confirm, remind, and invoice from one place.",
      image: homeImages.features.mobile,
      alt: "Mobile booking experience",
    },
  ] as const;

  return (
    <section className="section-padding bg-[#f3f1ea]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Built for service teams
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            The calendar your front desk actually trusts.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.07}>
              <article className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e4e0d6]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-[#1a2744]">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-[#1a2744]/60">{item.copy}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppointmentsAudienceStrip() {
  const reduceMotion = useReducedMotion();
  const cards = [
    { title: "Salons & spas", copy: "Retail + services on one day sheet.", icon: Sparkles },
    { title: "Clinics & consultants", copy: "Blocked hours and confirmed deposits.", icon: CalendarDays },
    { title: "Busy front desks", copy: "Less DM booking. More show-ups.", icon: Smartphone },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Built for teams tired of DM-based booking
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.06}>
              <motion.article
                className="rounded-[1.5rem] border border-[#1a2744]/08 bg-[#f6f6f4] p-6"
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0a8] text-[#1a2744]">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-[#1a2744]">{card.title}</h3>
                <p className="mt-2 text-base text-[#1a2744]/55">{card.copy}</p>
              </motion.article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppointmentsCloseSection() {
  return (
    <section className="section-padding bg-[#f3f1ea]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Add Appointments when bookings get serious.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#1a2744]/60">
              Begin on Modufy Core, connect bookable services from Inventory, then open guest
              booking on your storefront.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Get started free
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View pricing
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/modules/inventory", label: "Inventory" },
                { href: "/modules/marketplace", label: "Storefront" },
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/marketing", label: "Marketing" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#1a2744]/12 bg-white px-4 py-2.5 text-base font-semibold text-[#1a2744] transition hover:border-brand-leaf-green/40"
                >
                  <Check className="h-3.5 w-3.5 text-brand-leaf-green" />
                  {item.label}
                </Link>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
              <Image
                src={homeImages.features.appointments}
                alt="Appointments calendar visual"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/95 p-4 backdrop-blur-sm">
                <p className="font-display text-base font-bold text-[#1a2744]">
                  Appointments & Bookings
                </p>
                <p className="mt-1 text-sm text-[#1a2744]/55">
                  Calendar, deposits, reminders, and auto-invoice, ready when you enable it.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1a2744] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(232,240,168,0.18),transparent)]" />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready for a calendar that fills itself?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-base text-white/55 sm:text-lg">
              Fewer DMs. Fewer no-shows. Bookings that land in the same Modufy stack as inventory
              and invoices.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
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
