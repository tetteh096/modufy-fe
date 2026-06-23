"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Copy,
  Link2,
  MessageCircle,
  Pencil,
  Plus,
  Send,
  Ticket,
  Trash2,
} from "lucide-react";
import { marketplaceApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DiscountAnalyticsCard } from "./discount-analytics-card";
import { CouponCustomerPickerModal } from "./coupon-customer-picker-modal";
import { SITE_BASE } from "./marketplace-storefront-shared";
import type { StorefrontCoupon } from "@/types/api";
import { customersApi } from "@/lib/api";

function discountLabel(c: StorefrontCoupon) {
  if (c.discount_type === "percent") return `${c.discount_value}% off order`;
  return `${formatMoney(c.discount_value)} off order`;
}

function statusBadge(c: StorefrontCoupon) {
  if (!c.is_active) return <Badge variant="secondary">Inactive</Badge>;
  if (c.is_currently_active) return <Badge className="bg-emerald-600">Active</Badge>;
  return <Badge variant="outline">Scheduled / ended</Badge>;
}

function CouponSendSheet({
  coupon,
  open,
  onOpenChange,
}: {
  coupon: StorefrontCoupon;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(coupon.customer_ids);

  const sendMutation = useMutation({
    mutationFn: (via: "sms" | "whatsapp") =>
      marketplaceApi.coupons.send(coupon.id, {
        via,
        customer_ids: selected.length > 0 ? selected : undefined,
      }),
    onSuccess: (res, via) => {
      if (via === "whatsapp" && res.links.length > 0) {
        window.open(res.links[0].whatsapp_url, "_blank", "noopener,noreferrer");
      }
      toast.success(res.message);
      onOpenChange(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const { data: selectedCustomersData } = useQuery({
    queryKey: ["coupon-send-selected", selected.join(",")],
    queryFn: async () => {
      const res = await customersApi.list({ limit: 200 });
      return res.customers.filter((c) => selected.includes(c.id));
    },
    enabled: open && selected.length > 0,
  });

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Send {coupon.code}</SheetTitle>
            <SheetDescription>
              SMS sends automatically when Hubtel is configured. WhatsApp opens a pre-filled chat for you to send.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <p className="text-sm font-medium">
                {selected.length} recipient{selected.length === 1 ? "" : "s"} selected
              </p>
              <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                Choose customers
              </Button>
              {selectedCustomersData && selectedCustomersData.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCustomersData.slice(0, 6).map((c) => (
                    <Badge key={c.id} variant="secondary" className="font-normal truncate max-w-[10rem]">
                      {c.display_name || c.name}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                disabled={sendMutation.isPending || selected.length === 0}
                onClick={() => sendMutation.mutate("sms")}
              >
                <Send className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={sendMutation.isPending || selected.length === 0}
                onClick={() => sendMutation.mutate("whatsapp")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CouponCustomerPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedIds={selected}
        onChange={setSelected}
      />
    </>
  );
}

function CouponCard({ coupon, businessSlug }: { coupon: StorefrontCoupon; businessSlug?: string }) {
  const queryClient = useQueryClient();
  const [sendOpen, setSendOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => marketplaceApi.coupons.delete(coupon.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace-coupons"] });
      toast.success("Coupon removed");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  function copyCode() {
    navigator.clipboard.writeText(coupon.code);
    toast.success("Code copied");
  }

  function copyShareLink() {
    if (!businessSlug) {
      toast.error("Storefront slug not loaded");
      return;
    }
    const url = `${SITE_BASE}/p/${businessSlug}/cart?coupon=${encodeURIComponent(coupon.code)}`;
    navigator.clipboard.writeText(url);
    toast.success("Checkout link copied");
  }

  const usesLabel =
    coupon.max_uses > 0
      ? `${coupon.uses_count} / ${coupon.max_uses} uses`
      : `${coupon.uses_count} uses`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="font-mono text-base">{coupon.code}</CardTitle>
            {statusBadge(coupon)}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{discountLabel(coupon)}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={copyShareLink} title="Copy checkout link">
            <Link2 className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={copyCode} title="Copy code">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/marketplace/coupons/${coupon.id}/edit`} />}
            size="icon"
            variant="ghost"
            title="Edit coupon"
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
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{usesLabel}</p>
        <p>
          {coupon.audience === "public"
            ? "Public — anyone can use"
            : `${coupon.customer_ids.length} selected customer${coupon.customer_ids.length === 1 ? "" : "s"}`}
        </p>
        {coupon.min_order_amount > 0 ? <p>Min order: {formatMoney(coupon.min_order_amount)}</p> : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={() => setSendOpen(true)}>
            <Send className="mr-2 h-3.5 w-3.5" />
            Send to customers
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/marketplace/coupons/${coupon.id}/edit`} />}
            variant="ghost"
            size="sm"
          >
            Edit coupon
          </Button>
        </div>
      </CardContent>
      <CouponSendSheet coupon={coupon} open={sendOpen} onOpenChange={setSendOpen} />
    </Card>
  );
}

export function MarketplaceCouponsManager() {
  const { data: profile } = useQuery({
    queryKey: ["marketplace-profile"],
    queryFn: marketplaceApi.profile.get,
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["marketplace-coupons"],
    queryFn: marketplaceApi.coupons.list,
  });

  const list = coupons ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Checkout codes customers enter for an extra discount on their order total"
        action={
          <Button nativeButton={false} render={<Link href="/marketplace/coupons/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            New coupon
          </Button>
        }
      />

      <DiscountAnalyticsCard />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Ticket className="h-8 w-8" />}
          title="No coupons yet"
          description="Create a code like SAVE10 — customers enter it at checkout for a discount on their order."
          action={
            <Button nativeButton={false} render={<Link href="/marketplace/coupons/new" />}>
              <Plus className="mr-2 h-4 w-4" />
              Create coupon
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CouponCard key={c.id} coupon={c} businessSlug={profile?.business_slug} />
          ))}
        </div>
      )}
    </div>
  );
}
