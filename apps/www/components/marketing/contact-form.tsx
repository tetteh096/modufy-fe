"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[1.75rem] border border-brand-leaf-green/30 bg-secondary/40 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-leaf-green text-white">
          <Send className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-xl font-bold">Message sent</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. A member of our team will reply to your email shortly.
        </p>
      </div>
    );
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand-leaf-green/50 focus:ring-2 focus:ring-brand-leaf-green/15";

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-lg shadow-brand-sea-grey/5 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-leaf-green">
        Send a message
      </p>
      <h3 className="mt-2 text-2xl font-bold">Fill in the form</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Share a few details and we&apos;ll route your request to the right person.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Your name *
            </label>
            <input id="contact-name" type="text" name="name" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
              Email address *
            </label>
            <input id="contact-email" type="email" name="email" required className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
            Subject
          </label>
          <input id="contact-subject" type="text" name="subject" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-brand-sea-grey">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="How can we help?"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-brand-leaf-green/50 focus:ring-2 focus:ring-brand-leaf-green/15"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-tangerine px-6 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Send message
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
