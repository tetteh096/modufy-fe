"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";
import { APP_MODULE_NAV } from "@/lib/app-module-nav";
import { ModuleCollapsibleSidebarNav } from "@/components/layout/module-collapsible-sidebar-nav";

function EnabledModulesNav() {
  return (
    <>
      {APP_MODULE_NAV.map((config) => (
        <ModuleCollapsibleSidebarNav key={config.key} config={config} />
      ))}
    </>
  );
}

export function ModulesSidebarMenuItems() {
  const { data: modulesData } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });

  const enabledModules = new Set(
    (modulesData?.modules ?? []).filter((m) => m.enabled).map((m) => m.module)
  );

  const enabled = APP_MODULE_NAV.filter((m) => enabledModules.has(m.key));
  if (enabled.length === 0) return null;

  return (
    <Suspense fallback={null}>
      {enabled.map((config) => (
        <ModuleCollapsibleSidebarNav key={config.key} config={config} />
      ))}
    </Suspense>
  );
}
