"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTaxPeriod } from "@/lib/tax-utils";

type TaxFiledBannerProps = {
  period: string;
  filedAt?: string;
  onMarkFiled: () => void;
  marking?: boolean;
};

export function TaxFiledBanner({ period, filedAt, onMarkFiled, marking }: TaxFiledBannerProps) {
  if (filedAt) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3.5">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm font-medium text-foreground">
          VAT return filed for {formatTaxPeriod(period)} on{" "}
          {new Date(filedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <Clock className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Not yet filed for {formatTaxPeriod(period)}
        </p>
      </div>
      <Button
        size="sm"
        onClick={onMarkFiled}
        disabled={marking}
        className="gap-1.5 shrink-0 h-8"
      >
        <CheckCircle2 className="h-4 w-4" />
        {marking ? "Marking…" : "Mark as filed"}
      </Button>
    </div>
  );
}
