"use client";

import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PNL_DATE_PRESETS,
  formatPnlPeriod,
  pnlDateRange,
  type PnlDatePreset,
} from "@/lib/pnl-date-range";
import { cn } from "@/lib/utils";

type PnlDateToolbarProps = {
  from: string;
  to: string;
  preset: PnlDatePreset | "custom";
  onPresetChange: (preset: PnlDatePreset) => void;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
  className?: string;
};

export function PnlDateToolbar({
  from,
  to,
  preset,
  onPresetChange,
  onFromChange,
  onToChange,
  className,
}: PnlDateToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:items-end", className)}>
      <Select
        value={preset}
        onValueChange={(v) => {
          if (v === "custom") return;
          onPresetChange(v as PnlDatePreset);
        }}
      >
        <SelectTrigger
          size="sm"
          className="h-8 w-full sm:w-[10.5rem] gap-1.5 text-xs font-medium shadow-sm border-border/70 bg-background/90"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent align="end">
          {PNL_DATE_PRESETS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
          <SelectItem value="custom" className="text-xs">
            Custom range
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-wrap items-end gap-2 w-full sm:justify-end">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">From</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="h-8 w-[9.5rem] text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">To</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="h-8 w-[9.5rem] text-xs"
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground text-right w-full">
        {formatPnlPeriod(from, to)}
      </p>
    </div>
  );
}