"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

type FooterNewsletterProps = {
  variant?: "light" | "dark";
};

export function FooterNewsletter({ variant = "light" }: FooterNewsletterProps) {
  const [submitted, setSubmitted] = useState(false);
  const dark = variant === "dark";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={cn("mt-5 text-sm", dark ? "text-white/60" : "text-muted-foreground")}>
        Thanks for subscribing. We&apos;ll keep you posted.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="email"
        name="email"
        required
        placeholder="Your email address"
        className={cn(
          "h-11 min-w-0 flex-1 rounded-full px-4 text-sm outline-none transition focus:ring-2",
          dark
            ? "border border-white/15 bg-white/8 text-white placeholder:text-white/40 focus:border-brand-tangerine/50 focus:ring-brand-tangerine/25"
            : "border border-border bg-background ring-primary/30 focus:ring-2"
        )}
      />
      <button
        type="submit"
        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-brand-tangerine px-6 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Subscribe
      </button>
    </form>
  );
}
