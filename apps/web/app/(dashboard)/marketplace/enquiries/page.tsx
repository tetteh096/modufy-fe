"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Inbox, Mail, Phone, User } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceEnquiry } from "@/types/api";
import { cn } from "@/lib/utils";

function EnquiryCard({ enquiry }: { enquiry: MarketplaceEnquiry }) {
  const queryClient = useQueryClient();
  const isNew = enquiry.status === "new";

  const readMutation = useMutation({
    mutationFn: () => marketplaceApi.enquiries.markRead(enquiry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-summary"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card className={cn(isNew && "border-primary/40 bg-primary/[0.02]")}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-sm flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {enquiry.name}
              </p>
              {isNew ? (
                <Badge className="text-xs border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  New
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Read
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {enquiry.phone}
              </span>
              {enquiry.email ? (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {enquiry.email}
                </span>
              ) : null}
            </div>

            {enquiry.subject ? (
              <p className="text-sm font-medium">{enquiry.subject}</p>
            ) : null}

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{enquiry.message}</p>
          </div>

          <p className="text-xs text-muted-foreground shrink-0">
            {new Date(enquiry.created_at).toLocaleString()}
          </p>
        </div>

        {isNew ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => readMutation.mutate()}
            disabled={readMutation.isPending}
          >
            Mark as read
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function MarketplaceEnquiriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-enquiries"],
    queryFn: () => marketplaceApi.enquiries.list(),
  });

  const enquiries = data?.enquiries ?? [];
  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Enquiries"
        description="Messages from your storefront contact form"
        action={
          newCount > 0 ? (
            <Badge className="border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {newCount} new
            </Badge>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : enquiries.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No enquiries yet"
          description="When customers send a message from your contact page, it will show up here."
        />
      ) : (
        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <EnquiryCard key={enquiry.id} enquiry={enquiry} />
          ))}
        </div>
      )}
    </div>
  );
}
