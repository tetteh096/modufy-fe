"use client";

import Link from "next/link";
import { Mail, Settings, ShieldCheck, Users } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { PageHeader } from "@/components/shared/page-header";
import { AdminSignOutButton } from "@/components/layout/admin-user-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AccountPage() {
  const { user } = useAdminStore();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader
        title="My account"
        description="Your platform admin profile and session."
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-5">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 min-w-0 flex-1 sm:mt-0">
              <h2 className="text-xl font-semibold tracking-tight">{user?.name ?? "Admin"}</h2>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user?.email ?? "—"}</span>
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Platform administrator
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-2 pt-6 sm:grid-cols-2">
          <Button variant="outline" className="justify-start gap-2" render={<Link href="/settings" />}>
            <Settings className="h-4 w-4" />
            Platform settings
          </Button>
          <Button variant="outline" className="justify-start gap-2" render={<Link href="/admins" />}>
            <Users className="h-4 w-4" />
            Manage team
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-muted-foreground">End your admin session on this device.</p>
          </div>
          <AdminSignOutButton className="w-full sm:w-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
