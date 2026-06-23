"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import {
  ACCOUNTS_PERIOD_OPTIONS,
  type AccountsPeriodFilter,
} from "@/lib/accounts-period-range";
import { cn } from "@/lib/utils";

type AccountsPeriodSelectProps = {
  value: AccountsPeriodFilter;
  onChange: (value: AccountsPeriodFilter) => void;
  className?: string;
};

export function AccountsPeriodSelect({
  value,
  onChange,
  className,
}: AccountsPeriodSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AccountsPeriodFilter)}>
      <SelectTrigger
        size="sm"
        className={cn(
          "h-8 w-[9.5rem] gap-1.5 text-xs font-medium shadow-sm",
          "border-border/70 bg-background/90 backdrop-blur-sm",
          className
        )}
      >
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[9.5rem]">
        {ACCOUNTS_PERIOD_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
