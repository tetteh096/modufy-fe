"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoader } from "@/components/shared/page-loader";
import { SettingsSection } from "@/components/features/settings/settings-section";
import { AuditEventList } from "@/components/features/audit/audit-event-list";
import { Button } from "@/components/ui/button";
import { businessApi } from "@/lib/api";

const PAGE_SIZE = 50;

export default function ActivitySettingsPage() {
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["audit-events", limit],
    queryFn: () => businessApi.team.listAuditEvents({ limit, offset: 0 }),
  });

  if (isLoading && !data) {
    return <PageLoader />;
  }

  const events = data?.events ?? [];
  const total = data?.total ?? 0;
  const hasMore = events.length < total;

  return (
    <>
      <PageHeader
        title="Activity log"
        description="See who did what across your business — team changes, sales, invoices, and sign-ins."
      />

      <SettingsSection
        icon={ScrollText}
        title="Recent activity"
        description={
          total > 0
            ? `${total.toLocaleString()} event${total === 1 ? "" : "s"} recorded`
            : "Events are recorded automatically when your team uses BizOS."
        }
      >
        {error ? (
          <p className="text-sm text-destructive">
            Could not load activity. You may need permission to view the business log.
          </p>
        ) : (
          <>
            <AuditEventList events={events} />
            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
                >
                  {isFetching ? "Loading…" : "Load older events"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </SettingsSection>
    </>
  );
}
