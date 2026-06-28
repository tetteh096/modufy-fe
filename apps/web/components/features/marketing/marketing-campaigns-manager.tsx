"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Megaphone, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { marketingApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChannelBadge, CampaignStatusBadge, formatDateTime } from "./marketing-shared";
import { MarketingEmailPreview } from "./marketing-email-preview";
import type { MarketingCampaign, MarketingSegment } from "@/types/api";

function SendDialog({
  campaign,
  segment,
  open,
  onOpenChange,
}: {
  campaign: MarketingCampaign;
  segment?: MarketingSegment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const { data: preview, isFetching } = useQuery({
    queryKey: ["marketing-send-preview", campaign.id, campaign.channel],
    queryFn: () => marketingApi.segments.preview(campaign.channel, segment?.rules ?? {}),
    enabled: open && Boolean(segment),
  });

  const sendMutation = useMutation({
    mutationFn: () => marketingApi.campaigns.send(campaign.id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast.success(
        `Sent to ${res.sent} ${campaign.channel === "sms" ? "numbers" : "inboxes"}` +
          (res.skipped ? `, ${res.skipped} skipped` : "")
      );
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const reachable = preview?.reachable ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={campaign.channel === "email" ? "max-w-2xl" : undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>Send &quot;{campaign.name}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            {isFetching
              ? "Checking reachable customers…"
              : `This sends a ${campaign.channel === "email" ? "newsletter" : campaign.channel.toUpperCase()} to ${reachable} reachable customer${
                  reachable === 1 ? "" : "s"
                }. Opted-out and contactless customers are skipped automatically.`}
            {campaign.channel === "sms" ? " SMS credits are charged for each message sent." : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {campaign.channel === "email" ? (
          <MarketingEmailPreview subject={campaign.subject} bodyHtml={campaign.body} />
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              sendMutation.mutate();
            }}
            disabled={sendMutation.isPending || reachable === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Send now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CampaignCard({
  campaign,
  segments,
}: {
  campaign: MarketingCampaign;
  segments: MarketingSegment[];
}) {
  const queryClient = useQueryClient();
  const [sendOpen, setSendOpen] = useState(false);

  const segment = segments.find((s) => s.id === campaign.segment_id);
  const editable = campaign.status === "draft" || campaign.status === "scheduled";
  const sentAlready = campaign.status === "sent" || campaign.status === "failed";

  const deleteMutation = useMutation({
    mutationFn: () => marketingApi.campaigns.remove(campaign.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
      toast.success("Campaign deleted");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="truncate text-base">{campaign.name}</CardTitle>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <ChannelBadge channel={campaign.channel} />
            <span className="text-sm text-muted-foreground">
              {segment ? segment.name : "Segment removed"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          {editable ? (
            <Button
              nativeButton={false}
              render={<Link href={`/marketing/campaigns/${campaign.id}/edit`} />}
              size="icon"
              variant="ghost"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
          {campaign.status !== "sending" ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        {sentAlready ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="font-medium text-foreground">{campaign.sent_count}</span> sent
            </span>
            <span>
              <span className="font-medium text-foreground">{campaign.skipped_count}</span> skipped
            </span>
            {campaign.failed_count > 0 ? (
              <span className="text-destructive">{campaign.failed_count} failed</span>
            ) : null}
            {campaign.completed_at ? <span>· {formatDateTime(campaign.completed_at)}</span> : null}
          </div>
        ) : campaign.scheduled_at ? (
          <p>Scheduled for {formatDateTime(campaign.scheduled_at)}</p>
        ) : campaign.channel === "email" ? (
          <MarketingEmailPreview
            subject={campaign.subject}
            bodyHtml={campaign.body}
            compact
          />
        ) : (
          <p className="line-clamp-2 whitespace-pre-wrap">{campaign.body}</p>
        )}

        {editable ? (
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href={`/marketing/campaigns/${campaign.id}/edit`} />}
              size="sm"
              variant="outline"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button type="button" size="sm" onClick={() => setSendOpen(true)}>
              <Send className="mr-2 h-3.5 w-3.5" />
              Review &amp; send
            </Button>
          </div>
        ) : null}
      </CardContent>

      <SendDialog campaign={campaign} segment={segment} open={sendOpen} onOpenChange={setSendOpen} />
    </Card>
  );
}

export function MarketingCampaignsManager() {
  const { data, isLoading } = useQuery({
    queryKey: ["marketing-campaigns"],
    queryFn: () => marketingApi.campaigns.list(),
  });
  const { data: segmentsData } = useQuery({
    queryKey: ["marketing-segments"],
    queryFn: marketingApi.segments.list,
  });

  const list = data?.campaigns ?? [];
  const segments = segmentsData?.segments ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Design newsletter-style emails or SMS blasts for a saved audience. Preview in the inbox before you send."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              render={<Link href="/marketing/campaigns/new?channel=sms" />}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              SMS blast
            </Button>
            <Button nativeButton={false} render={<Link href="/marketing/campaigns/new" />}>
              <Plus className="mr-2 h-4 w-4" />
              Email campaign
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title="No campaigns yet"
          description="Create a campaign to reach customers with a newsletter email or SMS blast."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button nativeButton={false} render={<Link href="/marketing/campaigns/new" />}>
                <Plus className="mr-2 h-4 w-4" />
                Email campaign
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/marketing/campaigns/new?channel=sms" />}
                variant="outline"
              >
                SMS blast
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CampaignCard key={c.id} campaign={c} segments={segments} />
          ))}
        </div>
      )}

    </div>
  );
}
