"use client";

import { useMemo } from "react";
import {
  Calendar,
  Crown,
  Mail,
  Shield,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ROLE_META: Record<
  string,
  { label: string; description: string; badge: string; icon: typeof Crown }
> = {
  owner: {
    label: "Owner",
    description: "Full access, billing, and team management",
    badge: "bg-primary/10 text-primary border-primary/20",
    icon: Crown,
  },
  manager: {
    label: "Manager",
    description: "Day-to-day operations without owner-only settings",
    badge: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
    icon: Shield,
  },
  staff: {
    label: "Staff",
    description: "Limited access to assigned areas",
    badge: "bg-muted text-muted-foreground border-border",
    icon: UserRound,
  },
};

function roleMeta(role: string) {
  const key = role?.toLowerCase() || "staff";
  return ROLE_META[key] ?? {
    label: role || "Member",
    description: "Team member on this account",
    badge: "bg-muted text-muted-foreground border-border",
    icon: UserRound,
  };
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} mo ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

const AVATAR_TINTS = [
  "bg-primary/15 text-primary",
  "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
];

function UserCard({
  name,
  email,
  role,
  active,
  createdAt,
  isOwner,
  index,
}: {
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  isOwner: boolean;
  index: number;
}) {
  const meta = roleMeta(role);
  const RoleIcon = meta.icon;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-4 transition-shadow",
        isOwner ? "border-primary/25 bg-primary/[0.03] shadow-sm" : "bg-card",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
            AVATAR_TINTS[index % AVATAR_TINTS.length],
          )}
        >
          {initials || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-sm">{name || "Unnamed"}</h3>
            {!active && (
              <Badge variant="outline" className="h-5 text-[10px] text-muted-foreground">
                Inactive
              </Badge>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Mail className="h-3 w-3 shrink-0" />
            {email}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={cn("gap-1 text-[10px] capitalize", meta.badge)}>
          <RoleIcon className="h-3 w-3" />
          {meta.label}
        </Badge>
        {isOwner && (
          <Badge className="h-5 bg-primary/10 text-[10px] text-primary hover:bg-primary/10">
            Account owner
          </Badge>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{meta.description}</p>

      <div className="mt-4 flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        Joined {new Date(createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        <span className="text-muted-foreground/50">·</span>
        {timeAgo(createdAt)}
      </div>
    </div>
  );
}

export function BusinessTeamPanel() {
  const { business } = useBusinessWorkspace();

  const stats = useMemo(() => {
    if (!business) return null;
    const users = business.users;
    const active = users.filter((u) => u.active).length;
    const owners = users.filter((u) => u.role?.toLowerCase() === "owner").length;
    const managers = users.filter((u) => u.role?.toLowerCase() === "manager").length;
    return { total: users.length, active, owners, managers };
  }, [business]);

  if (!business || !stats) return null;

  const sortedUsers = [...business.users].sort((a, b) => {
    const rank = (r: string) => {
      const k = r?.toLowerCase();
      if (k === "owner") return 0;
      if (k === "manager") return 1;
      return 2;
    };
    return rank(a.role) - rank(b.role) || new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const ownerEmail = business.owner_email?.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Team size</p>
              <p className="text-xl font-semibold tabular-nums">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active users</p>
              <p className="text-xl font-semibold tabular-nums">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Owners</p>
              <p className="text-xl font-semibold tabular-nums">{stats.owners}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-5 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Managers</p>
              <p className="text-xl font-semibold tabular-nums">{stats.managers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owner contact card */}
      {business.owner_email && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent p-4 sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Primary contact
          </p>
          <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{business.owner_name || "Account owner"}</p>
              <p className="text-sm text-muted-foreground">{business.owner_email}</p>
            </div>
            <Badge className="mt-2 w-fit bg-primary/10 text-primary hover:bg-primary/10 sm:mt-0">
              Billing & admin contact
            </Badge>
          </div>
        </div>
      )}

      {/* Role legend */}
      <div className="rounded-xl border bg-muted/20 px-4 py-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Role permissions</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {Object.entries(ROLE_META).map(([key, meta]) => (
            <span key={key} className="flex items-center gap-1.5">
              <meta.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium text-foreground">{meta.label}</span>
              — {meta.description}
            </span>
          ))}
        </div>
      </div>

      {/* User cards */}
      <section>
        <h2 className="mb-3 text-sm font-semibold">All team members</h2>
        {sortedUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
            No users on this account yet.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sortedUsers.map((u, i) => (
              <UserCard
                key={u.id}
                name={u.name}
                email={u.email}
                role={u.role}
                active={u.active}
                createdAt={u.created_at}
                isOwner={u.email?.toLowerCase() === ownerEmail || u.role?.toLowerCase() === "owner"}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        User invites and role changes are managed by the merchant in their app settings. Platform admins can view team composition here for support and billing context.
      </p>
    </div>
  );
}
