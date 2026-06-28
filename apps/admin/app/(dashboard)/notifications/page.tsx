"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, MessageSquare, Radio } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/shared/page-header";
import { SectionLoader } from "@/components/shared/page-loader";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChannelFilter = "" | "email" | "sms";
type StatusFilter = "" | "queued" | "sent" | "delivered" | "failed";

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

export default function NotificationsPage() {
  const [channel, setChannel] = useState<ChannelFilter>("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-notifications", channel, status, page],
    queryFn: () =>
      adminApi.notifications({
        channel: channel || undefined,
        status: status || undefined,
        page,
        limit: 50,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification log"
        description="Immutable audit of every email and SMS sent through the platform."
      />

      <div className="flex flex-wrap gap-2">
        <FilterGroup
          label="Channel"
          options={[
            { key: "", label: "All" },
            { key: "email", label: "Email", icon: Mail },
            { key: "sms", label: "SMS", icon: MessageSquare },
          ]}
          value={channel}
          onChange={(v) => {
            setChannel(v as ChannelFilter);
            setPage(1);
          }}
        />
        <FilterGroup
          label="Status"
          options={[
            { key: "", label: "All" },
            { key: "queued", label: "Queued" },
            { key: "sent", label: "Sent" },
            { key: "delivered", label: "Delivered" },
            { key: "failed", label: "Failed" },
          ]}
          value={status}
          onChange={(v) => {
            setStatus(v as StatusFilter);
            setPage(1);
          }}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <SectionLoader className="py-12" />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Radio className="h-8 w-8" />}
              title="No notification events yet"
              description="Sends and delivery updates will appear here as tenants use email and SMS."
            />
          ) : (
            <div className="divide-y">
              {items.map((item) => {
                const ChannelIcon = item.channel === "sms" ? MessageSquare : Mail;
                return (
                  <div key={item.id} className="px-5 py-3 text-sm space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {item.channel}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.action}
                      </Badge>
                      <Badge variant={statusVariant(item.status)} className="text-[10px] capitalize">
                        {item.status}
                      </Badge>
                      {item.sandbox && (
                        <Badge variant="secondary" className="text-[10px]">
                          sandbox
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium">
                      {item.subject || item.event_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      To {item.recipient}
                      {item.business_name ? ` · ${item.business_name}` : ""}
                      {item.provider ? ` · ${item.provider}` : ""}
                    </p>
                    {item.error_message && (
                      <p className="text-xs text-destructive">{item.error_message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Page {page} of {totalPages} · {total} events
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
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

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; label: string; icon?: React.ElementType }[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-muted-foreground mr-1">{label}</span>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key || "all"}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
            )}
          >
            {Icon ? <Icon className="h-3 w-3" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
