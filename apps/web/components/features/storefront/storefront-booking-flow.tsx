"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Phone,
  User,
} from "lucide-react";
import { formatMoney } from "@/lib/format";
import { formatAppointmentDate, formatAppointmentTime } from "@/components/features/appointments/appointment-status";
import { publicBookingApi, type PublicBusinessInfo, type PublicServiceItem } from "@/lib/public-api";
import { useStorefront } from "./storefront-context";
import { combineDateAndTime, isDateTimeInFuture } from "@/components/features/appointments/booking-datetime";
import { SfReveal } from "./storefront-motion";

type Step = "service" | "datetime" | "details" | "review" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "datetime", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "review", label: "Review" },
];

function stepIndex(step: Step) {
  if (step === "done") return STEPS.length;
  return STEPS.findIndex((s) => s.id === step);
}

export function StorefrontBookingFlow({
  slug,
  business,
  services,
  initialServiceId,
  accent,
}: {
  slug: string;
  business: PublicBusinessInfo;
  services: PublicServiceItem[];
  initialServiceId?: string;
  accent: string;
}) {
  const { basePath } = useStorefront();
  const policy = business.cancellation_policy;
  const policyRequired = policy?.enabled ?? false;

  const resolvedInitial =
    initialServiceId && services.some((s) => s.id === initialServiceId)
      ? initialServiceId
      : services.length === 1
        ? services[0].id
        : "";

  const [step, setStep] = useState<Step>(resolvedInitial ? "datetime" : "service");
  const [serviceId, setServiceId] = useState(resolvedInitial);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  const slot = useMemo(
    () => (date && time ? combineDateAndTime(date, time) : ""),
    [date, time]
  );
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof publicBookingApi.book>> | null>(null);

  const selected = services.find((s) => s.id === serviceId);

  const { data: availability, isFetching: slotsLoading } = useQuery({
    queryKey: ["public-slots", slug, serviceId, date],
    queryFn: () => publicBookingApi.availability(slug, date, serviceId),
    enabled: (step === "datetime" || step === "review") && !!serviceId && !!date,
  });

  const datetimeValid = !!date && !!time && isDateTimeInFuture(date, time);

  const bookMutation = useMutation({
    mutationFn: () =>
      publicBookingApi.book(slug, {
        service_id: serviceId,
        start_time: slot,
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
        notes: notes.trim() || undefined,
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

  const canConfirm = useMemo(() => {
    if (!guestName.trim() || !guestPhone.trim() || !slot || !serviceId) return false;
    if (!termsAccepted) return false;
    if (policyRequired && !policyAccepted) return false;
    return true;
  }, [guestName, guestPhone, slot, serviceId, termsAccepted, policyRequired, policyAccepted]);

  const currentIdx = stepIndex(step);

  if (step === "done" && result) {
    return (
      <SfReveal className="sf-book-done" variant="up">
        <div className="sf-book-done-icon" style={{ color: accent }}>
          <Check className="h-10 w-10" />
        </div>
        <h2>Booking received</h2>
        <p>{result.message}</p>
        {selected && slot ? (
          <div className="sf-book-done-summary">
            <p>
              <strong>{selected.name}</strong>
            </p>
            <p>
              {formatAppointmentDate(slot)} at {formatAppointmentTime(slot)}
            </p>
            <p>{guestName} · {guestPhone}</p>
          </div>
        ) : null}
        <p className="sf-book-done-note">
          {business.name} will confirm your appointment soon. Keep your phone nearby — we may contact you there.
        </p>
        <div className="sf-book-done-actions">
          <Link href={basePath} className="sf-btn sf-btn-solid" style={{ background: accent }}>
            Back to shop
          </Link>
          <Link href={`${basePath}/services`} className="sf-btn sf-btn-ghost">
            More services
          </Link>
        </div>
      </SfReveal>
    );
  }

  return (
    <div className="sf-book-flow">
      <nav className="sf-book-steps" aria-label="Booking progress">
        {STEPS.map((s, i) => {
          const done = currentIdx > i;
          const active = s.id === step;
          return (
            <div
              key={s.id}
              className={`sf-book-step${active ? " is-active" : ""}${done ? " is-done" : ""}`}
            >
              <span className="sf-book-step-num" style={active ? { background: accent } : undefined}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="sf-book-step-label">{s.label}</span>
            </div>
          );
        })}
      </nav>

      {step === "service" ? (
        <SfReveal className="sf-book-panel" variant="up">
          <h2 className="sf-book-panel-title">Choose a service</h2>
          <p className="sf-book-panel-lead">Select what you would like to book with {business.name}.</p>
          <div className="sf-book-service-grid">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`sf-book-service-pick${serviceId === s.id ? " is-selected" : ""}`}
                style={serviceId === s.id ? { borderColor: accent } : undefined}
                onClick={() => setServiceId(s.id)}
              >
                <strong>{s.name}</strong>
                <span>
                  {s.duration_mins} min · {formatMoney(s.sell_price, s.currency)}
                  {s.deposit_required > 0
                    ? ` · Deposit ${formatMoney(s.deposit_required, s.currency)}`
                    : ""}
                </span>
              </button>
            ))}
          </div>
          <div className="sf-book-panel-actions">
            <Link href={`${basePath}/services`} className="sf-btn sf-btn-ghost">
              <ChevronLeft className="h-4 w-4" />
              All services
            </Link>
            <button
              type="button"
              className="sf-btn sf-btn-solid"
              style={{ background: accent }}
              disabled={!serviceId}
              onClick={() => setStep("datetime")}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </SfReveal>
      ) : null}

      {step === "datetime" && selected ? (
        <SfReveal className="sf-book-panel" variant="up">
          <h2 className="sf-book-panel-title">{selected.name}</h2>
          <p className="sf-book-panel-lead">
            Times follow your business hours from Settings. Closed days have no available slots.
          </p>

          <div className="sf-book-datetime-row">
            <label className="sf-book-field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="sf-book-field">
              <span>Time</span>
              <input
                type="time"
                value={time}
                step={900}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>

          {!datetimeValid && date && time ? (
            <p className="sf-book-slots-empty">Choose a future date and time to continue.</p>
          ) : null}

          <div className="sf-book-slots">
            <p className="sf-book-slots-label">Quick picks (open times)</p>
            {slotsLoading ? (
              <p className="sf-book-slots-empty">
                <Loader2 className="h-4 w-4 sf-spin" />
                Checking open times…
              </p>
            ) : (availability?.slots ?? []).length > 0 ? (
              <div className="sf-book-slot-grid">
                {(availability?.slots ?? []).slice(0, 12).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`sf-book-slot${slot === t ? " is-selected" : ""}`}
                    style={slot === t ? { background: accent, borderColor: accent } : undefined}
                    onClick={() => {
                      const d = new Date(t);
                      setDate(d.toISOString().split("T")[0]);
                      setTime(
                        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
                      );
                    }}
                  >
                    {formatAppointmentTime(t)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="sf-book-slots-empty">
                No times available this day — the business may be closed or fully booked. Try another date.
              </p>
            )}
          </div>

          <div className="sf-book-panel-actions">
            {services.length > 1 ? (
              <button type="button" className="sf-btn sf-btn-ghost" onClick={() => setStep("service")}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <Link href={`${basePath}/services/${serviceId}`} className="sf-btn sf-btn-ghost">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            )}
            <button
              type="button"
              className="sf-btn sf-btn-solid"
              style={{ background: accent }}
              disabled={!datetimeValid}
              onClick={() => setStep("details")}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </SfReveal>
      ) : null}

      {step === "details" ? (
        <SfReveal className="sf-book-panel" variant="up">
          <h2 className="sf-book-panel-title">Your details</h2>
          <p className="sf-book-panel-lead">We will use this to confirm your appointment.</p>

          <label className="sf-book-field">
            <span>
              <User className="h-3.5 w-3.5" />
              Full name
            </span>
            <input
              type="text"
              autoComplete="name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Ama Mensah"
            />
          </label>

          <label className="sf-book-field">
            <span>
              <Phone className="h-3.5 w-3.5" />
              Phone number
            </span>
            <input
              type="tel"
              autoComplete="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="e.g. 024 123 4567"
            />
          </label>

          <label className="sf-book-field">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything we should know before your visit?"
            />
          </label>

          <div className="sf-book-panel-actions">
            <button type="button" className="sf-btn sf-btn-ghost" onClick={() => setStep("datetime")}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              className="sf-btn sf-btn-solid"
              style={{ background: accent }}
              disabled={!guestName.trim() || !guestPhone.trim()}
              onClick={() => setStep("review")}
            >
              Review booking
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </SfReveal>
      ) : null}

      {step === "review" && selected && slot ? (
        <SfReveal className="sf-book-panel" variant="up">
          <h2 className="sf-book-panel-title">Review & confirm</h2>
          <p className="sf-book-panel-lead">Check everything before you submit — you can still go back and edit.</p>

          <div className="sf-book-summary">
            <div className="sf-book-summary-block">
              <h3>Service</h3>
              <p className="sf-book-summary-main">{selected.name}</p>
              <p className="sf-book-summary-sub">
                <Clock className="h-3.5 w-3.5" />
                {selected.duration_mins} min · {formatMoney(selected.sell_price, selected.currency)}
              </p>
            </div>

            <div className="sf-book-summary-block">
              <h3>Date & time</h3>
              <p className="sf-book-summary-main">
                <CalendarDays className="h-4 w-4" />
                {formatAppointmentDate(slot)}
              </p>
              <p className="sf-book-summary-sub">{formatAppointmentTime(slot)}</p>
            </div>

            <div className="sf-book-summary-block">
              <h3>Contact</h3>
              <p className="sf-book-summary-main">{guestName}</p>
              <p className="sf-book-summary-sub">{guestPhone}</p>
              {notes.trim() ? <p className="sf-book-summary-note">&ldquo;{notes.trim()}&rdquo;</p> : null}
            </div>

            {selected.deposit_required > 0 ? (
              <div className="sf-book-summary-deposit">
                Deposit due to confirm:{" "}
                <strong>{formatMoney(selected.deposit_required, selected.currency)}</strong>
              </div>
            ) : null}
          </div>

          <div className="sf-book-legal">
            {policyRequired && policy?.summary ? (
              <div className="sf-book-policy">
                <h3>Cancellation policy</h3>
                <p>{policy.summary}</p>
                <label className="sf-book-check">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                  />
                  <span>I understand and agree to this cancellation policy</span>
                </label>
              </div>
            ) : null}

            <label className="sf-book-check">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I agree to share my contact details with {business.name} for this appointment and
                accept that appointment times may be adjusted if needed.
              </span>
            </label>
          </div>

          <div className="sf-book-panel-actions">
            <button type="button" className="sf-btn sf-btn-ghost" onClick={() => setStep("details")}>
              <ChevronLeft className="h-4 w-4" />
              Edit details
            </button>
            <button
              type="button"
              className="sf-btn sf-btn-solid sf-book-confirm"
              style={{ background: accent }}
              disabled={!canConfirm || bookMutation.isPending}
              onClick={() => bookMutation.mutate()}
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 sf-spin" />
                  Confirming…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirm booking
                </>
              )}
            </button>
          </div>
        </SfReveal>
      ) : null}
    </div>
  );
}
