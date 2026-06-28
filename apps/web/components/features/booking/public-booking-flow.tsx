"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { formatAppointmentTime } from "@/components/features/appointments/appointment-status";
import { publicBookingApi, type PublicBusinessInfo, type PublicServiceItem } from "@/lib/public-api";
import { Spinner } from "@/components/shared/spinner";
import { FlowBoxReveal } from "@/components/shared/flow-motion";
import { cn } from "@/lib/utils";
import { todayHoursLine } from "@/lib/storefront-hours";
import "@/components/shared/flow-motion.css";

type Step = "service" | "datetime" | "details" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Details" },
];

function stepIndex(step: Step) {
  if (step === "done") return STEPS.length;
  return STEPS.findIndex((s) => s.id === step);
}

export function PublicBookingFlow({
  slug,
  business,
  services,
  compact = false,
}: {
  slug: string;
  business: PublicBusinessInfo;
  services: PublicServiceItem[];
  /** Sheet / embedded mode — hides duplicate hero chrome */
  compact?: boolean;
}) {
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof publicBookingApi.book>> | null>(null);

  const policy = business.cancellation_policy;
  const policyRequired = policy?.enabled ?? false;
  const selected = services.find((s) => s.id === serviceId);
  const currentIdx = stepIndex(step);

  const { data: availability, isFetching: slotsLoading } = useQuery({
    queryKey: ["public-slots", slug, serviceId, date],
    queryFn: () => publicBookingApi.availability(slug, date, serviceId),
    enabled: step === "datetime" && !!serviceId && !!date,
  });

  useEffect(() => {
    setSlot("");
  }, [serviceId, date]);

  const bookMutation = useMutation({
    mutationFn: () =>
      publicBookingApi.book(slug, {
        service_id: serviceId,
        start_time: slot,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_email: guestEmail.trim() || undefined,
        notes,
        policy_accepted: policyRequired ? policyAccepted : true,
      }),
    onSuccess: (res) => {
      setResult(res);
      if (res.payment_url) {
        window.location.href = res.payment_url;
        return;
      }
      setStep("done");
    },
    onError: () => toast.error("Could not complete booking. Try another time."),
  });

  if (step === "done" && result) {
    return (
      <FlowBoxReveal className="w-full">
        <div className="rounded-2xl border border-[var(--booking-border,#e3e8ee)] bg-white p-6 text-center shadow-sm">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--booking-accent-soft,rgb(22_163_74/0.12))] text-[var(--booking-accent,#16a34a)]">
            <Check className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold">Booking received</h2>
          <p className="mt-2 text-sm text-[var(--booking-muted,#5d6b7e)]">{result.message}</p>
          <p className="mt-4 text-sm text-[var(--booking-muted,#5d6b7e)]">
            {business.name} will confirm your appointment soon. Save your phone — we may contact you there.
          </p>
        </div>
      </FlowBoxReveal>
    );
  }

  return (
    <div className="space-y-6">
      {!compact && (
        <FlowBoxReveal>
          <header className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
            {business.tagline && (
              <p className="text-sm text-[var(--booking-muted,#5d6b7e)]">{business.tagline}</p>
            )}
            {business.city && (
              <p className="text-sm text-[var(--booking-muted,#5d6b7e)]">{business.city}</p>
            )}
            {business.hours?.length ? (
              <p className="text-xs text-[var(--booking-muted,#5d6b7e)]">
                {todayHoursLine(business.hours)}
              </p>
            ) : null}
          </header>
        </FlowBoxReveal>
      )}

      <nav className="booking-step-track" aria-label="Booking progress">
        {STEPS.map((s, i) => {
          const done = currentIdx > i;
          const active = s.id === step;
          return (
            <div
              key={s.id}
              className={cn("booking-step-pill", active && "is-active", done && "is-done")}
            >
              <span className="booking-step-dot">{done ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
              <span className="booking-step-label">{s.label}</span>
            </div>
          );
        })}
      </nav>

      {step === "service" && (
        <FlowBoxReveal delay={0.06} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s, i) => (
              <FlowBoxReveal key={s.id} delay={0.08 + i * 0.04}>
                <button
                  type="button"
                  className={cn(
                    "booking-service-card w-full",
                    serviceId === s.id && "is-selected",
                  )}
                  onClick={() => setServiceId(s.id)}
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-[var(--booking-muted,#5d6b7e)]">
                    {s.duration_mins} min · {formatMoney(s.sell_price, s.currency)}
                    {s.deposit_required > 0 && (
                      <> · Deposit {formatMoney(s.deposit_required, s.currency)}</>
                    )}
                  </p>
                </button>
              </FlowBoxReveal>
            ))}
          </div>
          <button
            type="button"
            className="booking-btn-primary group/btn sm:col-span-2"
            disabled={!serviceId}
            onClick={() => setStep("datetime")}
          >
            Continue →
          </button>
        </FlowBoxReveal>
      )}

      {step === "datetime" && selected && (
        <FlowBoxReveal delay={0.06} className="space-y-4 rounded-2xl border border-[var(--booking-border,#e3e8ee)] bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">{selected.name}</h2>
            <p className="text-sm text-[var(--booking-muted,#5d6b7e)]">
              Pick a date and time within opening hours
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              className="booking-field-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {slotsLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(availability?.slots ?? []).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={cn("booking-slot-btn", slot === t && "is-selected")}
                  onClick={() => setSlot(t)}
                >
                  {formatAppointmentTime(t)}
                </button>
              ))}
              {(availability?.slots ?? []).length === 0 && (
                <p className="text-sm text-[var(--booking-muted,#5d6b7e)]">
                  No slots this day — closed or fully booked. Try another date.
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="button" className="booking-btn-secondary" onClick={() => setStep("service")}>
              Back
            </button>
            <button
              type="button"
              className="booking-btn-primary flex-1"
              disabled={!slot}
              onClick={() => setStep("details")}
            >
              Continue →
            </button>
          </div>
        </FlowBoxReveal>
      )}

      {step === "details" && (
        <FlowBoxReveal delay={0.06} className="space-y-4 rounded-2xl border border-[var(--booking-border,#e3e8ee)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Your details</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="booking-field-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <input
              className="booking-field-input"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (optional)</label>
            <input
              type="email"
              autoComplete="email"
              className="booking-field-input"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <input
              className="booking-field-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {selected && selected.deposit_required > 0 && (
            <p className="text-sm text-[var(--booking-muted,#5d6b7e)]">
              A deposit of {formatMoney(selected.deposit_required, selected.currency)} is required to
              confirm.
            </p>
          )}

          {policyRequired && policy?.summary && (
            <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
              <p className="text-sm font-medium">Cancellation policy</p>
              <p className="text-xs leading-relaxed text-[var(--booking-muted,#5d6b7e)]">
                {policy.summary}
              </p>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                />
                <span>I understand and agree to this cancellation policy</span>
              </label>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" className="booking-btn-secondary" onClick={() => setStep("datetime")}>
              Back
            </button>
            <button
              type="button"
              className="booking-btn-primary group/btn flex-1"
              disabled={
                !guestName ||
                !guestPhone ||
                bookMutation.isPending ||
                (policyRequired && !policyAccepted)
              }
              onClick={() => bookMutation.mutate()}
            >
              {bookMutation.isPending ? <Spinner className="h-4 w-4" /> : "Book now →"}
            </button>
          </div>
        </FlowBoxReveal>
      )}
    </div>
  );
}
