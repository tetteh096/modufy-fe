"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { formatAppointmentTime } from "@/components/features/appointments/appointment-status";
import { publicBookingApi, type PublicBusinessInfo, type PublicServiceItem } from "@/lib/public-api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { todayHoursLine } from "@/lib/storefront-hours";

type Step = "service" | "datetime" | "details" | "done";

export function PublicBookingFlow({
  slug,
  business,
  services,
}: {
  slug: string;
  business: PublicBusinessInfo;
  services: PublicServiceItem[];
}) {
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof publicBookingApi.book>> | null>(null);

  const policy = business.cancellation_policy;
  const policyRequired = policy?.enabled ?? false;

  const selected = services.find((s) => s.id === serviceId);

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
      <Card>
        <CardHeader>
          <CardTitle>Booking received</CardTitle>
          <CardDescription>{result.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {business.name} will confirm your appointment soon. Save your phone — we may contact you there.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{business.name}</h1>
        {business.tagline && <p className="text-muted-foreground">{business.tagline}</p>}
        {business.city && <p className="text-sm text-muted-foreground">{business.city}</p>}
        {business.hours?.length ? (
          <p className="text-xs text-muted-foreground">{todayHoursLine(business.hours)}</p>
        ) : null}
      </header>

      {step === "service" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <Card
              key={s.id}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary",
                serviceId === s.id && "border-primary ring-1 ring-primary"
              )}
              onClick={() => setServiceId(s.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.name}</CardTitle>
                <CardDescription>
                  {s.duration_mins} min · {formatMoney(s.sell_price, s.currency)}
                  {s.deposit_required > 0 && (
                    <> · Deposit {formatMoney(s.deposit_required, s.currency)}</>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
          <Button
            className="sm:col-span-2"
            disabled={!serviceId}
            onClick={() => setStep("datetime")}
          >
            Continue
          </Button>
        </div>
      )}

      {step === "datetime" && selected && (
        <Card>
          <CardHeader>
            <CardTitle>{selected.name}</CardTitle>
            <CardDescription>Pick a date and time within opening hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            {slotsLoading ? (
              <Spinner />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(availability?.slots ?? []).map((t) => (
                  <Button
                    key={t}
                    type="button"
                    size="sm"
                    variant={slot === t ? "default" : "outline"}
                    onClick={() => setSlot(t)}
                  >
                    {formatAppointmentTime(t)}
                  </Button>
                ))}
                {(availability?.slots ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No slots this day — closed or fully booked. Try another date.
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("service")}>
                Back
              </Button>
              <Button disabled={!slot} onClick={() => setStep("details")}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            {selected && selected.deposit_required > 0 && (
              <p className="text-sm text-muted-foreground">
                A deposit of {formatMoney(selected.deposit_required, selected.currency)} is required to confirm.
              </p>
            )}
            {policyRequired && policy?.summary && (
              <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                <p className="text-sm font-medium">Cancellation policy</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{policy.summary}</p>
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("datetime")}>
                Back
              </Button>
              <Button
                disabled={
                  !guestName ||
                  !guestPhone ||
                  bookMutation.isPending ||
                  (policyRequired && !policyAccepted)
                }
                onClick={() => bookMutation.mutate()}
              >
                {bookMutation.isPending ? <Spinner className="h-4 w-4" /> : "Book now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
