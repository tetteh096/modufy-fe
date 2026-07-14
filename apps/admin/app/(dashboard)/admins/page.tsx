"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { data: team, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => adminApi.team(),
  });

  return (
    <div>
      <PageHeader
        title="Platform team"
        description="Modufy staff with admin access. Invite flow coming in Phase 2."
      />
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : !team?.length ? (
            <EmptyState
              icon={<ShieldCheck className="h-8 w-8" />}
              title="No admin users"
              description="Run go run ./cmd/superadmin to create the first super_admin."
            />
          ) : (
            <div className="divide-y">
              {team.map((m) => (
                <div key={m.user_id} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                  </div>
                  <Badge variant="secondary">{m.platform_role}</Badge>
                  {!m.active && <Badge variant="destructive">inactive</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
