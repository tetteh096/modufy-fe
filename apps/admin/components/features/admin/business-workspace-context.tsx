"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin-api";
import type { BusinessDetail } from "@/types/admin";

type BusinessWorkspaceContextValue = {
  businessId: string;
  business: BusinessDetail | undefined;
  isLoading: boolean;
  isError: boolean;
};

const BusinessWorkspaceContext = createContext<BusinessWorkspaceContextValue | null>(null);

export function BusinessWorkspaceProvider({
  businessId,
  children,
}: {
  businessId: string;
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-business", businessId],
    queryFn: () => adminApi.business(businessId),
  });

  return (
    <BusinessWorkspaceContext.Provider
      value={{ businessId, business: data, isLoading, isError }}
    >
      {children}
    </BusinessWorkspaceContext.Provider>
  );
}

export function useBusinessWorkspace() {
  const ctx = useContext(BusinessWorkspaceContext);
  if (!ctx) {
    throw new Error("useBusinessWorkspace must be used within BusinessWorkspaceProvider");
  }
  return ctx;
}
