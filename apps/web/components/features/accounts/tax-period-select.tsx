"use client";

import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTaxPeriod, taxPeriodOptions } from "@/lib/tax-utils";
import { cn } from "@/lib/utils";

type TaxPeriodSelectProps = {
  value: string;
  onChange: (period: string) => void;
  className?: string;
};

export function TaxPeriodSelect({ value, onChange, className }: TaxPeriodSelectProps) {
  const options = taxPeriodOptions();

  return (
    <div className={cn("flex flex-col gap-1 sm:items-end", className)}>
      <Select value={value} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger
          size="sm"
          className="h-8 w-full sm:w-[11rem] gap-1.5 text-xs font-medium shadow-sm border-border/70 bg-background/90"
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="max-h-64">
          {options.map((p) => (
            <SelectItem key={p} value={p} className="text-xs">
              {formatTaxPeriod(p)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[11px] text-muted-foreground">{formatTaxPeriod(value)}</p>
    </div>
  );
}
