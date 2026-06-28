"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, ShieldBan, Trash2 } from "lucide-react";
import { marketingApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChannelBadge, formatDateTime } from "./marketing-shared";
import type { MarketingChannel, MarketingSuppression } from "@/types/api";

function AddOptOutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<MarketingChannel>("sms");
  const [contact, setContact] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      marketingApi.suppressions.add({ channel, contact: contact.trim(), reason: "manual" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-suppressions"] });
      toast.success("Added to opt-out list");
      onOpenChange(false);
      setContact("");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add opt-out</DialogTitle>
          <DialogDescription>
            Block a phone number or email from receiving marketing on a channel.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Channel</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as MarketingChannel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="opt-contact">
              {channel === "sms" ? "Phone number" : "Email address"}
            </Label>
            <Input
              id="opt-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={channel === "sms" ? "0241234567" : "name@example.com"}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !contact.trim()}
            >
              Add opt-out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function reasonLabel(reason: string) {
  switch (reason) {
    case "stop":
      return "Replied STOP";
    case "unsubscribe":
      return "Unsubscribed";
    case "bounce":
      return "Bounced";
    case "complaint":
      return "Spam complaint";
    default:
      return "Manual";
  }
}

function OptOutRow({ item }: { item: MarketingSuppression }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => marketingApi.suppressions.remove(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-suppressions"] });
      toast.success("Removed from opt-out list");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <ChannelBadge channel={item.channel} />
        <span className="truncate font-medium">{item.contact}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Badge variant="outline" className="font-normal">
          {reasonLabel(item.reason)}
        </Badge>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {formatDateTime(item.created_at)}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-destructive"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          title="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function MarketingSuppressionsManager() {
  const [channel, setChannel] = useState<"all" | MarketingChannel>("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["marketing-suppressions"],
    queryFn: () => marketingApi.suppressions.list(),
  });

  const all = data?.suppressions ?? [];
  const list = channel === "all" ? all : all.filter((s) => s.channel === channel);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opt-outs"
        description="Customers who asked to stop. They are skipped on every send. SMS STOP replies and email unsubscribes land here automatically."
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add opt-out
          </Button>
        }
      />

      <Tabs value={channel} onValueChange={(v) => setChannel(v as "all" | MarketingChannel)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<ShieldBan className="h-8 w-8" />}
          title="No opt-outs"
          description="Nobody has opted out on this channel. Anyone who replies STOP or unsubscribes will appear here."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          {list.map((s) => (
            <OptOutRow key={s.id} item={s} />
          ))}
        </Card>
      )}

      <AddOptOutDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
