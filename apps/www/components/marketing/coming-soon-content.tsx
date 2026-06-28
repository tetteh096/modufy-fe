"use client";

import { FormEvent, useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/fade-in";

const TARGET = new Date("2026-09-01T00:00:00");

function getTimeLeft() {
  const diff = Math.max(0, TARGET.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function ComingSoonContent() {
  const [time, setTime] = useState(getTimeLeft);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl text-center">
        <FadeIn>
          <h1 className="text-4xl font-bold sm:text-5xl">Something great is coming soon!</h1>
        </FadeIn>

        <FadeIn delay={0.08} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="rounded-2xl border border-border bg-card px-4 py-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{unit.label}</p>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={0.12} className="mt-12">
          {submitted ? (
            <p className="text-sm text-muted-foreground">
              Thanks — we&apos;ll notify you when we launch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm outline-none ring-primary/30 focus:ring-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  Get Notified
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                We do not share your information with any third party & no spam*
              </p>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
