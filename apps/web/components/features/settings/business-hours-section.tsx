"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Sparkles } from "lucide-react";
import { businessApi, getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { SettingsStickyFooter } from "@/components/features/settings/settings-sticky-footer";
import { StorefrontHoursList } from "@/components/features/storefront/storefront-hours";
import type { BusinessHoursDay } from "@/types/api";
import {
  DAY_NAMES,
  formatDayHours,
  sortedHours,
} from "@/lib/storefront-hours";
import { cn } from "@/lib/utils";

interface BusinessHoursSectionProps {
  initialHoursEnabled: boolean;
  initialShowHours: boolean;
  initialHours: BusinessHoursDay[];
}

function SettingsToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        checked ? "border-border/70 bg-background" : "border-dashed border-border/60 bg-muted/15",
        disabled && "opacity-60",
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex items-center gap-3 self-start sm:self-center disabled:cursor-not-allowed"
      >
        <span className="text-xs font-medium text-muted-foreground">{checked ? "On" : "Off"}</span>
        <span
          aria-hidden
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors",
            checked ? "border-primary/40 bg-primary" : "border-border/80 bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
              checked ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </span>
      </button>
    </div>
  );
}

function DayHoursRow({
  day,
  onChange,
}: {
  day: BusinessHoursDay;
  onChange: (patch: Partial<BusinessHoursDay>) => void;
}) {
  const open = !day.is_closed;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        open ? "border-border/70 bg-background" : "border-dashed border-border/60 bg-muted/15",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium">{DAY_NAMES[day.day_of_week]}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {open ? formatDayHours(day) : "Closed all day"}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={open}
          aria-label={`${DAY_NAMES[day.day_of_week]} open`}
          onClick={() => onChange({ is_closed: open })}
          className="flex items-center gap-3 self-start sm:self-center"
        >
          <span className="text-xs font-medium text-muted-foreground">{open ? "Open" : "Closed"}</span>
          <span
            aria-hidden
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors",
              open ? "border-primary/40 bg-primary" : "border-border/80 bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
                open ? "translate-x-5" : "translate-x-0.5",
              )}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="mt-4 grid gap-3 border-t border-border/50 pt-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor={`open-${day.day_of_week}`} className="text-xs font-medium text-muted-foreground">
              Opens
            </label>
            <Input
              id={`open-${day.day_of_week}`}
              type="time"
              value={day.open_time}
              onChange={(e) => onChange({ open_time: e.target.value })}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`close-${day.day_of_week}`} className="text-xs font-medium text-muted-foreground">
              Closes
            </label>
            <Input
              id={`close-${day.day_of_week}`}
              type="time"
              value={day.close_time}
              onChange={(e) => onChange({ close_time: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BusinessHoursSection({
  initialHoursEnabled,
  initialShowHours,
  initialHours,
}: BusinessHoursSectionProps) {
  const queryClient = useQueryClient();
  const [hoursEnabled, setHoursEnabled] = useState(initialHoursEnabled);
  const [showHours, setShowHours] = useState(initialShowHours);
  const [hours, setHours] = useState<BusinessHoursDay[]>(initialHours);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setHoursEnabled(initialHoursEnabled);
    setShowHours(initialShowHours);
    setHours(initialHours);
    setDirty(false);
  }, [initialHoursEnabled, initialShowHours, initialHours]);

  const saveMutation = useMutation({
    mutationFn: businessApi.updateHours,
    onSuccess: (updated) => {
      toast.success("Business hours saved");
      queryClient.setQueryData(["business"], updated);
      setDirty(false);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function markDirty() {
    setDirty(true);
  }

  function updateDay(index: number, patch: Partial<BusinessHoursDay>) {
    setHours((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    markDirty();
  }

  const sorted = useMemo(() => sortedHours(hours), [hours]);
  const openDays = sorted.filter((d) => !d.is_closed).length;

  function handleSave() {
    saveMutation.mutate({
      hours_enabled: hoursEnabled,
      show_hours: hoursEnabled ? showHours : false,
      ...(hoursEnabled ? { hours } : {}),
    });
  }

  function handleDiscard() {
    setHoursEnabled(initialHoursEnabled);
    setShowHours(initialShowHours);
    setHours(initialHours);
    setDirty(false);
  }

  return (
    <div className="space-y-5">
      <SettingsSection
        title="Opening hours"
        icon={Clock}
        description="Optional — leave off to accept orders and bookings around the clock"
      >
        <SettingsToggle
          label="Use opening hours"
          description="When off, your storefront and appointment booking run 24/7 with no closed periods."
          checked={hoursEnabled}
          onChange={(v) => {
            setHoursEnabled(v);
            if (!v) setShowHours(false);
            markDirty();
          }}
        />

        <SettingsToggle
          label="Show hours on storefront"
          description="Closed/open banner at the top of your site and hours on the contact page."
          checked={showHours}
          disabled={!hoursEnabled}
          onChange={(v) => {
            setShowHours(v);
            markDirty();
          }}
        />

        {!hoursEnabled ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/15 px-4 py-3">
            <p className="text-sm font-medium">Open 24/7</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Customers can place orders and book services at any time. Turn on opening hours above
              when you want to limit orders and appointment slots to specific times.
            </p>
          </div>
        ) : null}
      </SettingsSection>

      {hoursEnabled ? (
        <SettingsSection
          title="Weekly schedule"
          icon={Clock}
          description="Controls appointment time slots and when customers can order on your storefront"
        >
          <div className="rounded-xl border border-border/70 bg-muted/15 px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Service bookings only offer times within these hours. Product orders are accepted while
              you&apos;re open. Closed days show no appointment slots.
            </p>
          </div>

          <div className="space-y-3">
            {sorted.map((day) => {
              const idx = hours.findIndex((h) => h.day_of_week === day.day_of_week);
              return (
                <DayHoursRow
                  key={day.day_of_week}
                  day={day}
                  onChange={(patch) => updateDay(idx, patch)}
                />
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Storefront preview
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background p-4">
              <p className="mb-3 text-xs text-muted-foreground">
                {openDays} open day{openDays === 1 ? "" : "s"} per week
                {showHours ? " — visible on your storefront when the banner is on." : " — hidden until you enable the storefront banner."}
              </p>
              <StorefrontHoursList hours={sorted} compact />
            </div>
          </div>
        </SettingsSection>
      ) : null}

      <SettingsStickyFooter>
        <Button type="button" variant="outline" disabled={!dirty} onClick={handleDiscard}>
          Discard
        </Button>
        <Button type="button" disabled={!dirty || saveMutation.isPending} onClick={handleSave}>
          {saveMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
          Save changes
        </Button>
      </SettingsStickyFooter>
    </div>
  );
}
