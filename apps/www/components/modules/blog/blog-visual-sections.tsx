"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Check,
  FilePenLine,
  ImageIcon,
  Search,
  Tags,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { BlogMockup } from "@/components/modules/blog/blog-mockup";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const EDITOR_STEPS = [
  {
    title: "Draft the story",
    copy: "Write tips, updates, and case studies in a clean editor: save as draft until you’re ready.",
    icon: FilePenLine,
  },
  {
    title: "Add cover + SEO",
    copy: "Upload a cover, set title and meta description so each post can rank for real searches.",
    icon: Search,
  },
  {
    title: "Organise with tags",
    copy: "Categories and tags keep the library tidy as your content library grows.",
    icon: Tags,
  },
  {
    title: "Publish to storefront",
    copy: "Posts go live on your public Modufy page: linked from your storefront nav.",
    icon: BookOpen,
  },
] as const;

const ARTICLE_CARDS = [
  { title: "5 ways to fill midweek slots", tag: "Tips", read: "4 min" },
  { title: "Behind our best sellers", tag: "Stories", read: "6 min" },
  { title: "How to write a local SEO post", tag: "SEO", read: "5 min" },
  { title: "Client story, from DMs to bookings", tag: "Case study", read: "7 min" },
] as const;

export function BlogHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative -mt-[5.75rem] overflow-hidden bg-[#f7f5ef] pb-14 pt-28 sm:-mt-[6.25rem] sm:pb-20 sm:pt-32">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-35" aria-hidden />
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[-5%] top-24 h-72 w-72 rounded-full bg-[#e8f0a8]/55 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
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
            <li className="font-medium text-[#1a2744]">Storefront Blog</li>
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
                Tell your story
              </motion.span>
              <motion.span
                className="mt-1 block text-gradient-leaf"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                on your storefront.
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 max-w-md text-lg leading-relaxed text-[#1a2744]/60"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
            >
              Draft, publish, and organise posts that live beside your products and bookings -
              with covers, tags, and SEO fields built in.
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
            <BlogMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function BlogArticleMarquee() {
  const reduceMotion = useReducedMotion();
  const loop = [...ARTICLE_CARDS, ...ARTICLE_CARDS];

  return (
    <section className="border-y border-[#1a2744]/08 bg-white py-6">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />
        {reduceMotion ? (
          <div className="container-site flex flex-wrap justify-center gap-3">
            {ARTICLE_CARDS.map((card) => (
              <span
                key={card.title}
                className="inline-flex items-center gap-3 rounded-full border border-[#1a2744]/10 bg-[#f7f6f2] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <span className="rounded-full bg-[#e8f0a8] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {card.tag}
                </span>
                {card.title}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max gap-3 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          >
            {loop.map((card, i) => (
              <span
                key={`${card.title}-${i}`}
                className="inline-flex shrink-0 items-center gap-3 rounded-full border border-[#1a2744]/10 bg-[#f7f6f2] px-4 py-2 text-sm font-semibold text-[#1a2744]"
              >
                <span className="rounded-full bg-[#e8f0a8] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                  {card.tag}
                </span>
                {card.title}
                <span className="text-[#1a2744]/35">{card.read}</span>
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function BlogEditorFlow() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % EDITOR_STEPS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const StepIcon = EDITOR_STEPS[active].icon;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            Publish flow
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl lg:text-[2.75rem]">
            From blank page to live post, without leaving Modufy.
          </h2>
        </FadeIn>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#1a2744] p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-[#e8f0a8]/20 blur-2xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={EDITOR_STEPS[active].title}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0a8] text-[#1a2744]">
                    <StepIcon className="h-6 w-6" />
                  </span>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/40">
                    Step 0{active + 1}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
                    {EDITOR_STEPS[active].title}
                  </h3>
                  <p className="mt-3 max-w-md text-lg leading-relaxed text-white/60">
                    {EDITOR_STEPS[active].copy}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex gap-2">
                {EDITOR_STEPS.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    aria-label={step.title}
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
              {EDITOR_STEPS.map((step, index) => {
                const Icon = step.icon;
                const on = index === active;
                return (
                  <li key={step.title}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition sm:px-5",
                        on
                          ? "border-brand-leaf-green/35 bg-[#eef4e4]"
                          : "border-[#1a2744]/08 bg-[#f7f6f2] hover:border-[#1a2744]/15"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          on ? "bg-brand-leaf-green text-white" : "bg-white text-[#1a2744]/45"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold text-[#1a2744]">{step.title}</p>
                        <p className="mt-1 text-base leading-relaxed text-[#1a2744]/55">{step.copy}</p>
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

export function BlogVisualFeatures() {
  const features = [
    {
      title: "More than a product grid",
      copy: "Posts sit on your storefront next to products and bookings, one public presence.",
      image: homeImages.features.mobile,
      alt: "Content on a mobile storefront",
    },
    {
      title: "Built for local SEO",
      copy: "SEO title and meta fields on every article so customers can find you in search.",
      image: homeImages.pages.blog,
      alt: "Blog and content marketing",
    },
    {
      title: "Covers that carry the story",
      copy: "Upload cover images per post so the feed feels like a brand, not a spreadsheet.",
      image: homeImages.features.marketing,
      alt: "Visual content covers",
    },
  ] as const;

  return (
    <section className="section-padding bg-[#f7f5ef]">
      <div className="container-site">
        <FadeIn className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
            What Blog adds
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Trust content that lives where you sell.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.07}>
              <article className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e6e2d8]">
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

export function BlogSeoStrip() {
  const items = [
    { icon: ImageIcon, label: "Cover image per post" },
    { icon: Search, label: "SEO title + meta" },
    { icon: Tags, label: "Categories & tags" },
    { icon: BookOpen, label: "Unique slug URL" },
  ] as const;

  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
            Everything an article needs: still simple
          </h2>
          <p className="mt-3 text-lg text-[#1a2744]/55">
            Draft and publish workflow with the fields that help posts get found.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <FadeIn key={item.label} delay={index * 0.05}>
              <div className="rounded-2xl border border-[#1a2744]/08 bg-[#f7f6f2] p-5 text-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0a8] text-[#1a2744]">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-base font-bold text-[#1a2744]">{item.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogCloseSection() {
  return (
    <section className="section-padding bg-[#f7f5ef]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-leaf-green sm:text-sm">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1a2744] sm:text-4xl">
              Start free. Add Blog when the storefront needs a voice.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#1a2744]/60">
              Begin on Core, publish your storefront, then turn on Blog for tips, updates, and
              SEO content that sits next to what you sell.
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
                { href: "/modules/marketplace", label: "Storefront" },
                { href: "/modules/marketing", label: "Marketing" },
                { href: "/modules/ai", label: "AI Assistant" },
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
                src={homeImages.pages.blog}
                alt="Storefront blog content"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/95 p-4 backdrop-blur-sm">
                <p className="font-display text-base font-bold text-[#1a2744]">Storefront Blog</p>
                <p className="mt-1 text-sm text-[#1a2744]/55">
                  Draft, SEO, tags, and publish, ready on your public page.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1a2744] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(232,240,168,0.16),transparent)]" />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to publish on the same page you sell from?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-base text-white/55 sm:text-lg">
              Build trust with content that lives next to products, bookings, and campaigns -
              not on a separate CMS.
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
