"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { appPath } from "@/lib/site-config";
import { homeImages } from "@/lib/home-images";

export function CtaSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = email.trim()
      ? `${appPath("/register")}?email=${encodeURIComponent(email.trim())}`
      : appPath("/register");
    window.location.href = target;
  }

  return (
    <section className="pb-20 pt-4">
      <div className="container-site">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-sea-grey shadow-2xl">
            <div className="texture-noise pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-tangerine/20 blur-[100px]" />
            <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-brand-leaf-green/18 blur-[100px]" />

            <div className="grid lg:grid-cols-2">
              <div className="relative hidden min-h-[320px] lg:block group">
                <Image
                  src={homeImages.cta}
                  alt="Modern office workspace"
                  fill
                  className="object-cover opacity-70 transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-sea-grey/40 to-brand-sea-grey" />
              </div>

              <div className="relative px-8 py-12 sm:px-12 sm:py-16 lg:py-20 z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-tangerine">
                  Get started
                </p>
                <h2 className="mt-3 max-w-md font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Your business, <span className="text-gradient-tangerine leading-none">finally in one place.</span>
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                  Free to start. Add modules when you&apos;re ready - no credit card for the trial.
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="h-12 min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-white outline-none placeholder:text-white/30 transition-all duration-300 focus:border-brand-tangerine/65 focus:bg-white/10 focus:ring-4 focus:ring-brand-tangerine/15"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-brand-tangerine px-8 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-glow-tangerine hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start free
                  </button>
                </form>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

