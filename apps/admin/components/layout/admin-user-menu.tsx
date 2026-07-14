"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, ShieldCheck, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAdminStore } from "@/store/admin";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/shared/spinner";

export async function signOutAdmin(clearAuth: () => void) {
  try {
    await authClient.signOut();
  } catch {
    // Clear local session even if the auth server is unreachable.
  }
  clearAuth();
}

type AdminUserMenuProps = {
  variant?: "topbar" | "sidebar";
  className?: string;
};

export function AdminUserMenu({ variant = "topbar", className }: AdminUserMenuProps) {
  const router = useRouter();
  const { user, clearAuth } = useAdminStore();
  const [signingOut, setSigningOut] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await signOutAdmin(clearAuth);
    router.replace("/login");
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2.5 rounded-md px-3 py-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 px-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-sidebar-border bg-sidebar-accent/50 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
            render={<Link href="/account" />}
          >
            Account
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-sidebar-border bg-sidebar-accent/50 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={signingOut}
            onClick={() => void handleSignOut()}
          >
            {signingOut ? <Spinner className="h-3.5 w-3.5" /> : "Sign out"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 transition-colors",
              "hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              className,
            )}
          />
        }
      >
        <Avatar className="h-8 w-8 pointer-events-none">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 text-left md:block">
          <p className="truncate text-sm font-medium leading-none">{user?.name ?? "Admin"}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{user?.email}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted-foreground md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-2 py-2.5">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name ?? "Admin"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  Platform admin
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/account" />} nativeButton={false}>
          <ShieldCheck className="h-4 w-4" />
          My account
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />} nativeButton={false}>
          <Settings className="h-4 w-4" />
          Platform settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/admins" />} nativeButton={false}>
          <Users className="h-4 w-4" />
          Team
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          {signingOut ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminSignOutButton({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const router = useRouter();
  const { clearAuth } = useAdminStore();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await signOutAdmin(clearAuth);
    router.replace("/login");
  }

  return (
    <Button
      variant="destructive"
      size={size}
      className={className}
      disabled={signingOut}
      onClick={() => void handleSignOut()}
    >
      {signingOut ? <Spinner className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </Button>
  );
}
