"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { marketingApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { summarizeRules } from "./marketing-shared";
import { SegmentDialog } from "./segment-dialog";
import type { MarketingSegment } from "@/types/api";

function SegmentCard({ segment }: { segment: MarketingSegment }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => marketingApi.segments.remove(segment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-segments"] });
      toast.success("Segment deleted");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{segment.name}</CardTitle>
          {segment.description ? (
            <p className="mt-1 truncate text-sm text-muted-foreground">{segment.description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={() => setEditOpen(true)} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{summarizeRules(segment.rules)}</p>
        <div className="flex items-center gap-1.5 text-foreground">
          <Users className="h-4 w-4" />
          <span className="font-medium">{segment.member_count}</span>
          <span className="text-muted-foreground">customers match</span>
        </div>
      </CardContent>
      <SegmentDialog open={editOpen} onOpenChange={setEditOpen} segment={segment} />
    </Card>
  );
}

export function MarketingSegmentsManager() {
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["marketing-segments"],
    queryFn: marketingApi.segments.list,
  });

  const list = data?.segments ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Segments"
        description="Saved audiences built from your customer book. Reuse them when sending a campaign."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New segment
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No segments yet"
          description="Create a segment like 'lapsed 90+ days' or 'VIP customers' to target your campaigns."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create segment
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <SegmentCard key={s.id} segment={s} />
          ))}
        </div>
      )}

      <SegmentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
