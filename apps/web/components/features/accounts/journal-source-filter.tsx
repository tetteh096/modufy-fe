"use client";

import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOURNAL_SOURCE_OPTIONS,
  type JournalSourceFilter,
} from "@/lib/journal-constants";
import { cn } from "@/lib/utils";

type JournalSourceFilterSelectProps = {
  value: JournalSourceFilter;
  onChange: (value: JournalSourceFilter) => void;
  className?: string;
};

export function JournalSourceFilterSelect({
  value,
  onChange,
  className,
}: JournalSourceFilterSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as JournalSourceFilter)}>
      <SelectTrigger
        size="sm"
        className={cn(
          "h-8 w-[9.5rem] gap-1.5 text-xs font-medium shadow-sm border-border/70 bg-background/90",
          className
        )}
      >
        <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {JOURNAL_SOURCE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
