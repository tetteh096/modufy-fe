"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Lock, Search, Settings2, UserRound } from "lucide-react";
import { businessApi } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { notificationHref } from "@/lib/attention-constants";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";
import { useLockStore } from "@/store/lock";
import { useUIStore } from "@/store/ui";
import { BackToAppLink } from "@/components/layout/back-to-app-link";
import { BranchSwitcher } from "@/components/features/branches/branch-switcher";
import { TopBarQuickNav } from "@/components/layout/top-bar-quick-nav";
import { AiAssistSheet } from "@/components/features/ai/ai-assist-sheet";
import { cn } from "@/lib/utils";
import { glassBar } from "@/lib/glass-styles";

function NotificationBell() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => businessApi.notifications.list(20),
    refetchInterval: 60_000,
  });

  const { data: attention } = useQuery({
    queryKey: ["attention"],
    queryFn: () => businessApi.attention.list(),
    refetchInterval: 120_000,
  });

  const markRead = useMutation({
    mutationFn: businessApi.notifications.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = data?.unread_count ?? 0;
  const items = data?.notifications ?? [];
  const attentionCount = attention?.count ?? 0;
  const showBadge = unread > 0 || attentionCount > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
          />
        }
      >
        <Bell className="h-4 w-4" />
        {showBadge && (
          <span
            className={cn(
              "absolute top-1 right-1 h-2 w-2 rounded-full",
              unread > 0 ? "bg-destructive" : "bg-amber-500"
            )}
          />
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between gap-2">
            <span>Notifications</span>
            {attentionCount > 0 && (
              <Link href="/alerts" className="text-[10px] font-normal text-primary hover:underline">
                {attentionCount} need attention
              </Link>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-4 text-sm text-muted-foreground text-center">
            {attentionCount > 0 ? "No new notifications — see attention items on dashboard" : "All caught up"}
          </p>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              render={<Link href={notificationHref(n.event)} />}
              className={cn("flex flex-col items-start gap-0.5 py-2", !n.read && "bg-muted/50")}
              onClick={() => !n.read && markRead.mutate(n.id)}
            >
              <span className="font-medium text-sm">{n.title}</span>
              {n.body && <span className="text-xs text-muted-foreground line-clamp-2">{n.body}</span>}
              <span className="text-[10px] text-muted-foreground">{formatDate(n.created_at)}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const inSettings = pathname.startsWith("/settings");
  const { user } = useAuthStore();
  const lock = useLockStore((s) => s.lock);
  const setThemeSettingsOpen = useUIStore((s) => s.setThemeSettingsOpen);
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header
      data-slot="app-topbar"
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 border-b px-3 md:px-4 sticky top-0 z-10 transition-[background-color,color,border-color]",
        glassBar
      )}
    >
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-4" />

      {inSettings && (
        <>
          <BackToAppLink compact className="hidden sm:inline-flex" />
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
        </>
      )}

      {!inSettings && <TopBarQuickNav />}

      <div className="flex flex-1 items-center justify-end gap-0.5">
        {!inSettings && <BranchSwitcher className="hidden sm:inline-flex mr-1" />}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        <NotificationBell />

        <AiAssistSheet />

        <Button
          variant="outline"
          size="icon"
          className="topbar-action-btn h-8 w-8 shrink-0"
          onClick={() => setThemeSettingsOpen(true)}
          title="Theme settings"
        >
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Theme settings</span>
        </Button>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            }
          >
            <Avatar className="h-8 w-8 pointer-events-none">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {user && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem render={<Link href="/account" />} nativeButton={false}>
              <UserRound className="h-4 w-4" />
              My account
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings/general" />} nativeButton={false}>
              Business settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                lock(pathname);
                router.push("/lock-screen");
              }}
            >
              <Lock className="h-4 w-4" />
              Lock screen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => router.push("/logout")}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
