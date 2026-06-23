"use client";

import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Receipt,
  UserPlus,
} from "lucide-react";
import { SlidePanel } from "@/components/shared/slide-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  formatCoordPair,
  googleMapsDirectionsUrl,
  hasValidCoords,
} from "@/lib/geo";
import type { MarketplaceOrder, OrderStatus } from "@/types/api";
import {
  ORDER_NEXT_STATUSES,
  ORDER_STATUS_CONFIG,
} from "@/components/features/marketplace/marketplace-order-status";

type MarketplaceOrderDetailPanelProps = {
  order: MarketplaceOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MarketplaceOrderDetailPanel({
  order,
  open,
  onOpenChange,
  onStatusChange,
  onCreateCustomer,
  statusPending,
  customerPending,
}: MarketplaceOrderDetailPanelProps & {
  onStatusChange: (id: string, status: OrderStatus) => void;
  onCreateCustomer: (id: string) => void;
  statusPending?: boolean;
  customerPending?: boolean;
}) {
  if (!order) return null;

  const cfg = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.received;
  const next = ORDER_NEXT_STATUSES[order.status] ?? [];

  return (
    <SlidePanel
      open={open}
      onOpenChange={onOpenChange}
      title={order.guest_name}
      description={`Order · ${new Date(order.created_at).toLocaleString()}`}
      defaultWidth={480}
      footer={
        <div className="flex flex-wrap items-center gap-2">
          {!order.customer_id && order.guest_phone ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={customerPending}
              onClick={() => onCreateCustomer(order.id)}
            >
              {customerPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Add to customers
            </Button>
          ) : order.customer_id ? (
            <Button
              nativeButton={false}
              render={<Link href={`/customers/${order.customer_id}`} />}
              variant="outline"
              size="sm"
            >
              View customer
            </Button>
          ) : null}
          {next.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button size="sm" className="gap-1.5">
                    Update status
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                {next.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    disabled={statusPending}
                    onClick={() => onStatusChange(order.id, status)}
                  >
                    {ORDER_STATUS_CONFIG[status].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("text-xs font-medium border-0", cfg.className)}>
            {cfg.label}
          </Badge>
          <span className="text-xs text-muted-foreground capitalize">
            {order.payment_method}
          </span>
        </div>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </h3>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
            <p className="font-medium">{order.guest_name}</p>
            {order.guest_phone ? <p>{order.guest_phone}</p> : null}
            {order.guest_email ? <p>{order.guest_email}</p> : null}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Items
          </h3>
          <ul className="rounded-lg border divide-y">
            {order.lines.map((line) => (
              <li key={line.id} className="flex items-start justify-between gap-3 p-3 text-sm">
                <div>
                  <p className="font-medium">
                    {line.qty}× {line.product_name}
                  </p>
                  {line.variant_desc ? (
                    <p className="text-xs text-muted-foreground">{line.variant_desc}</p>
                  ) : null}
                </div>
                <p className="font-medium tabular-nums shrink-0">
                  {formatMoney(line.total, order.currency)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Delivery
          </h3>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-3">
            {order.delivery_option_label ? (
              <p>
                <span className="text-muted-foreground">Method: </span>
                {order.delivery_option_label}
              </p>
            ) : null}
            {order.delivery_address ? (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Map location</p>
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <span>{order.delivery_address}</span>
                </p>
              </div>
            ) : null}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">
                Landmark / directions
              </p>
              <p className={order.shipping_addr ? undefined : "text-muted-foreground italic"}>
                {order.shipping_addr || "None provided"}
              </p>
            </div>
            {hasValidCoords(order.delivery_lat, order.delivery_lng) ? (
              <div className="space-y-1 pt-1 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground">GPS pin</p>
                <p className="font-mono text-xs">
                  {formatCoordPair(order.delivery_lat!, order.delivery_lng!)}
                </p>
                <a
                  href={googleMapsDirectionsUrl(order.delivery_lat!, order.delivery_lng!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Navigation className="h-3 w-3" />
                  Navigate in Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : null}
            {!order.delivery_address &&
            !order.shipping_addr &&
            !hasValidCoords(order.delivery_lat, order.delivery_lng) ? (
              <p className="text-muted-foreground">No delivery details</p>
            ) : null}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Order notes
          </h3>
          <p
            className={`rounded-lg border bg-muted/30 p-3 text-sm ${
              order.notes ? undefined : "text-muted-foreground italic"
            }`}
          >
            {order.notes || "None provided"}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sales &amp; accounting
          </h3>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-2">
            {order.sale_id ? (
              <>
                <p className="text-muted-foreground">
                  {order.status === "delivered"
                    ? "Recorded in Sales and posted to Accounts when marked delivered."
                    : "Pending sale in Sales — revenue posts to Accounts when you mark this order delivered."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  nativeButton={false}
                  render={<Link href={`/sales/${order.sale_id}`} />}
                >
                  <Receipt className="h-4 w-4" />
                  View sale
                </Button>
              </>
            ) : order.status === "cancelled" ? (
              <p className="text-muted-foreground italic">No sale — order was cancelled.</p>
            ) : (
              <p className="text-muted-foreground italic">
                Sale record will appear when the order is synced.
              </p>
            )}
          </div>
        </section>

        <Separator />

        <section className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">{formatMoney(order.subtotal, order.currency)}</span>
          </div>
          {order.discount_amount > 0 ? (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <span>
                Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}
              </span>
              <span className="tabular-nums">
                −{formatMoney(order.discount_amount, order.currency)}
              </span>
            </div>
          ) : null}
          {order.delivery_fee ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="tabular-nums">
                {formatMoney(order.delivery_fee, order.currency)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(order.total, order.currency)}</span>
          </div>
        </section>
      </div>
    </SlidePanel>
  );
}
