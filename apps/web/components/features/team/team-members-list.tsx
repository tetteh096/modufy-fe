"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal, Trash2, Mail, Phone, Clock } from "lucide-react";
import { formatActivityTime } from "@/lib/team-permissions";
import type { TeamMember } from "@/types/api";
import { TeamRoleBadge } from "@/components/features/team/team-role-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function memberHref(id: string) {
  return `/settings/team/${id}`;
}

export function TeamMembersList({
  members,
  onRemove,
}: {
  members: TeamMember[];
  onRemove: (id: string) => void;
}) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No team members yet. Add someone to help run your business.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {members.map((m) => {
        const isOwner = m.roles.includes("owner");
        const contact = m.email || m.phone || "Signed-in account";

        return (
          <div
            key={m.id}
            className={cn(
              "group relative flex items-stretch gap-2 rounded-xl border border-border/70 bg-background",
              "transition-all duration-200 hover:shadow-xs hover:border-primary/20 hover:scale-[1.002]",
            )}
          >
            <Link
              href={memberHref(m.id)}
              className="flex flex-1 items-center gap-5 min-w-0 px-5 py-4.5 sm:px-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-lg font-bold border border-primary/10 shadow-3xs group-hover:scale-105 transition-transform duration-200">
                {m.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-semibold text-base leading-snug group-hover:text-primary transition-colors">{m.name}</p>
                  {m.roles.map((r) => (
                    <TeamRoleBadge key={r} role={r} />
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                    {m.email ? (
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    ) : m.phone ? (
                      <Phone className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    ) : null}
                    <span className="truncate">{contact}</span>
                  </div>

                  {m.last_seen_at && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/45 shrink-0" />
                      <span className="flex items-center gap-1.5">
                        Last seen {formatActivityTime(m.last_seen_at)}
                        <span className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          isOwner ? "bg-emerald-500 animate-pulse" : "bg-slate-350 dark:bg-slate-650"
                        )} />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/75 group-hover:text-primary group-hover:translate-x-0.5 transition-all self-center" />
            </Link>

            {!isOwner && (
              <div className="flex items-center pr-3 sm:pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                      />
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link href={memberHref(m.id)} />}>
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onRemove(m.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
