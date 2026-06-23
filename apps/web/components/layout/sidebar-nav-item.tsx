"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type SidebarNavItemConfig = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Highlight when pathname matches this prefix (e.g. /settings) */
  matchPrefix?: string;
};

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  badge,
  disabled,
  matchPrefix,
}: SidebarNavItemConfig) {
  const pathname = usePathname();
  const prefix = matchPrefix ?? href;
  const isActive =
    pathname === prefix ||
    pathname.startsWith(prefix + "/") ||
    (!matchPrefix && pathname === href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={disabled ? undefined : <Link href={href} />}
        isActive={isActive}
        className={cn(
          "rounded-lg transition-colors duration-150",
          disabled && "pointer-events-none opacity-50",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
        tooltip={label}
      >
        <Icon className="sidebar-nav-icon shrink-0" />
        <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
        {badge}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
