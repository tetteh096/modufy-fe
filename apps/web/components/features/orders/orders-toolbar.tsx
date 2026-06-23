"use client";

import { Search, X } from "lucide-react";
import { PeriodFilterTabs } from "@/components/shared/period-filter-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PeriodFilter } from "@/lib/period-range";

type OrdersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  period: PeriodFilter;
  onPeriodChange: (value: PeriodFilter) => void;
};

export function OrdersToolbar({
  search,
  onSearchChange,
  period,
  onPeriodChange,
}: OrdersToolbarProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 md:p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, phone, product, service…"
            className="pl-9 pr-9"
          />
          {search ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        <PeriodFilterTabs value={period} onChange={onPeriodChange} />
      </CardContent>
    </Card>
  );
}
