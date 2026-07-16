import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const STORIES = [
  {
    title: "Get started fast",
    eyebrow: "Solo & early stage",
    image: "/landingscroll/modu/solo.jpg",
    imageAlt: "Founder launching a small business with Modufy",
    body: (
      <>
        <strong className="text-white">Amara Osei</strong> started taking sales
        and invoices on Modufy from her phone. Now her retail team runs on one
        system.
      </>
    ),
  },
  {
    title: "Grow as big as you want",
    eyebrow: "Scaling teams",
    image: "/landingscroll/modu/grow.jpg",
    imageAlt: "Growing retail operations powered by Modufy",
    body: (
      <>
        <strong className="text-white">Coastal Goods</strong> grew from a single
        counter to multi-channel stock, bookings, and billing, without swapping
        tools.
      </>
    ),
  },
  {
    title: "Raise the bar",
    eyebrow: "Established ops",
    image: "/landingscroll/modu/team.jpg",
    imageAlt: "Established team using Modufy across operations",
    body: (
      <>
        Established teams use Modufy to keep{" "}
        <strong className="text-white">sales, inventory, and finance</strong>{" "}
        aligned, from first sale to year-end reports.
      </>
    ),
  },
] as const;

export function ScaleAudienceSection() {
  return (
    <section className="relative overflow-hidden bg-[#eef3ea] py-20 dark:bg-[#152018] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-leaf-green">
              Built for every stage
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-brand-sea-grey sm:text-4xl lg:text-[2.75rem]">
              For anyone from entrepreneurs to enterprise
            </h2>
          </div>
          <Link
            href="/pricing"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-brand-leaf-green px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 sm:self-auto"
          >
            Pick a plan that fits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {STORIES.map((story, index) => (
            <FadeIn key={story.title} delay={0.06 * index}>
              <Link
                href="/pricing"
                className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]"
              >
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(min-width: 640px) 30vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey via-brand-sea-grey/35 to-transparent dark:from-black dark:via-black/40" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tangerine">
                    {story.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    {story.body}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:gap-2.5">
                    See plans
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
