"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STATUSES = ["new", "contacted", "scheduled", "converted", "lost"] as const;

export default function DemosPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-demos", filter],
    queryFn: () => adminApi.demos(filter ? { status: filter } : undefined),
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateDemo(id, { status }),
    onSuccess: () => {
      toast.success("Demo request updated");
      qc.invalidateQueries({ queryKey: ["admin-demos"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const requests = data?.requests ?? [];

  return (
    <div>
      <PageHeader
        title="Demo requests"
        description="Leads from the landing page and outreach pipeline."
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button size="sm" variant={filter === "" ? "default" : "outline"} onClick={() => setFilter("")}>
          All
        </Button>
        {STATUSES.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="h-8 w-8" />}
              title="No demo requests"
              description="Submissions from the public form appear here."
            />
          ) : (
            <div className="divide-y">
              {requests.map((r) => (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{r.name}</p>
                        <Badge variant="secondary">{r.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</p>
                      {(r.business_name || r.city) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[r.business_name, r.category, r.city].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {r.message && <p className="text-sm mt-2">{r.message}</p>}
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      {STATUSES.filter((s) => s !== r.status).slice(0, 3).map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          disabled={update.isPending}
                          onClick={() => update.mutate({ id: r.id, status: s })}
                        >
                          → {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
