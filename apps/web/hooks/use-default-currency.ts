"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";

/** Business default currency from settings (falls back to GHS while loading). */
export function useDefaultCurrency() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
    staleTime: 60_000,
  });

  return {
    currency: business?.default_currency ?? "GHS",
    business,
    isLoading,
  };
}
