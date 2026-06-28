import Image from "next/image";
import Link from "next/link";
import { Calendar, Check, Clock, MessageSquare, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import {
  demoHighlights,
  demoQuote,
  demoSteps,
} from "@/lib/demo-content";
import { homeImages } from "@/lib/home-images";
import { appPath } from "@/lib/site-config";

export function DemoPageIntro() {
  return (
    <FadeIn>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
        Your walkthrough
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
        A demo built around your business — not a generic slide deck
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        We&apos;ll show you how Modufy handles the workflows you care about: customers, daily sales,
        invoicing, stock, POS, or appointments — using examples that fit your industry.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {demoHighlights.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-brand-sea-grey"
          >
            <Check className="h-3.5 w-3.5 text-brand-leaf-green" strokeWidth={2.5} />
            {item}
          </span>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        {demoSteps.map((step) => (
          <div
            key={step.step}
            className="flex gap-4 rounded-[1.25rem] border border-border bg-card p-4 transition hover:border-brand-leaf-green/25"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-brand-leaf-green">
              {step.step}
            </span>
            <div>
              <p className="font-semibold text-brand-sea-grey">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock, label: "30 min session" },
          { icon: Calendar, label: "Pick a time that works" },
          { icon: MessageSquare, label: "Live Q&A included" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl border border-border bg-[#faf8f5] px-3 py-4 text-center"
          >
            <Icon className="h-5 w-5 text-brand-tangerine" />
            <p className="mt-2 text-xs font-semibold text-brand-sea-grey">{label}</p>
          </div>
        ))}
      </div>

      <blockquote className="mt-10 rounded-[1.25rem] border border-border bg-secondary/40 p-5">
        <Sparkles className="h-5 w-5 text-brand-tangerine" />
        <p className="mt-3 text-sm leading-relaxed text-brand-sea-grey">&ldquo;{demoQuote.text}&rdquo;</p>
        <footer className="mt-3 text-xs font-medium text-muted-foreground">— {demoQuote.author}</footer>
      </blockquote>

      <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-border">
        <div className="relative aspect-[16/9]">
          <Image
            src={homeImages.pages.demo}
            alt="Modufy product walkthrough"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-sea-grey/60 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white/90">
            Prefer to explore solo?{" "}
            <Link href={appPath("/register")} className="underline underline-offset-2 hover:text-brand-tangerine">
              Start free on Core
            </Link>{" "}
            — no call required.
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
