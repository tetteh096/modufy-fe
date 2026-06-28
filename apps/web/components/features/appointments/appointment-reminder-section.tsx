"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Mail, MessageSquare, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/api";

const UPCOMING = new Set(["pending", "confirmed", "in_progress"]);

function isUpcoming(appt: Appointment) {
  if (!UPCOMING.has(appt.status)) return false;
  return new Date(appt.start_time).getTime() > Date.now();
}

type ReminderRowProps = {
  icon: React.ElementType;
  label: string;
  enabled: boolean;
  status: string;
  muted?: boolean;
};

function ReminderRow({ icon: Icon, label, enabled, status, muted }: ReminderRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background/80 p-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{label}</p>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px] font-normal border-0",
              enabled
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {enabled ? "On" : "Off"}
          </Badge>
        </div>
        <p className={cn("text-xs leading-relaxed", muted ? "text-muted-foreground italic" : "text-muted-foreground")}>
          {status}
        </p>
      </div>
    </div>
  );
}

export function AppointmentReminderSection({ appt }: { appt: Appointment }) {
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["appointments-settings"],
    queryFn: appointmentsApi.settings.get,
  });

  const sendMutation = useMutation({
    mutationFn: () => appointmentsApi.sendReminder(appt.id),
    onSuccess: () => {
      toast.success("SMS reminder sent");
      queryClient.invalidateQueries({ queryKey: ["appointment", appt.id] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const upcoming = isUpcoming(appt);
  const phone = (appt.customer_phone || appt.guest_phone || "").trim();
  const email = appt.customer_email?.trim();
  const smsEnabled = settings?.reminder_customer ?? false;
  const emailEnabled = settings?.reminder_customer_email ?? false;

  let smsStatus = "Automatic reminders are turned off in settings.";
  if (smsEnabled && upcoming) {
    if (appt.status === "pending") {
      smsStatus = "Will send after the booking is confirmed.";
    } else if (appt.reminder_sent_at) {
      smsStatus = `Sent ${formatDate(appt.reminder_sent_at)}. Automatic reminder also runs at 9:00 AM the day before.`;
    } else {
      smsStatus = "Scheduled for 9:00 AM the day before the appointment (requires Hubtel SMS).";
    }
  } else if (!upcoming) {
    smsStatus = "Not applicable for past or cancelled bookings.";
  }

  let emailStatus = "Email reminders are turned off in settings.";
  if (emailEnabled && upcoming) {
    if (!email) {
      emailStatus = "Enabled — add a customer with an email address to deliver reminders.";
    } else if (appt.reminder_sent_at) {
      emailStatus = `Sent ${formatDate(appt.reminder_sent_at)}. Automatic email also runs at 9:00 AM the day before.`;
    } else {
      emailStatus = "Scheduled for 9:00 AM the day before the appointment.";
    }
  } else if (emailEnabled && !upcoming) {
    emailStatus = "Not applicable for past or cancelled bookings.";
  }

  const canSendSms = upcoming && !!phone && (appt.status === "confirmed" || appt.status === "pending");

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5" />
          Reminders
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs"
          nativeButton={false}
          render={<Link href="/settings/appointments" />}
        >
          <Settings2 className="h-3 w-3" />
          Configure
        </Button>
      </div>

      <div className="rounded-xl border bg-muted/20 p-3 space-y-2">
        {settingsLoading ? (
          <p className="text-sm text-muted-foreground">Loading reminder settings…</p>
        ) : (
          <>
            <ReminderRow
              icon={MessageSquare}
              label="SMS to customer"
              enabled={smsEnabled}
              status={smsStatus}
            />
            <ReminderRow
              icon={Mail}
              label="Email to customer"
              enabled={emailEnabled}
              status={emailStatus}
              muted={emailEnabled && upcoming && !email}
            />
          </>
        )}

        {canSendSms ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 mt-1"
            disabled={sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
          >
            {sendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            Send SMS reminder now
          </Button>
        ) : null}

        {!phone && upcoming ? (
          <p className="text-xs text-muted-foreground pt-1">
            Add a phone number to send SMS reminders.
          </p>
        ) : null}
      </div>
    </section>
  );
}
