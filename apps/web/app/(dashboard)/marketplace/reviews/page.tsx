"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Flag, MessageSquare } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceReview } from "@/types/api";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: MarketplaceReview }) {
  const queryClient = useQueryClient();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState(review.business_reply ?? "");

  const replyMutation = useMutation({
    mutationFn: (reply: string) => marketplaceApi.reviews.reply(review.id, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-reviews"] });
      toast.success("Reply posted");
      setReplying(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const flagMutation = useMutation({
    mutationFn: () => marketplaceApi.reviews.flag(review.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-reviews"] });
      toast.success("Review flagged for admin review");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{review.reviewer_name}</p>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <StarRating rating={review.rating} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <p className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            {!review.flagged && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => flagMutation.mutate()}
                disabled={flagMutation.isPending}
                title="Flag review"
              >
                <Flag className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {review.comment && (
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        )}

        {review.business_reply && !replying && (
          <div className="border-l-2 border-primary pl-3">
            <p className="text-xs font-medium text-primary mb-0.5">Your reply</p>
            <p className="text-sm text-muted-foreground">{review.business_reply}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-7 text-xs px-2"
              onClick={() => setReplying(true)}
            >
              Edit reply
            </Button>
          </div>
        )}

        {!review.business_reply && !replying && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setReplying(true)}
          >
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Reply
          </Button>
        )}

        {replying && (
          <div className="space-y-2">
            <Textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => replyMutation.mutate(replyText)}
                disabled={replyMutation.isPending || !replyText.trim()}
              >
                {replyMutation.isPending ? "Posting..." : "Post reply"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setReplying(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MarketplaceReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["marketplace-reviews"],
    queryFn: marketplaceApi.reviews.list,
  });

  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Reviews"
        description={avg ? `Average rating: ${avg} ★ from ${reviews?.length} reviews` : "Customer reviews from your storefront"}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : !reviews?.length ? (
        <EmptyState
          icon={<Star className="h-8 w-8" />}
          title="No reviews yet"
          description="Reviews from verified customers will appear here"
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}
