"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Settings } from "lucide-react";
import { businessApi } from "@/lib/api";
import {
  SETTINGS_BUSINESS_NAV,
  SETTINGS_MODULE_NAV,
} from "@/lib/settings-nav";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { useUIStore } from "@/store/ui";
import { getSidebarCollapsible } from "@/lib/layout-settings";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

/**
 * Settings area sidebar — same primitives as AppSidebar.
 * Reuse this pattern for per-module settings shells later.
 */
export function SettingsSidebar() {
  const sidebarSize = useUIStore((s) => s.sidebarSize);
  const collapsible = getSidebarCollapsible(sidebarSize);
  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
    staleTime: 60_000,
  });
  const { data: modulesData } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });

  const enabledModules = new Set(
    (modulesData?.modules ?? []).filter((m) => m.enabled).map((m) => m.module)
  );

  return (
    <Sidebar variant="sidebar" collapsible={collapsible} className="border-r border-sidebar-border">
      <SidebarHeader className="flex items-center p-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <Link
          href="/settings/general"
          className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:rounded-xl">
            <Settings className="h-4 w-4 text-primary-foreground group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight block truncate">
              Settings
            </span>
            {business?.name && (
              <span className="text-xs text-muted-foreground block truncate">
                {business.name}
              </span>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider">
            Business
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_BUSINESS_NAV.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  matchPrefix={item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_MODULE_NAV.map((item) => {
                const enabled = item.module
                  ? enabledModules.has(item.module)
                  : true;
                return (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    matchPrefix={item.href}
                    badge={
                      <Badge
                        variant={enabled ? "default" : "secondary"}
                        className="ml-auto text-[10px] px-1.5 py-0 h-4 group-data-[collapsible=icon]:hidden"
                      >
                        {enabled ? "On" : "Off"}
                      </Badge>
                    }
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <SidebarMenu>
          <SidebarNavItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Back to app"
          />
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
