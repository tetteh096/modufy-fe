"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PERIOD_OPTIONS, type PeriodFilter } from "@/lib/period-range";

type PeriodOption = { value: PeriodFilter; label: string };

type PeriodFilterTabsProps = {
  value: PeriodFilter;
  onChange: (value: PeriodFilter) => void;
  options?: PeriodOption[];
};

export function PeriodFilterTabs({
  value,
  onChange,
  options = PERIOD_OPTIONS,
}: PeriodFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as PeriodFilter)}>
      <TabsList className="h-auto flex-wrap w-full sm:w-auto justify-start">
        {options.map((opt) => (
          <TabsTrigger key={opt.value} value={opt.value} className="text-xs sm:text-sm">
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
