"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { MultiCurrencySection } from "@/components/features/settings/multi-currency-section";

export default function CurrencySettingsPage() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  if (isLoading || !business) return <SectionLoader />;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Currency"
        description="Default currency for totals, plus currencies you accept"
      />
      <MultiCurrencySection
        defaultCurrency={business.default_currency}
        displayMode={(business.display_currency_mode ?? "default") as "default" | "transaction"}
        exchangeMode={(business.exchange_rate_mode ?? "auto") as "auto" | "manual"}
        currencies={business.currencies ?? []}
      />
    </div>
  );
}
