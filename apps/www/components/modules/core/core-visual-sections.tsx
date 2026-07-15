"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, Users, Wallet, Bell } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { CoreMockup } from "@/components/modules/core/core-mockup";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

export function CoreHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f6f6f4] pb-12 pt-28 sm:-mt-[6.25rem] sm:pb-16 sm:pt-32">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <motion.div
        className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-brand-leaf-green/12 blur-[90px]"
        animate={reduceMotion ? undefined : { x: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
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
            <li>/</li>
            <li>
              <Link href="/modules" className="transition hover:text-brand-leaf-green">
                Modules
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-[#1a2744]">Modufy Core</li>
          </ol>
        </nav>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a2744]/55"
            >
              Included with every account
            </motion.p>

            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1a2744] sm:text-5xl lg:text-[3.35rem]">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                Run your business
              </motion.span>
              <motion.span
                className="mt-1 block text-gradient-leaf"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                from one foundation.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              Customers, sales, expenses, and team access: always on. Add paid modules later
              without starting over.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button href="/demo" variant="outline" size="lg">
                Book a demo
              </Button>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-muted-foreground"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.48 }}
            >
              Free to start. No card required.
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
          >
            <div className="relative">
              <div className="relative mb-[-12%] aspect-[16/10] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={homeImages.hero.dashboardDevices}
                  alt="Modufy Core dashboard on desktop and mobile"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f6f6f4] via-transparent to-transparent" />
              </div>
              <div className="relative mx-auto max-w-md scale-[0.92] sm:max-w-lg">
                <CoreMockup />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CoreTrustStrip() {
  const reduceMotion = useReducedMotion();
  const items = [
    "Customer book",
    "Quick sales",
    "Expense capture",
    "Team permissions",
    "Alerts",
    "Always included",
  ] as const;
  const loop = [...items, ...items];

  return (
    <section className="border-y border-border bg-white">
      <div className="relative overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-x-8 gap-y-2">
            {items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a2744]/75"
              >
                <Check className="h-4 w-4 text-brand-leaf-green" />
                {item}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-10 px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {loop.map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#1a2744]/75"
              >
                <Check className="h-4 w-4 text-brand-leaf-green" />
                {item}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function CoreVisualFeatures() {
  const features = [
    {
      title: "Customers that stay with you",
      copy: "Tags, balances, and history, so every sale and follow-up has context.",
      image: homeImages.pages.testimonials,
      alt: "Happy customers and client relationships",
    },
    {
      title: "Money in and money out",
      copy: "Record sales and expenses in seconds. Receipt photos keep spend clear.",
      image: homeImages.features.finance,
      alt: "Sales and expense tracking growth",
    },
    {
      title: "Team access that fits",
      copy: "Invite staff with roles. Everyone works in one login, not shared passwords.",
      image: homeImages.story.salesTeam,
      alt: "Team collaborating in Modufy Core",
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            What Core includes
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            The daily work, without the spreadsheet scramble.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.06}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e8e4dc]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#1a2744]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoreFoundationSection() {
  return (
    <section className="section-padding bg-[#f6f6f4]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
            Built to grow
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Start on Core. Add modules without restarting.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Paid modules plug into Core; they don&apos;t replace it. Invoices, inventory, POS, and
            storefront all share the same customers and money picture.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: Users, label: "Customer book as the source of truth" },
              { icon: Wallet, label: "Sales and expenses in one daily view" },
              { icon: Bell, label: "Alerts that keep attention clear" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm font-medium text-[#1a2744]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-leaf-green/10 text-brand-leaf-green">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
            <Image
              src={homeImages.integrations}
              alt="Modufy systems connected from Core"
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

export function CoreReadyStrip() {
  const cards = [
    {
      title: "Replace the spreadsheet",
      copy: "Customers and daily sales finally live in one place.",
      image: homeImages.pages.journey.retail,
    },
    {
      title: "Keep receipts honest",
      copy: "Capture spend with categories and photos, not lost chats.",
      image: homeImages.features.payments,
    },
    {
      title: "Invite the team safely",
      copy: "Roles and permissions so staff only see what they need.",
      image: homeImages.story.support,
    },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Ready for the day, from the first login
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.06}>
              <article className="overflow-hidden rounded-[1.5rem] border border-border bg-[#faf8f5]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#1a2744]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.copy}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoreCloseSection() {
  return (
    <section className="section-padding">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-leaf-green">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Core is free to start, and it stays with you.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Begin with customers, sales, expenses, team access, and alerts. Turn on paid modules
              only when you need them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={appPath("/register")} size="lg" external variant="secondary">
                Start free trial
              </Button>
              <Button href="/pricing" variant="outline" size="lg">
                View pricing
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { href: "/modules/invoices", label: "Invoicing" },
                { href: "/modules/inventory", label: "Inventory" },
                { href: "/modules/marketplace", label: "Storefront" },
                { href: "/modules/marketing", label: "Marketing" },
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

          <FadeIn delay={0.08}>
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]">
              <Image
                src={homeImages.hero.dashboardDevices}
                alt="Modufy Core across devices"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-white/95 p-4 backdrop-blur-sm">
                <p className="text-sm font-bold text-[#1a2744]">Modufy Core</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Always included: customer book, sales, expenses, team, alerts.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#122038] px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to start on a real foundation?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm text-white/60">
              Manage customers, sales, expenses, and your team in one place, then grow into paid
              modules without migrating again.
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
