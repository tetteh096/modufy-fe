"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck, LayoutDashboard, LayoutGrid, Users, Settings,
  LifeBuoy, CalendarClock, ScrollText, Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminUserMenu } from "@/components/layout/admin-user-menu";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Businesses", href: "/businesses", icon: LayoutGrid },
  { label: "Tickets", href: "/tickets", icon: LifeBuoy },
  { label: "Demos", href: "/demos", icon: CalendarClock },
  { label: "Audit", href: "/audit", icon: ScrollText },
  { label: "Notifications", href: "/notifications", icon: Radio },
  { label: "Team", href: "/admins", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <ShieldCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-foreground">Modufy Admin</p>
          <p className="text-[10px] text-sidebar-foreground/50">Platform control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary/20 font-medium text-sidebar-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border py-3">
        <AdminUserMenu variant="sidebar" />
      </div>
    </aside>
  );
}
