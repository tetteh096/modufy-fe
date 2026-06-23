"use client";

import { useRef } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, ImageIcon, Pencil, Plus, Tag, Trash2, Upload } from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleRow } from "./marketplace-storefront-shared";
import type { StorefrontPromotion } from "@/types/api";
import { DiscountAnalyticsCard } from "./discount-analytics-card";

function discountLabel(p: StorefrontPromotion) {
  if (p.discount_type === "percent") return `${p.discount_value}% off`;
  return `${formatMoney(p.discount_value)} off`;
}

function statusBadge(p: StorefrontPromotion) {
  if (!p.is_active) return <Badge variant="secondary">Inactive</Badge>;
  if (p.is_currently_active) return <Badge className="bg-emerald-600">Live</Badge>;
  return <Badge variant="outline">Scheduled / ended</Badge>;
}

function PromotionCard({ promo }: { promo: StorefrontPromotion }) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const flyerSrc = resolveMediaUrl(promo.flyer_url);

  const deleteMutation = useMutation({
    mutationFn: () => marketplaceApi.promotions.delete(promo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      toast.success("Deal removed");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const duplicateMutation = useMutation({
    mutationFn: () => marketplaceApi.promotions.duplicate(promo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      toast.success("Deal duplicated — review and activate the copy");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const flyerMutation = useMutation({
    mutationFn: (file: File) => marketplaceApi.promotions.uploadFlyer(promo.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      toast.success("Flyer uploaded");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{promo.name}</CardTitle>
            {statusBadge(promo)}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{discountLabel(promo)}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => duplicateMutation.mutate()}
            disabled={duplicateMutation.isPending}
            title="Duplicate deal"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/marketplace/deals/${promo.id}/edit`} />}
            size="icon"
            variant="ghost"
            title="Edit deal"
          >
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
      <CardContent className="space-y-3">
        {flyerSrc ? (
          <div className="overflow-hidden rounded-lg border aspect-[2/1] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flyerSrc} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[2/1] items-center justify-center rounded-lg border border-dashed bg-muted/40 text-muted-foreground">
            <ImageIcon className="mr-2 h-4 w-4" />
            No flyer yet
          </div>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{promo.scope_type === "all_products" ? "All products" : `${promo.product_ids.length} products`}</span>
          {promo.show_on_homepage ? <Badge variant="outline">Homepage</Badge> : null}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) flyerMutation.mutate(file);
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={flyerMutation.isPending}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-2 h-3.5 w-3.5" />
            {promo.flyer_url ? "Replace flyer" : "Upload flyer"}
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/marketplace/deals/${promo.id}/edit`} />}
            variant="ghost"
            size="sm"
          >
            Edit deal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketplaceDealsManager() {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["marketplace-profile"],
    queryFn: marketplaceApi.profile.get,
  });

  const { data: promos, isLoading } = useQuery({
    queryKey: ["marketplace-promotions"],
    queryFn: marketplaceApi.promotions.list,
  });

  const toggleSectionMutation = useMutation({
    mutationFn: (show: boolean) => marketplaceApi.profile.update({ show_deals_section: show }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-profile"] });
      toast.success("Storefront updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const list = promos ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals & promotions"
        description="Run timed sales on your storefront — Friday flash sales, flyers, and product picks"
        action={
          <Button nativeButton={false} render={<Link href="/marketplace/deals/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            New deal
          </Button>
        }
      />

      <DiscountAnalyticsCard />

      <Card>
        <CardContent className="pt-6">
          <ToggleRow
            label="Show deals section on storefront"
            where="Homepage + /deals page"
            description="When off, customers won't see the deals band or deals page content"
            checked={profile?.show_deals_section ?? false}
            onChange={(v) => toggleSectionMutation.mutate(v)}
            saving={toggleSectionMutation.isPending}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Tag className="h-8 w-8" />}
          title="No deals yet"
          description="Create a campaign, pick products or apply to your whole catalog, and upload a flyer."
          action={
            <Button nativeButton={false} render={<Link href="/marketplace/deals/new" />}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first deal
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <PromotionCard key={p.id} promo={p} />
          ))}
        </div>
      )}
    </div>
  );
}
