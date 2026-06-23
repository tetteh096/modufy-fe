"use client";

import { useBusinessModules } from "@/hooks/use-business-modules";

export function useAiModule() {
  const { enabledModules, isLoading } = useBusinessModules();
  return {
    isAiEnabled: enabledModules.has("ai"),
    isLoading,
  };
}
