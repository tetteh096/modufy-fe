"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";
import { SALE_CURRENCIES } from "@/lib/sales-constants";

/** Currency codes enabled for this business (from settings). */
export function useEnabledCurrencies() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
    staleTime: 60_000,
  });

  const fromSettings = (business?.currencies ?? [])
    .filter((c) => c.enabled)
    .map((c) => c.code);

  const currencies =
    fromSettings.length > 0
      ? fromSettings
      : [...SALE_CURRENCIES];

  return {
    currencies,
    defaultCurrency: business?.default_currency ?? currencies[0] ?? "GHS",
    isLoading,
  };
}
