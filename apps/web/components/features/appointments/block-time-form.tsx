"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarOff,
  Clock,
  Coffee,
  Palmtree,
  Plus,
  ShieldOff,
  Trash2,
} from "lucide-react";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { combineDateAndTime } from "@/components/features/appointments/booking-datetime";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/components/features/appointments/appointment-status";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const REASON_PRESETS = [
  { label: "Lunch break", icon: Coffee },
  { label: "Holiday", icon: Palmtree },
  { label: "Closed", icon: CalendarOff },
  { label: "Time off", icon: ShieldOff },
] as const;

const schema = z
  .object({
    start_date: z.string().min(1, "Start date required"),
    start_time: z.string().min(1, "Start time required"),
    end_date: z.string().min(1, "End date required"),
    end_time: z.string().min(1, "End time required"),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(combineDateAndTime(data.start_date, data.start_time));
    const end = new Date(combineDateAndTime(data.end_date, data.end_time));
    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        message: "End must be after start",
        path: ["end_time"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function formatDuration(startIso: string, endIso: string) {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs < 24) return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "1 day" : `${days} days`;
}

export function BlockTimeForm() {
  const queryClient = useQueryClient();
  const listFrom = todayISO();
  const listToDate = new Date();
  listToDate.setMonth(listToDate.getMonth() + 3);
  const listTo = listToDate.toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: todayISO(),
      start_time: "12:00",
      end_date: todayISO(),
      end_time: "13:00",
      reason: "Lunch break",
    },
  });

  const startDate = form.watch("start_date");
  const startTime = form.watch("start_time");
  const endDate = form.watch("end_date");
  const endTime = form.watch("end_time");
  const reason = form.watch("reason");

  const preview = useMemo(() => {
    if (!startDate || !startTime || !endDate || !endTime) return null;
    try {
      const startIso = combineDateAndTime(startDate, startTime);
      const endIso = combineDateAndTime(endDate, endTime);
      const valid = new Date(endIso) > new Date(startIso);
      return {
        startIso,
        endIso,
        valid,
        duration: valid ? formatDuration(startIso, endIso) : null,
        startLabel: `${formatAppointmentDate(startIso)} · ${formatAppointmentTime(startIso)}`,
        endLabel: `${formatAppointmentDate(endIso)} · ${formatAppointmentTime(endIso)}`,
      };
    } catch {
      return null;
    }
  }, [startDate, startTime, endDate, endTime]);

  const { data, isLoading } = useQuery({
    queryKey: ["blocked-time", listFrom, listTo],
    queryFn: () =>
      appointmentsApi.blocked.list({ from: listFrom, to: `${listTo}T23:59:59Z` }),
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) =>
      appointmentsApi.blocked.create({
        start_time: combineDateAndTime(values.start_date, values.start_time),
        end_time: combineDateAndTime(values.end_date, values.end_time),
        reason: values.reason?.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Time blocked on your calendar");
      form.reset({
        start_date: todayISO(),
        start_time: "12:00",
        end_date: todayISO(),
        end_time: "13:00",
        reason: "",
      });
      queryClient.invalidateQueries({ queryKey: ["blocked-time"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentsApi.blocked.delete(id),
    onSuccess: () => {
      toast.success("Block removed");
      queryClient.invalidateQueries({ queryKey: ["blocked-time"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const applyLunchToday = () => {
    const d = todayISO();
    form.setValue("start_date", d);
    form.setValue("end_date", d);
    form.setValue("start_time", "12:00");
    form.setValue("end_time", "13:00");
    form.setValue("reason", "Lunch break");
  };

  const applyFullDay = () => {
    const d = form.getValues("start_date") || todayISO();
    form.setValue("start_date", d);
    form.setValue("end_date", d);
    form.setValue("start_time", "00:00");
    form.setValue("end_time", "23:59");
    if (!form.getValues("reason")) form.setValue("reason", "Closed");
  };

  const blocks = data?.blocked ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}
      >
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldOff className="h-5 w-5 text-primary" />
              Block a period
            </CardTitle>
            <CardDescription>
              Customers cannot book during blocked time. Shows as stripes on your calendar.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={applyLunchToday}>
                <Coffee className="h-3.5 w-3.5" />
                Lunch today (1hr)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={applyFullDay}>
                <CalendarOff className="h-3.5 w-3.5" />
                Full day
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-xl border bg-muted/15 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Starts
                </p>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    className="h-11"
                    {...form.register("start_date")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    step={300}
                    className="h-11"
                    {...form.register("start_time")}
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border bg-muted/15 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Ends
                </p>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    className="h-11"
                    {...form.register("end_date")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    step={300}
                    className="h-11"
                    {...form.register("end_time")}
                  />
                </div>
              </div>
            </div>

            {form.formState.errors.end_time ? (
              <p className="text-sm text-destructive">{form.formState.errors.end_time.message}</p>
            ) : null}

            <div className="space-y-3">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="e.g. Lunch break, public holiday…"
                {...form.register("reason")}
              />
              <div className="flex flex-wrap gap-1.5">
                {REASON_PRESETS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      reason === label
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => form.setValue("reason", label)}
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="gap-2"
              disabled={createMutation.isPending || (preview !== null && !preview.valid)}
            >
              {createMutation.isPending ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Block time
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base">Upcoming blocks</CardTitle>
            <CardDescription>Next 3 months — tap remove to unblock.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : blocks.length === 0 ? (
              <EmptyState
                icon={<ShieldOff className="h-8 w-8" />}
                title="No blocked periods"
                description="Add lunch breaks, holidays, or days off so customers cannot book then."
              />
            ) : (
              <ul className="space-y-2">
                {blocks.map((b) => (
                  <li
                    key={b.id}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-dashed bg-muted/20 p-3.5 text-sm transition-colors hover:border-border hover:bg-muted/35"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {b.reason || "Blocked"}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatAppointmentDate(b.start_time)}
                        <span>·</span>
                        {formatAppointmentTime(b.start_time)}
                        <span>–</span>
                        {formatAppointmentTime(b.end_time)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDuration(b.start_time, b.end_time)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 opacity-70 group-hover:opacity-100"
                      onClick={() => deleteMutation.mutate(b.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="Remove block"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4 lg:sticky lg:top-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preview</CardTitle>
            <CardDescription>What will be blocked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                From
              </p>
              <p className="mt-1 font-medium">{preview?.startLabel ?? "—"}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                To
              </p>
              <p className="mt-1 font-medium">{preview?.endLabel ?? "—"}</p>
            </div>
            {preview?.duration ? (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 font-medium">{preview.duration}</p>
              </div>
            ) : null}
            {reason?.trim() ? (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reason
                </p>
                <p className="mt-1">{reason.trim()}</p>
              </div>
            ) : null}
            {preview && !preview.valid ? (
              <p className="text-xs text-destructive">End time must be after start time.</p>
            ) : null}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground leading-relaxed px-1">
          Blocked time appears on your{" "}
          <Link href="/appointments" className="font-medium text-primary underline-offset-2 hover:underline">
            appointments calendar
          </Link>{" "}
          and rejects new bookings in that window.
        </p>
      </div>
    </div>
  );
}
