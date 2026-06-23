"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuditPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => adminApi.audit(),
  });

  const logs = data?.logs ?? [];

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Platform admin actions — module toggles, business updates, tickets."
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : logs.length === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-8 w-8" />}
              title="No audit entries yet"
              description="Actions you take in admin will appear here."
            />
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="px-5 py-3 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="font-mono text-[10px]">{log.action}</Badge>
                    <span className="text-muted-foreground text-xs">
                      {log.actor_name} · {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {log.target_type && `${log.target_type}: `}{log.target_id}
                    {log.ip_address && ` · ${log.ip_address}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
