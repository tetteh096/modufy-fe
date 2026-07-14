"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquare } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { useBusinessWorkspace } from "@/components/features/admin/business-workspace-context";
import { BusinessWorkspacePageHeader } from "@/components/features/admin/business-workspace-shell";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ChannelFilter = "" | "email" | "sms";

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "delivered":
      return "default";
    case "failed":
      return "destructive";
    case "queued":
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
}

export default function BusinessNotificationsPage() {
  const { businessId } = useBusinessWorkspace();
  const [channel, setChannel] = useState<ChannelFilter>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications", businessId, channel, page],
    queryFn: () =>
      adminApi.notifications({
        business_id: businessId,
        channel: channel || undefined,
        page,
        limit: 50,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div>
      <BusinessWorkspacePageHeader
        title="Communications"
        description="Email and SMS delivery log for this tenant."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "", label: "All", icon: undefined },
            { key: "email", label: "Email", icon: Mail },
            { key: "sms", label: "SMS", icon: MessageSquare },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <Button
            key={key || "all"}
            size="sm"
            variant={channel === key ? "default" : "outline"}
            onClick={() => {
              setChannel(key);
              setPage(1);
            }}
          >
            {Icon && <Icon className="mr-1 h-3.5 w-3.5" />}
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Mail className="h-8 w-8" />}
              title="No messages yet"
              description="Emails and SMS sent for this business will appear here."
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-3.5 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {item.channel}
                    </Badge>
                    <Badge variant={statusVariant(item.status)} className="text-[10px]">
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.event_type}</span>
                    {item.sandbox && (
                      <Badge variant="secondary" className="text-[10px]">
                        sandbox
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 font-medium">{item.recipient}</p>
                  {item.subject && (
                    <p className="text-xs text-muted-foreground">{item.subject}</p>
                  )}
                  {item.error_message && (
                    <p className="mt-1 text-xs text-destructive">{item.error_message}</p>
                  )}
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
