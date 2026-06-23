"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bell,
  CalendarClock,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  Save,
  Scale,
  ShieldOff,
  Timer,
} from "lucide-react";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import {
  buildCancellationPolicyPreview,
  type CancelLateAction,
} from "@/components/features/appointments/cancellation-policy-preview";
import { SectionLoader } from "@/components/shared/page-loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/shared/spinner";
import { cn } from "@/lib/utils";

const LATE_ACTION_LABELS: Record<CancelLateAction, string> = {
  forfeit_deposit: "Forfeit deposit (non-refundable)",
  fixed_fee: "Fixed cancellation fee",
  none: "No penalty",
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </Link>
  );
}

export function AppointmentsSettingsForm() {
  const queryClient = useQueryClient();
  const { currency } = useDefaultCurrency();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["appointments-settings"],
    queryFn: appointmentsApi.settings.get,
    retry: 1,
  });

  const [buffer, setBuffer] = useState(0);
  const [timeout, setTimeout] = useState(30);
  const [reminderCustomer, setReminderCustomer] = useState(true);
  const [reminderCustomerEmail, setReminderCustomerEmail] = useState(false);
  const [reminderOwner, setReminderOwner] = useState(false);
  const [cancelWindow, setCancelWindow] = useState(24);
  const [cancelAction, setCancelAction] = useState<CancelLateAction>("forfeit_deposit");
  const [cancelFee, setCancelFee] = useState(0);

  useEffect(() => {
    if (!data) return;
    setBuffer(data.buffer_mins);
    setTimeout(data.pending_timeout_mins);
    setReminderCustomer(data.reminder_customer);
    setReminderCustomerEmail(data.reminder_customer_email);
    setReminderOwner(data.reminder_owner);
    const cp = data.cancellation_policy;
    if (cp) {
      setCancelWindow(cp.window_hours);
      setCancelAction(cp.late_action as CancelLateAction);
      setCancelFee(cp.fee_amount);
    }
  }, [data]);

  const policyPreview = useMemo(
    () => buildCancellationPolicyPreview(cancelWindow, cancelAction, cancelFee, currency),
    [cancelWindow, cancelAction, cancelFee, currency]
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      appointmentsApi.settings.update({
        buffer_mins: buffer,
        pending_timeout_mins: timeout,
        reminder_customer: reminderCustomer,
        reminder_customer_email: reminderCustomerEmail,
        reminder_owner: reminderOwner,
        cancel_window_hours: cancelWindow,
        cancel_late_action: cancelAction,
        cancel_fee_amount: cancelFee,
      }),
    onSuccess: () => {
      toast.success("Appointment settings saved");
      queryClient.invalidateQueries({ queryKey: ["appointments-settings"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <SectionLoader />;

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load appointment settings. Ensure the Appointments module is enabled and the API
        is running, then reload the page.
      </p>
    );
  }

  const storefrontPath = data?.storefront_path ?? "/p/your-slug";
  const bookingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${storefrontPath}/book`
      : `${storefrontPath}/book`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      toast.success("Booking link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="space-y-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" />
              Public booking
            </CardTitle>
            <CardDescription>
              Share your storefront booking page — customers book without an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-xl border bg-muted/25 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Booking link
              </p>
              <code className="block break-all text-sm font-medium">{bookingUrl}</code>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={copyLink}>
                <Copy className="h-3.5 w-3.5" />
                Copy link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                nativeButton={false}
                render={
                  <a href={bookingUrl} target="_blank" rel="noreferrer" />
                }
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open booking page
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={storefrontPath} target="_blank" />}
              >
                View storefront
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <SectionHeading
              icon={Scale}
              title="Cancellation policy"
              description="Shown during public booking. Late cancels can forfeit deposits automatically."
            />
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cancel_window">Free cancel window (hours)</Label>
                <Input
                  id="cancel_window"
                  type="number"
                  min={0}
                  max={168}
                  className="h-11"
                  value={cancelWindow}
                  onChange={(e) => setCancelWindow(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Hours before the appointment. Use 0 + “No penalty” to disable.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Late cancellation</Label>
                <Select
                  value={cancelAction}
                  onValueChange={(v) => {
                    if (v) setCancelAction(v as CancelLateAction);
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(LATE_ACTION_LABELS) as CancelLateAction[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {LATE_ACTION_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {cancelAction === "fixed_fee" ? (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="cancel_fee">Cancellation fee ({currency})</Label>
                <Input
                  id="cancel_fee"
                  type="number"
                  min={0}
                  step={0.01}
                  className="h-11"
                  value={cancelFee}
                  onChange={(e) => setCancelFee(Number(e.target.value))}
                />
              </div>
            ) : null}

            <div
              className={cn(
                "rounded-xl border p-4 text-sm",
                policyPreview.enabled
                  ? "border-amber-200/80 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20"
                  : "bg-muted/30"
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Customer will see
              </p>
              <p className="leading-relaxed text-foreground/90">{policyPreview.text}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <SectionHeading
              icon={Timer}
              title="Scheduling rules"
              description="Gap between bookings and how long deposit checkouts stay open."
            />
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buffer">Buffer between appointments (min)</Label>
                <Input
                  id="buffer"
                  type="number"
                  min={0}
                  max={120}
                  className="h-11"
                  value={buffer}
                  onChange={(e) => setBuffer(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Extra gap after each booking before the next slot opens.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Deposit checkout timeout (min)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min={5}
                  max={1440}
                  className="h-11"
                  value={timeout}
                  onChange={(e) => setTimeout(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Pending bookings expire if deposit is not paid in time.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <QuickLink
                href="/settings/hours"
                icon={Clock}
                label="Business hours"
                description="When you are open for bookings"
              />
              <QuickLink
                href="/appointments/schedule"
                icon={ShieldOff}
                label="Block time"
                description="Lunch, holidays, days off"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <SectionHeading
              icon={Bell}
              title="Booking reminders"
              description="Notify customers before their appointment. SMS uses Hubtel on the server."
            />
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/15 p-3">
              <Checkbox
                checked={reminderCustomer}
                onCheckedChange={(v) => setReminderCustomer(v === true)}
              />
              <span className="text-sm leading-snug">
                <span className="font-medium">SMS to customer</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Automatic SMS at 9:00 AM the day before each confirmed booking. You can also send
                  manually from a booking&apos;s detail page.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/15 p-3">
              <Checkbox
                checked={reminderCustomerEmail}
                onCheckedChange={(v) => setReminderCustomerEmail(v === true)}
              />
              <span className="text-sm leading-snug">
                <span className="font-medium">Email to customer</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Save your preference now — automatic email delivery is coming soon. Requires a
                  customer email on the booking.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/15 p-3">
              <Checkbox
                checked={reminderOwner}
                onCheckedChange={(v) => setReminderOwner(v === true)}
              />
              <span className="text-sm leading-snug">
                <span className="font-medium">SMS to you (owner)</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  SMS 1 hour before each booking
                </span>
              </span>
            </label>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">At a glance</CardTitle>
            <CardDescription>Current rules after you save.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cancellation
              </p>
              <p className="mt-1 font-medium">
                {policyPreview.enabled
                  ? `${cancelWindow}h free window`
                  : "No policy (anytime cancel)"}
              </p>
              {policyPreview.enabled ? (
                <p className="text-xs text-muted-foreground">
                  Late: {LATE_ACTION_LABELS[cancelAction]}
                </p>
              ) : null}
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Scheduling
              </p>
              <p className="mt-1 text-muted-foreground">
                {buffer} min buffer · {timeout} min deposit timeout
              </p>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Reminders
              </p>
              <p className="mt-1 text-muted-foreground">
                SMS {reminderCustomer ? "on" : "off"} · Email {reminderCustomerEmail ? "on" : "off"}{" "}
                · You {reminderOwner ? "on" : "off"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-2">
          <Button
            className="w-full gap-2"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save settings
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            nativeButton={false}
            render={<Link href="/appointments" />}
          >
            <CalendarClock className="h-4 w-4" />
            Open calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
