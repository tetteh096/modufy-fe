import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/home/section-label";
import { FadeIn } from "@/components/ui/fade-in";
import { integrations } from "@/lib/content";
import { homeImages } from "@/lib/home-images";

export function IntegrationsSection() {
  return (
    <section className="relative overflow-hidden bg-[#141414] text-white">
      <div className="texture-noise pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(70,116,52,0.22),transparent)]" />

      <div className="container-site relative section-padding">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <FadeIn className="lg:col-span-5">
            <SectionLabel light>Integrations</SectionLabel>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Plugs into
              <span className="block text-gradient-leaf mt-1">what you use.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              Stripe, Shopify, QuickBooks, Slack — connect the stack you already run on. No
              rip-and-replace required.
            </p>
            <Link
              href="/integrations"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-tangerine transition-all hover:text-[#ffaa44] hover:gap-3.5 duration-300"
            >
              Full integration list <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>

          <FadeIn delay={0.1} className="relative hidden lg:col-span-4 lg:block lg:col-start-9 group">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl">
              <Image
                src={homeImages.integrations}
                alt="Connected apps and integrations"
                fill
                className="object-cover opacity-90 transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                sizes="30vw"
              />
            </div>
          </FadeIn>
        </div>

        <div className="mt-14 flex flex-wrap gap-2">
          {integrations.map((tool, index) => (
            <FadeIn key={tool} delay={index * 0.02}>
              <span className="inline-flex items-center rounded-full border border-white/5 bg-white/[0.04] px-4.5 py-2.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] hover:border-brand-tangerine/45 hover:bg-white/10 hover:text-white hover:shadow-[0_4px_20px_rgba(245,143,32,0.12)] cursor-default">
                {tool}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

