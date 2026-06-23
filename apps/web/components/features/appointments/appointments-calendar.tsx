"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventClickArg, EventInput, EventHoveringArg } from "@fullcalendar/core";
import { CalendarClock, Clock, List, Plus, ShieldOff } from "lucide-react";
import { appointmentsApi } from "@/lib/api";
import { formatCalendarRangeLabel } from "@/components/features/appointments/appointment-range-label";
import {
  AppointmentEventPreview,
  type AppointmentHoverAnchor,
} from "@/components/features/appointments/appointment-event-preview";
import { AppointmentsList } from "@/components/features/appointments/appointments-list";
import type {
  AppointmentStatusFilter,
  CalendarView,
} from "@/components/features/appointments/appointments-calendar-types";
import { formatAppointmentTime } from "@/components/features/appointments/appointment-status";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Appointment, AppointmentStatus } from "@/types/api";
import "./appointments-calendar.css";

const VIEW_OPTIONS: { id: CalendarView; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "today", label: "Day" },
  { id: "list", label: "List" },
];

const FC_VIEW: Record<Exclude<CalendarView, "list">, string> = {
  month: "dayGridMonth",
  week: "timeGridWeek",
  today: "timeGridDay",
};

const LEGEND_DOT: Partial<Record<AppointmentStatus | "all" | "blocked", string>> = {
  all: "var(--foreground)",
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  in_progress: "#8b5cf6",
  completed: "var(--primary)",
  no_show: "var(--destructive)",
  blocked: "var(--muted-foreground)",
};

const EVENT_CLASS: Partial<Record<AppointmentStatus, string>> = {
  pending: "appt-ev-pending",
  confirmed: "appt-ev-confirmed",
  in_progress: "appt-ev-in_progress",
  completed: "appt-ev-completed",
  no_show: "appt-ev-no_show",
};

const FILTER_OPTIONS: Array<{ id: AppointmentStatusFilter; label: string }> = [
  { id: "all", label: "All bookings" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
  { id: "no_show", label: "No-show" },
];

function parseView(raw: string | null): CalendarView {
  if (raw === "week" || raw === "today" || raw === "list" || raw === "month") return raw;
  return "month";
}

function parseStatusFilter(raw: string | null): AppointmentStatusFilter {
  if (!raw || raw === "all") return "all";
  if (FILTER_OPTIONS.some((o) => o.id === raw)) return raw as AppointmentStatusFilter;
  return "all";
}

function toRangeISO(start: Date, end: Date) {
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  };
}

function toDayKey(iso: string) {
  return iso.split("T")[0];
}

function shortEventTitle(a: Appointment) {
  const who = a.customer_name || a.guest_name || a.guest_phone || "Guest";
  return `${who} — ${a.service_name}`;
}

function compactEventTitle(a: Appointment) {
  const who = a.customer_name || a.guest_name || a.guest_phone || "Guest";
  return who;
}

const PREVIEW_SHOW_MS = 120;
const PREVIEW_HIDE_MS = 450;

