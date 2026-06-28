"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Settings,
  Building2,
  Circle,
  CircleDot,
  ClipboardList,
  Mail,
} from "lucide-react";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { AlertsSidebarNavItem } from "@/components/layout/alerts-sidebar-nav-item";
import { ModulesSidebarMenuItems } from "@/components/layout/modules-sidebar-group";
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
import { cn } from "@/lib/utils";

const mainNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Messages", href: "/communications", icon: Mail },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Sales", href: "/sales", icon: ShoppingCart },
  { label: "Expenses", href: "/expenses", icon: CreditCard },
];

export function AppSidebar() {
  const sidebarSize = useUIStore((s) => s.sidebarSize);
  const sidebarHoverPinned = useUIStore((s) => s.sidebarHoverPinned);
  const toggleSidebarHoverPinned = useUIStore((s) => s.toggleSidebarHoverPinned);
  const collapsible = getSidebarCollapsible(sidebarSize);

  return (
    <Sidebar variant="sidebar" collapsible={collapsible} className="border-r border-sidebar-border">
      <SidebarHeader className="relative flex items-center px-3 py-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        {sidebarSize === "hover" && (
          <button
            type="button"
            onClick={toggleSidebarHoverPinned}
            className={cn(
              "absolute right-3 top-4 z-10 hidden text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground md:block",
              "group-data-[collapsible=icon]:block"
            )}
            aria-label={sidebarHoverPinned ? "Unpin sidebar" : "Pin sidebar open"}
            title={sidebarHoverPinned ? "Unpin sidebar" : "Pin sidebar open"}
          >
            {sidebarHoverPinned ? (
              <CircleDot className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Modufy
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNav.map((item) => (
                <SidebarNavItem key={item.href} {...item} />
              ))}
              <AlertsSidebarNavItem />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/45">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <ModulesSidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <SidebarMenu>
          <SidebarNavItem
            href="/settings/general"
            matchPrefix="/settings"
            icon={Settings}
            label="Settings"
          />
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
