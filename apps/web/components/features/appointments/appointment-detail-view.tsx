"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CalendarClock,
  Check,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Receipt,
  Scissors,
  StickyNote,
  User,
  UserX,
  X,
} from "lucide-react";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { paymentMethodMeta } from "@/lib/sales-constants";
import {
  AppointmentStatusBadge,
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/components/features/appointments/appointment-status";
import {
  appointmentDurationMinutes,
  formatAppointmentDuration,
} from "@/components/features/appointments/appointment-duration";
import { AppointmentReminderSection } from "@/components/features/appointments/appointment-reminder-section";
import { CompleteAppointmentDialog } from "@/components/features/appointments/complete-appointment-dialog";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TERMINAL = new Set([
  "completed",
  "cancelled_by_customer",
  "cancelled_by_business",
  "no_show",
]);

function DetailSection({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {title}
      </h3>
      <div className="rounded-xl border bg-muted/20 p-4 text-sm">{children}</div>
    </section>
  );
}

export function AppointmentDetailView({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const { data: appt, isLoading } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentsApi.get(id),
    enabled: !!id,
  });

  const { data: availability } = useQuery({
    queryKey: ["appointment-slots-reschedule", id, rescheduleDate, appt?.service_id],
    queryFn: () => appointmentsApi.availability(rescheduleDate, appt!.service_id),
    enabled: rescheduleOpen && !!rescheduleDate && !!appt?.service_id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  const confirmMutation = useMutation({
    mutationFn: () => appointmentsApi.confirm(id),
    onSuccess: () => {
      toast.success("Booking confirmed");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const cancelMutation = useMutation({
    mutationFn: (opts?: { byCustomer?: boolean }) =>
      appointmentsApi.cancel(id, {
        reason: "Cancelled from dashboard",
        by_customer: opts?.byCustomer,
      }),
    onSuccess: (updated) => {
      if (updated.late_cancellation && (updated.deposit_forfeited ?? 0) > 0) {
        toast.success("Cancelled — deposit forfeited per policy", {
          description: `Amount withheld: ${updated.deposit_forfeited} ${updated.currency}`,
        });
      } else {
        toast.success("Booking cancelled");
      }
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const noShowMutation = useMutation({
    mutationFn: () => appointmentsApi.noShow(id),
    onSuccess: () => {
      toast.success("Marked as no-show");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const rescheduleMutation = useMutation({
    mutationFn: (start_time: string) => appointmentsApi.reschedule(id, { start_time }),
    onSuccess: () => {
      toast.success("Rescheduled");
      setRescheduleOpen(false);
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const notesMutation = useMutation({
    mutationFn: (notes: string) => appointmentsApi.update(id, { internal_notes: notes }),
    onSuccess: () => {
      toast.success("Internal notes saved");
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  useEffect(() => {
    if (appt?.internal_notes !== undefined) {
      setInternalNotes(appt.internal_notes);
    }
  }, [appt?.internal_notes]);

  if (isLoading || !appt) {
    return <SectionLoader />;
  }

  const displayName =
    appt.customer_name || appt.guest_name || appt.guest_phone || "Guest";
  const contactPhone = appt.customer_phone || appt.guest_phone || "";
  const canAct = !TERMINAL.has(appt.status);
  const durationMins = appointmentDurationMinutes(appt.start_time, appt.end_time);
  const durationLabel = formatAppointmentDuration(durationMins);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 text-muted-foreground"
          nativeButton={false}
          render={<Link href="/orders?tab=bookings" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Button>
        <div className="flex flex-wrap gap-2">
          {canAct && appt.status === "pending" ? (
            <Button
              size="sm"
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
            >
              <Check className="h-4 w-4" />
              Confirm
            </Button>
          ) : null}
          {canAct ? (
            <Button size="sm" onClick={() => setCompleteOpen(true)}>
              <Check className="h-4 w-4" />
              Complete
            </Button>
          ) : null}
          {canAct ? (
            <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
              <DialogTrigger
                render={
                  <Button size="sm" variant="outline">
                    <CalendarClock className="h-4 w-4" />
                    Reschedule
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reschedule</DialogTitle>
                  <DialogDescription>Pick a new date and time slot.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => {
                        setRescheduleDate(e.target.value);
                        setRescheduleSlot("");
                      }}
                    />
                  </div>
                  {rescheduleDate ? (
                    <div className="flex flex-wrap gap-2">
                      {(availability?.slots ?? []).map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          size="sm"
                          variant={rescheduleSlot === slot ? "default" : "outline"}
                          onClick={() => setRescheduleSlot(slot)}
                        >
                          {formatAppointmentTime(slot)}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                  <Button
                    disabled={!rescheduleSlot || rescheduleMutation.isPending}
                    onClick={() => rescheduleMutation.mutate(rescheduleSlot)}
                  >
                    Save new time
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : null}
          {canAct ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => noShowMutation.mutate()}
              disabled={noShowMutation.isPending}
            >
              <UserX className="h-4 w-4" />
              No-show
            </Button>
          ) : null}
          {canAct ? (
            <>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => cancelMutation.mutate({})}
                disabled={cancelMutation.isPending}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => cancelMutation.mutate({ byCustomer: true })}
                disabled={cancelMutation.isPending}
                title="Apply customer cancellation policy (may forfeit deposit)"
              >
                Customer cancel
              </Button>
            </>
          ) : null}
          {appt.invoice_id ? (
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/invoices/${appt.invoice_id}`} />}
            >
              <FileText className="h-4 w-4" />
              View invoice
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <AppointmentStatusBadge status={appt.status} />
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {durationLabel}
                </span>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {formatAppointmentDate(appt.start_time)}
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {formatAppointmentTime(appt.start_time)} – {formatAppointmentTime(appt.end_time)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Scissors className="h-4 w-4 text-primary" />
                  {appt.service_name}
                </span>
                <span className="font-semibold tabular-nums">
                  {formatMoney(appt.service_price, appt.currency)}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              nativeButton={false}
              render={<Link href={`/inventory/${appt.service_id}`} />}
            >
              View service
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailSection title="Contact" icon={User}>
          <div className="space-y-2">
            <p className="font-medium text-base">{displayName}</p>
            {contactPhone ? (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {contactPhone}
              </a>
            ) : (
              <p className="text-muted-foreground italic">No phone number</p>
            )}
            {appt.customer_email ? (
              <a
                href={`mailto:${appt.customer_email}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {appt.customer_email}
              </a>
            ) : null}
            {appt.customer_id ? (
              <Button
                variant="link"
                className="h-auto p-0 mt-1"
                nativeButton={false}
                render={<Link href={`/customers/${appt.customer_id}`} />}
              >
                View customer profile
              </Button>
            ) : null}
          </div>
        </DetailSection>

        <AppointmentReminderSection appt={appt} />

        <DetailSection title="Sales & accounting" icon={Receipt}>
          <div className="space-y-2">
            {appt.sale_id ? (
              <>
                <p className="text-muted-foreground">
                  {appt.status === "completed"
                    ? "Recorded in Sales and posted to Accounts when you marked this booking complete."
                    : "Pending sale in Sales — revenue posts to Accounts when you complete the appointment."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  nativeButton={false}
                  render={<Link href={`/sales/${appt.sale_id}`} />}
                >
                  <Receipt className="h-4 w-4" />
                  View sale
                </Button>
              </>
            ) : appt.status === "cancelled_by_customer" ||
              appt.status === "cancelled_by_business" ||
              appt.status === "no_show" ? (
              <p className="text-muted-foreground italic">No sale — booking was cancelled.</p>
            ) : (
              <p className="text-muted-foreground italic">
                Sale record will appear when the booking is synced.
              </p>
            )}
            {appt.invoice_id ? (
              <Button
                variant="link"
                className="h-auto p-0"
                nativeButton={false}
                render={<Link href={`/invoices/${appt.invoice_id}`} />}
              >
                View invoice
              </Button>
            ) : null}
          </div>
        </DetailSection>

        <DetailSection title="Payment" icon={Calendar}>
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Service price</span>
              <span className="font-medium tabular-nums">
                {formatMoney(appt.service_price, appt.currency)}
              </span>
            </div>
            {appt.deposit_required > 0 ? (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Deposit required</span>
                <span className="tabular-nums">
                  {formatMoney(appt.deposit_required, appt.currency)}
                </span>
              </div>
            ) : null}
            {(appt.deposit_paid ?? 0) > 0 ? (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Deposit paid</span>
                  <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatMoney(appt.deposit_paid, appt.currency)}
                  </span>
                </div>
                {appt.deposit_method ? (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Deposit method</span>
                    <span className="font-medium">
                      {paymentMethodMeta(appt.deposit_method)?.label ?? appt.deposit_method}
                    </span>
                  </div>
                ) : null}
                {appt.service_price - appt.deposit_paid > 0.01 ? (
                  <div className="flex justify-between gap-4 border-t pt-2">
                    <span className="text-muted-foreground">Balance at visit</span>
                    <span className="font-medium tabular-nums">
                      {formatMoney(appt.service_price - appt.deposit_paid, appt.currency)}
                    </span>
                  </div>
                ) : null}
              </>
            ) : appt.deposit_required <= 0 ? (
              <p className="text-muted-foreground text-xs">No deposit collected yet</p>
            ) : (
              <p className="text-muted-foreground text-xs">Deposit not yet paid</p>
            )}
            {(appt.deposit_forfeited ?? 0) > 0 ? (
              <>
                <Separator className="my-2" />
                <p className="text-destructive text-xs">
                  Late cancellation — deposit forfeited:{" "}
                  {formatMoney(appt.deposit_forfeited ?? 0, appt.currency)}
                </p>
              </>
            ) : null}
          </div>
        </DetailSection>

        <DetailSection title="Customer notes" icon={StickyNote}>
          <p className={appt.notes ? undefined : "text-muted-foreground italic"}>
            {appt.notes || "None provided"}
          </p>
        </DetailSection>

        <DetailSection title="Internal notes" icon={StickyNote} className="lg:col-span-2">
          <div className="space-y-3">
            <Textarea
              value={internalNotes || appt.internal_notes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Staff-only notes — not visible to the customer"
              rows={3}
            />
            <Button
              size="sm"
              variant="outline"
              disabled={
                notesMutation.isPending ||
                (internalNotes || appt.internal_notes) === appt.internal_notes
              }
              onClick={() => notesMutation.mutate(internalNotes || appt.internal_notes)}
            >
              Save internal notes
            </Button>
          </div>
        </DetailSection>
      </div>

      <CompleteAppointmentDialog
        appointment={appt}
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        onCompleted={() => invalidate()}
      />

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground space-y-1">
          <p>
            Booked {formatDate(appt.created_at)}
            {appt.updated_at !== appt.created_at
              ? ` · Updated ${formatDate(appt.updated_at)}`
              : ""}
          </p>
          {appt.completed_at ? <p>Completed {formatDate(appt.completed_at)}</p> : null}
          {appt.cancelled_at ? (
            <p>
              Cancelled {formatDate(appt.cancelled_at)}
              {appt.cancel_reason ? ` — ${appt.cancel_reason}` : ""}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
