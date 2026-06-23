"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { publicApi, getApiErrorMessage } from "@/lib/api";
import { useStorefront } from "./storefront-context";

const enquirySchema = z.object({
  name: z.string().min(2, "Enter your name").max(120),
  phone: z.string().min(6, "Enter a valid phone number").max(30),
  email: z
    .string()
    .max(255)
    .refine((v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Enter a valid email"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)").max(2000),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export function StorefrontContactForm({ accent }: { accent: string }) {
  const { slug } = useStorefront();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const formLoadedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "" },
  });

  useEffect(() => {
    formLoadedAt.current = Date.now();
  }, []);

  async function onSubmit(values: EnquiryFormValues) {
    setBusy(true);
    try {
      const res = await publicApi.submitEnquiry(slug, {
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email?.trim() || undefined,
        subject: values.subject?.trim() || undefined,
        message: values.message.trim(),
        company_url: honeypotRef.current?.value ?? "",
        form_loaded_at: formLoadedAt.current,
      });
      setSent(true);
      reset();
      formLoadedAt.current = Date.now();
      toast.success(res.message);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="sf-contact-form-success">
        <CheckCircle2 className="h-8 w-8" style={{ color: accent }} />
        <h3>Message sent</h3>
        <p>We got your note and will reply as soon as we can.</p>
        <button
          type="button"
          className="sf-btn sf-btn-ghost"
          onClick={() => {
            setSent(false);
            formLoadedAt.current = Date.now();
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="sf-contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — hidden from humans, bots often fill it */}
      <div className="sf-contact-form-hp" aria-hidden="true">
        <label htmlFor="sf-company-url">Company website</label>
        <input
          ref={honeypotRef}
          id="sf-company-url"
          type="text"
          name="company_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="sf-contact-form-head">
        <h3>Send a message</h3>
        <p>Orders, products, bookings — ask us anything.</p>
      </div>

      <div className="sf-contact-form-grid">
        <div className="sf-contact-form-field">
          <label htmlFor="sf-enq-name">Your name</label>
          <input
            id="sf-enq-name"
            type="text"
            autoComplete="name"
            placeholder="e.g. Ama Mensah"
            {...register("name")}
          />
          {errors.name ? <span className="sf-contact-form-error">{errors.name.message}</span> : null}
        </div>

        <div className="sf-contact-form-field">
          <label htmlFor="sf-enq-phone">Phone</label>
          <input
            id="sf-enq-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 024 123 4567"
            {...register("phone")}
          />
          {errors.phone ? <span className="sf-contact-form-error">{errors.phone.message}</span> : null}
        </div>

        <div className="sf-contact-form-field sf-contact-form-field--full">
          <label htmlFor="sf-enq-email">
            Email <span className="sf-contact-form-optional">optional</span>
          </label>
          <input
            id="sf-enq-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            {...register("email")}
          />
          {errors.email ? <span className="sf-contact-form-error">{errors.email.message}</span> : null}
        </div>

        <div className="sf-contact-form-field sf-contact-form-field--full">
          <label htmlFor="sf-enq-subject">
            Subject <span className="sf-contact-form-optional">optional</span>
          </label>
          <input
            id="sf-enq-subject"
            type="text"
            placeholder="e.g. Order question"
            {...register("subject")}
          />
        </div>

        <div className="sf-contact-form-field sf-contact-form-field--full">
          <label htmlFor="sf-enq-message">Message</label>
          <textarea
            id="sf-enq-message"
            rows={4}
            placeholder="What can we help you with?"
            {...register("message")}
          />
          {errors.message ? (
            <span className="sf-contact-form-error">{errors.message.message}</span>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="sf-btn sf-btn-solid sf-contact-form-submit"
        style={{ background: accent }}
        disabled={busy}
      >
        {busy ? <Loader2 className="h-4 w-4 sf-spin" /> : <Send className="h-4 w-4" />}
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
