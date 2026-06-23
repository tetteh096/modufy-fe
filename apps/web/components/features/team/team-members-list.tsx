"use client";

import Link from "next/link";
import { ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
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
    <div className="grid gap-4">
      {members.map((m) => {
        const isOwner = m.roles.includes("owner");
        const contact = m.email || m.phone || "Signed-in account";

        return (
          <div
            key={m.id}
            className={cn(
              "group relative flex items-stretch gap-2 rounded-xl border border-border/70 bg-background",
              "transition-shadow hover:shadow-md hover:border-border",
            )}
          >
            <Link
              href={memberHref(m.id)}
              className="flex flex-1 items-center gap-5 min-w-0 px-5 py-5 sm:px-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl font-semibold">
                {m.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0 grid gap-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-semibold text-lg leading-tight">{m.name}</p>
                  {m.roles.map((r) => (
                    <TeamRoleBadge key={r} role={r} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground truncate">{contact}</p>
                {m.last_seen_at && (
                  <p className="text-xs text-muted-foreground/80">
                    Last seen {formatActivityTime(m.last_seen_at)}
                  </p>
                )}
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors self-center" />
            </Link>

            {!isOwner && (
              <div className="flex items-center pr-3 sm:pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0"
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
