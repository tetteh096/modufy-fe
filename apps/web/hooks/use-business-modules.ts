"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";

export function useBusinessModules() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
  });

  const enabledModules = useMemo(
    () => new Set(data?.modules.filter((m) => m.enabled).map((m) => m.module) ?? []),
    [data],
  );

  return {
    isLoading,
    isFetching,
    isMarketplaceEnabled: enabledModules.has("marketplace"),
    isAppointmentsEnabled: enabledModules.has("appointments"),
    enabledModules,
  };
}
