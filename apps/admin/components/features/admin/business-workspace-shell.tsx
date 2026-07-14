"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Package,
  Radio,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Users,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionLoader } from "@/components/shared/page-loader";
import { AdminUserMenu } from "@/components/layout/admin-user-menu";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";

export const BUSINESS_WORKSPACE_NAV = [
  { label: "Overview", segment: "", icon: LayoutDashboard },
  { label: "Modules", segment: "modules", icon: Package },
  { label: "Team", segment: "users", icon: Users },
  { label: "SMS & email", segment: "sms", icon: MessageSquare },
  { label: "AI", segment: "ai", icon: Sparkles },
  { label: "Support", segment: "support", icon: LifeBuoy },
  { label: "Notes", segment: "notes", icon: StickyNote },
  { label: "Communications", segment: "notifications", icon: Radio },
] as const;

function businessHref(id: string, segment: string) {
  return segment ? `/businesses/${id}/${segment}` : `/businesses/${id}`;
}

function isNavActive(pathname: string, id: string, segment: string) {
  const href = businessHref(id, segment);
  if (segment === "") {
    return pathname === href || pathname === `${href}/`;
  }
  return pathname.startsWith(href);
}

export function BusinessWorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { businessId, business, isLoading, isError } = useBusinessWorkspace();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <SectionLoader className="py-20" />
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm font-medium">Business not found</p>
          <Button className="mt-4" variant="outline" render={<Link href="/businesses" />}>
            Back to businesses
          </Button>
        </div>
      </div>
    );
  }

  const initials = business.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full">
      {/* Business workspace sidebar — replaces platform sidebar */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="border-b border-sidebar-border px-3 py-3">
          <Link
            href="/businesses"
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="truncate">All businesses</span>
          </Link>
        </div>

        <div className="border-b border-sidebar-border px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-sidebar-foreground">{business.name}</p>
              <p className="truncate text-[10px] text-sidebar-foreground/50">{business.owner_email}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {business.verified && (
                  <Badge className="h-4 border-0 bg-primary/20 px-1.5 text-[9px] text-sidebar-primary hover:bg-primary/20">
                    Verified
                  </Badge>
                )}
                {business.suspended && (
                  <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">
                    Suspended
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {BUSINESS_WORKSPACE_NAV.map(({ label, segment, icon: Icon }) => {
            const active = isNavActive(pathname, businessId, segment);
            return (
              <Link
                key={segment || "overview"}
                href={businessHref(businessId, segment)}
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

        <div className="border-t border-sidebar-border px-2 py-3">
          <Link
            href="/dashboard"
            className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-xs text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Platform dashboard
          </Link>
          <AdminUserMenu variant="sidebar" />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center border-b bg-background/95 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Tenant workspace</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-screen-xl p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function BusinessWorkspacePageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