export function AppointmentsCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const calendarRef = useRef<FullCalendar>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewHovered = useRef(false);
  const previewPinned = useRef(false);

  const activeView = parseView(searchParams.get("view"));
  const isListView = activeView === "list";

  const [statusFilter, setStatusFilter] = useState<AppointmentStatusFilter>(() =>
    parseStatusFilter(searchParams.get("status"))
  );

  useEffect(() => {
    setStatusFilter(parseStatusFilter(searchParams.get("status")));
  }, [searchParams]);
  const [hover, setHover] = useState<AppointmentHoverAnchor | null>(null);
  const [pickDate, setPickDate] = useState(() => searchParams.get("date") ?? "");
  const [visibleStart, setVisibleStart] = useState<Date | null>(null);
  const [visibleEnd, setVisibleEnd] = useState<Date | null>(null);
  const [range, setRange] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return toRangeISO(start, end);
  });

  const setView = useCallback(
    (view: CalendarView) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", view);
      if (view !== "list") {
        params.delete("page");
        params.delete("pageSize");
        params.delete("from");
        params.delete("to");
      }
      router.replace(`/appointments?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const urlDate = searchParams.get("date");

  const jumpToDate = useCallback(
    (dateStr: string, opts?: { view?: CalendarView }) => {
      if (!dateStr) return;
      const api = calendarRef.current?.getApi();
      if (api) api.gotoDate(dateStr);

      setPickDate(dateStr);
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", dateStr);
      if (opts?.view) params.set("view", opts.view);
      router.replace(`/appointments?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (isListView) return;
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(FC_VIEW[activeView]);
    if (urlDate) {
      api.gotoDate(urlDate);
      setPickDate(urlDate);
    } else if (activeView === "today") {
      const today = new Date().toISOString().split("T")[0];
      api.gotoDate(today);
      setPickDate(today);
    }
  }, [activeView, isListView, urlDate]);

  const onDatesSet = useCallback((arg: DatesSetArg) => {
    setVisibleStart(arg.start);
    setVisibleEnd(arg.end);
    setRange(toRangeISO(arg.start, arg.end));
    const api = calendarRef.current?.getApi();
    if (api) {
      setPickDate(api.getDate().toISOString().split("T")[0]);
    }
  }, []);

  const rangeLabel = useMemo(() => {
    if (!visibleStart || !visibleEnd || isListView) return null;
    return formatCalendarRangeLabel(visibleStart, visibleEnd, activeView);
  }, [visibleStart, visibleEnd, activeView, isListView]);

  const { data: apptData, isLoading: apptsLoading, isFetching: apptsFetching } = useQuery({
    queryKey: ["appointments", "calendar", range.from, range.to, statusFilter],
    queryFn: () =>
      appointmentsApi.calendar({
        from: range.from,
        to: `${range.to}T23:59:59Z`,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    enabled: !isListView,
  });

  const { data: blockedData, isLoading: blockedLoading } = useQuery({
    queryKey: ["appointments", "blocked", range.from, range.to],
    queryFn: () =>
      appointmentsApi.blocked.list({
        from: range.from,
        to: `${range.to}T23:59:59Z`,
      }),
    enabled: !isListView,
  });

  const appointments = apptData?.appointments ?? [];
  const todayKey = new Date().toISOString().split("T")[0];

  const todayAgenda = useMemo(
    () =>
      appointments
        .filter((a) => toDayKey(a.start_time) === todayKey)
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .slice(0, 5),
    [appointments, todayKey]
  );

  const events = useMemo<EventInput[]>(() => {
    const appts = appointments.map((a) => ({
      id: a.id,
      title: shortEventTitle(a),
      start: a.start_time,
      end: a.end_time,
      classNames: [EVENT_CLASS[a.status] ?? "appt-ev-default", "appt-ev-clickable"],
      extendedProps: {
        type: "appointment" as const,
        status: a.status,
        appointment: a,
        shortTitle: compactEventTitle(a),
      },
    }));

    const blocked = (blockedData?.blocked ?? []).map((b) => ({
      id: `blocked-${b.id}`,
      title: b.reason ? `Blocked — ${b.reason}` : "Blocked",
      start: b.start_time,
      end: b.end_time,
      classNames: ["appt-ev-blocked"],
      display: "background" as const,
      extendedProps: { type: "blocked" as const },
    }));

    return [...blocked, ...appts];
  }, [appointments, blockedData]);

  const clearShowTimer = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  };

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHidePreview = useCallback(() => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => {
      if (!previewHovered.current) {
        setHover(null);
      }
    }, PREVIEW_HIDE_MS);
  }, []);

  const openPreview = useCallback(
    (appointment: Appointment, el: HTMLElement, pinned = false) => {
      clearShowTimer();
      clearHideTimer();
      previewPinned.current = pinned;
      setHover({ appointment, rect: el.getBoundingClientRect(), pinned });
    },
    []
  );

  const onEventMouseEnter = useCallback(
    (info: EventHoveringArg) => {
      if (info.event.extendedProps.type !== "appointment") return;
      const appointment = info.event.extendedProps.appointment as Appointment;
      clearHideTimer();
      clearShowTimer();
      showTimer.current = setTimeout(() => {
        openPreview(appointment, info.el as HTMLElement, false);
      }, PREVIEW_SHOW_MS);
    },
    [openPreview]
  );

  const onEventMouseLeave = useCallback(
    (_info: EventHoveringArg) => {
      clearShowTimer();
      if (previewPinned.current) return;
      scheduleHidePreview();
    },
    [scheduleHidePreview]
  );

  const onPreviewEnter = useCallback(() => {
    previewHovered.current = true;
    clearHideTimer();
  }, []);

  const onPreviewLeave = useCallback(() => {
    previewHovered.current = false;
    if (previewPinned.current) return;
    scheduleHidePreview();
  }, [scheduleHidePreview]);

  const closePreview = useCallback(() => {
    clearShowTimer();
    clearHideTimer();
    previewHovered.current = false;
    previewPinned.current = false;
    setHover(null);
  }, []);

  const onEventClick = useCallback(
    (info: EventClickArg) => {
      if (info.event.extendedProps.type !== "appointment") return;
      const appointment = info.event.extendedProps.appointment as Appointment;
      info.jsEvent.preventDefault();
      openPreview(appointment, info.el as HTMLElement, true);
    },
    [openPreview]
  );

  const onDateClick = useCallback(
    (info: { dateStr: string; view: { type: string } }) => {
      if (info.view.type === "dayGridMonth") {
        jumpToDate(info.dateStr, { view: "today" });
        return;
      }
      router.push(`/appointments/new?date=${info.dateStr}`);
    },
    [jumpToDate, router]
  );

  const onStatusFilter = (id: AppointmentStatusFilter) => {
    setStatusFilter(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") params.delete("status");
    else params.set("status", id);
    if (isListView) {
      params.set("view", "list");
      params.set("page", "1");
    }
    router.replace(`/appointments?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearShowTimer();
      clearHideTimer();
    };
  }, [closePreview]);

  const isLoading = !isListView && (apptsLoading || blockedLoading);
  const isRefreshing = !isListView && apptsFetching && !apptsLoading;

  const contentHeight =
    activeView === "month" ? 580 : activeView === "week" ? 640 : 600;

  return (
    <div className="grid gap-4 xl:grid-cols-[17rem_1fr] 2xl:grid-cols-[19rem_1fr]">
      {hover ? (
        <AppointmentEventPreview
          anchor={hover}
          onPointerEnter={onPreviewEnter}
          onPointerLeave={onPreviewLeave}
          onClose={closePreview}
        />
      ) : null}

      <div className="space-y-4">
        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base">Schedule</CardTitle>
            <CardDescription>Book customers or block time on your calendar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <Button className="w-full" nativeButton={false} render={<Link href="/appointments/new" />}>
              <Plus className="h-4 w-4" />
              New booking
            </Button>
            <Button
              className="w-full"
              variant="outline"
              nativeButton={false}
              render={<Link href="/appointments/schedule" />}
            >
              <ShieldOff className="h-4 w-4" />
              Block time
            </Button>
            <p className="pt-1 text-xs text-muted-foreground">
              {isListView
                ? "List shows all bookings earliest first. Use date filters in the table."
                : "Pick a date to jump · click a day in month view to open that day."}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-sm font-semibold">Status filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0.5 pt-3">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={cn("appt-cal-legend-btn", statusFilter === opt.id && "is-active")}
                onClick={() => onStatusFilter(opt.id)}
              >
                <span
                  className="appt-cal-legend-dot"
                  style={{ background: LEGEND_DOT[opt.id] }}
                />
                {opt.label}
              </button>
            ))}
            {!isListView ? (
              <button type="button" className="appt-cal-legend-btn" disabled>
                <span
                  className="appt-cal-legend-dot border border-border bg-muted"
                  style={{ background: "transparent" }}
                />
                <span className="text-muted-foreground">Blocked periods</span>
              </button>
            ) : null}
          </CardContent>
        </Card>

        {!isListView ? (
          <Card size="sm">
            <CardHeader className="border-b pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="h-4 w-4 text-primary" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-3">
              {isLoading ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="h-3.5 w-3.5" />
                  Loading…
                </div>
              ) : todayAgenda.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nothing booked for today.</p>
              ) : (
                todayAgenda.map((a) => (
                  <Link
                    key={a.id}
                    href={`/appointments/${a.id}`}
                    className="appt-cal-agenda-item"
                    title="Open appointment details"
                  >
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {formatAppointmentTime(a.start_time)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.service_name}</p>
                    <p className="truncate text-xs font-medium">
                      {a.customer_name || a.guest_name || a.guest_phone || "Guest"}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="relative p-4 sm:p-5">
          <div className="appt-cal-toolbar">
            <div className="appt-cal-view-tabs">
              {VIEW_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={cn("appt-cal-view-tab", activeView === opt.id && "is-active")}
                  onClick={() => setView(opt.id)}
                >
                  {opt.id === "list" ? <List className="h-3.5 w-3.5" /> : null}
                  {opt.label}
                </button>
              ))}
            </div>

            {!isListView ? (
              <div className="appt-cal-jump">
                <Label htmlFor="appt-jump-date" className="appt-cal-jump-label">
                  Go to date
                </Label>
                <Input
                  id="appt-jump-date"
                  type="date"
                  className="appt-cal-jump-input"
                  value={pickDate}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPickDate(v);
                    if (v) jumpToDate(v);
                  }}
                />
              </div>
            ) : null}
          </div>

          {!isListView && rangeLabel ? (
            <div className="appt-cal-range-banner">
              <span className="appt-cal-range-label">
                {activeView === "week" ? "Week" : activeView === "today" ? "Day" : "Month"}
              </span>
              <span className="appt-cal-range-value">{rangeLabel}</span>
            </div>
          ) : null}

          {isListView ? (
            <AppointmentsList statusFilter={statusFilter} />
          ) : (
            <>
              {isRefreshing ? (
                <div className="absolute right-5 top-28 z-10 flex items-center gap-1.5 rounded-full border bg-background/95 px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
                  <Spinner className="h-3 w-3" />
                  Updating
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex min-h-[32rem] items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                    <Spinner className="h-6 w-6" />
                    Loading calendar…
                  </div>
                </div>
              ) : (
                <div className="appointments-calendar min-h-[32rem]">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={FC_VIEW[activeView as Exclude<CalendarView, "list">]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    buttonText={{
                      today: "Today",
                    }}
                    views={{
                      dayGridMonth: {
                        dayMaxEvents: 3,
                        moreLinkClick: "popover",
                      },
                      timeGridWeek: {
                        slotDuration: "00:30:00",
                        slotEventOverlap: false,
                        eventMinHeight: 28,
                        titleFormat: { month: "short", day: "numeric", year: "numeric" },
                      },
                      timeGridDay: {
                        slotDuration: "00:30:00",
                        slotEventOverlap: false,
                        eventMinHeight: 28,
                        titleFormat: {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      },
                    }}
                    slotEventOverlap={false}
                    eventOverlap
                    height="auto"
                    contentHeight={contentHeight}
                    events={events}
                    datesSet={onDatesSet}
                    eventClick={onEventClick}
                    eventMouseEnter={onEventMouseEnter}
                    eventMouseLeave={onEventMouseLeave}
                    dateClick={(info) => onDateClick(info)}
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    allDaySlot={false}
                    nowIndicator
                    stickyHeaderDates
                    displayEventTime
                    eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
                    dayHeaderFormat={{ weekday: "short", month: "short", day: "numeric" }}
                    titleFormat={{ month: "long", year: "numeric" }}
                    eventContent={(arg) => {
                      if (arg.event.extendedProps.type !== "appointment") return undefined;
                      const shortTitle =
                        (arg.event.extendedProps.shortTitle as string) || arg.event.title;
                      const wrap = document.createElement("div");
                      wrap.className = "appt-fc-event-chip";
                      if (arg.timeText) {
                        const timeEl = document.createElement("span");
                        timeEl.className = "appt-fc-event-chip-time";
                        timeEl.textContent = arg.timeText;
                        wrap.appendChild(timeEl);
                      }
                      const nameEl = document.createElement("span");
                      nameEl.className = "appt-fc-event-chip-name";
                      nameEl.textContent = shortTitle;
                      wrap.appendChild(nameEl);
                      return { domNodes: [wrap] };
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
