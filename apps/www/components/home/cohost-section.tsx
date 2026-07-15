import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { moduleBadges } from "@/lib/module-badges";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    title: "Resources and academy",
    description:
      "Guides, walkthroughs, and short lessons so your team can learn Modufy without waiting for a call.",
    href: "/docs",
    cta: "Discover more",
    featuredCta: true,
    badge: moduleBadges.blog,
  },
  {
    title: "Setup consultancy",
    description:
      "We help you map modules, tax settings, and workflows to match how your business actually runs.",
    href: "/contact",
    cta: "Book a consult",
    featuredCta: false,
    badge: moduleBadges.team,
  },
  {
    title: "Free 1:1 onboarding",
    description:
      "A live session that gets Core live — customers, sales, and your first modules ready for day one.",
    href: "/demo",
    cta: "Start onboarding",
    featuredCta: false,
    badge: moduleBadges.core,
  },
  {
    title: "Human support",
    description:
      "Real people when something breaks or you get stuck — not a bot loop before you reach help.",
    href: "/contact",
    cta: "Talk to us",
    featuredCta: false,
    badge: moduleBadges.alerts,
  },
] as const;

export function CohostSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#faf8f2] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-leaf-green">
            With you after signup
          </p>
          <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-[#111] sm:text-4xl lg:text-[2.85rem]">
            More than business software.
            <span className="mt-1.5 block text-brand-sea-grey">A real setup partner.</span>
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-20 lg:grid-cols-4 lg:gap-x-7">
          {CARDS.map((card, index) => (
            <FadeIn key={card.title} delay={0.05 * index}>
              <Link
                href={card.href}
                className="group flex h-full flex-col outline-none transition duration-300"
              >
                <div className="relative mb-6 aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#f7eebb] via-[#f3e9b8] to-[#faf7ea] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_44px_rgba(54,54,54,0.12)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.65),transparent_62%)]" />
                  <div className="absolute inset-0 flex items-center justify-center p-9 sm:p-8">
                    <Image
                      src={card.badge}
                      alt=""
                      width={320}
                      height={320}
                      className="h-auto w-full max-w-[220px] object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.14)] transition duration-500 group-hover:scale-[1.05]"
                      sizes="220px"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold tracking-tight text-[#111] transition group-hover:text-brand-leaf-green">
                  {card.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-[#555]">
                  {card.description}
                </p>

                <span
                  className={cn(
                    "mt-5 inline-flex items-center gap-2.5 font-bold text-[#111] transition group-hover:text-brand-leaf-green",
                    card.featuredCta ? "text-base sm:text-lg" : "text-sm"
                  )}
                >
                  {card.cta}
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full bg-black text-white transition group-hover:bg-brand-leaf-green group-hover:shadow-[0_8px_20px_rgba(70,116,52,0.35)]",
                      card.featuredCta ? "h-9 w-9" : "h-7 w-7"
                    )}
                  >
                    <ArrowRight className={card.featuredCta ? "h-4 w-4" : "h-3.5 w-3.5"} />
                  </span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
