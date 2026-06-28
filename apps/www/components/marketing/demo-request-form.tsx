"use client";

import { FormEvent, useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import {
  demoBusinessTypes,
  demoModuleInterests,
  demoTeamSizes,
} from "@/lib/demo-content";

export function DemoRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  function toggleModule(module: string) {
    setSelectedModules((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand-leaf-green/50 focus:ring-2 focus:ring-brand-leaf-green/15";

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] border border-brand-leaf-green/30 bg-secondary/40 p-10 text-center shadow-lg shadow-brand-sea-grey/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-leaf-green text-white">
          <CalendarCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-xl font-bold">You&apos;re on the list</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks for requesting a demo. We&apos;ll email you within one business day with a few time
          slots that work for your timezone.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          Check your spam folder if you don&apos;t hear from us — or email{" "}
          <a href="mailto:hello@modufy.app" className="font-semibold text-brand-leaf-green hover:text-brand-tangerine">
            hello@modufy.app
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-lg shadow-brand-sea-grey/5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
        Request a demo
      </p>
      <h3 className="mt-2 text-2xl font-bold">Book your walkthrough</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill in a few details and we&apos;ll send available times — usually within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="demo-name" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Full name *
            </label>
            <input id="demo-name" name="name" type="text" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="demo-email" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Work email *
            </label>
            <input id="demo-email" name="email" type="email" required className={inputClass} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="demo-company" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Company
            </label>
            <input id="demo-company" name="company" type="text" className={inputClass} />
          </div>
          <div>
            <label htmlFor="demo-size" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Team size
            </label>
            <select id="demo-size" name="team_size" className={inputClass}>
              {demoTeamSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="demo-business" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
            Business type
          </label>
          <select id="demo-business" name="business_type" className={inputClass}>
            {demoBusinessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold text-brand-sea-grey">
            What do you want to see? (pick any)
          </legend>
          <div className="flex flex-wrap gap-2">
            {demoModuleInterests.map((module) => {
              const active = selectedModules.includes(module);
              return (
                <button
                  key={module}
                  type="button"
                  onClick={() => toggleModule(module)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-leaf-green bg-brand-leaf-green/10 text-brand-leaf-green"
                      : "border-border bg-background text-muted-foreground hover:border-brand-leaf-green/40"
                  }`}
                >
                  {module}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="modules" value={selectedModules.join(", ")} />
        </fieldset>

        <div>
          <label htmlFor="demo-notes" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
            Anything else we should know?
          </label>
          <textarea
            id="demo-notes"
            name="notes"
            rows={3}
            placeholder="Current tools, locations, or specific workflows..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand-leaf-green/50 focus:ring-2 focus:ring-brand-leaf-green/15"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-tangerine px-6 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <CalendarCheck className="h-4 w-4" />
              Request demo
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Free · No credit card · We reply within one business day
        </p>
      </form>
    </div>
  );
}
