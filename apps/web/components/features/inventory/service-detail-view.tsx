"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CalendarPlus,
  Clock,
  Coins,
  ExternalLink,
  Globe,
  Percent,
  Shield,
  Wrench,
} from "lucide-react";
import { appointmentsApi } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Appointment, InventoryItem } from "@/types/api";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  inactive: "bg-muted text-muted-foreground",
  discontinued: "bg-destructive/10 text-destructive",
};

const apptStatusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-muted text-muted-foreground",
  no_show: "bg-destructive/10 text-destructive",
};

function depositLabel(item: InventoryItem) {
  if (item.deposit_type === "none" || !item.deposit_type) return "No deposit";
  if (item.deposit_type === "percent") return `${item.deposit_value}% of price`;
  return formatMoney(item.deposit_value, item.currency);
}

function formatApptWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ServiceMetric({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function RecentAppointmentRow({ appt }: { appt: Appointment }) {
  return (
    <TableRow>
      <TableCell className="text-sm">{formatApptWhen(appt.start_time)}</TableCell>
      <TableCell className="text-sm max-w-[10rem] truncate">{appt.customer_name || appt.guest_name || "Guest"}</TableCell>
      <TableCell>
        <Badge className={cn("text-xs border-0 capitalize", apptStatusStyles[appt.status] ?? "bg-muted")}>
          {appt.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-sm tabular-nums">
        {formatMoney(appt.service_price, appt.currency)}
      </TableCell>
      <TableCell className="text-right w-12">
        <Button
          nativeButton={false}
          render={<Link href={`/appointments/${appt.id}`} />}
          variant="ghost"
          size="sm"
          className="h-8 px-2"
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ServiceDetailView({ item, id }: { item: InventoryItem; id: string }) {
  const { data: apptData, isLoading: apptsLoading } = useQuery({
    queryKey: ["appointments", "service", id],
    queryFn: () => appointmentsApi.list({ service_id: id, limit: 50 }),
  });

  const appointments = apptData?.appointments ?? [];

  const bookingStats = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    let total = 0;
    let completed = 0;
    let upcoming = 0;
    let revenue = 0;

    for (const a of appointments) {
      const start = new Date(a.start_time);
      if (start < monthAgo) continue;
      total += 1;
      if (a.status === "completed") {
        completed += 1;
        revenue += a.service_price;
      }
      if (["pending", "confirmed"].includes(a.status) && start >= now) {
        upcoming += 1;
      }
    }

    return { total, completed, upcoming, revenue };
  }, [appointments]);

  const hasDiscount = item.discounted_price > 0 && item.discount_type !== "none";
  const gallery = (item.images ?? []).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr]">
          <div className="relative min-h-[200px] bg-muted/40 lg:min-h-[240px]">
            {item.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(item.photo_url)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <InventoryItemPhoto
                  src={item.photo_url}
                  name={item.name}
                  type="service"
                  iconClassName="h-16 w-16 text-muted-foreground"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("border-0 capitalize", statusStyles[item.status] ?? statusStyles.active)}>
                {item.status}
              </Badge>
              {item.category ? <Badge variant="secondary">{item.category}</Badge> : null}
              {item.is_bookable ? (
                <Badge className="border-0 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Bookable
                </Badge>
              ) : null}
              {item.storefront_visible ? (
                <Badge className="border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  On storefront
                </Badge>
              ) : (
                <Badge variant="outline">Hidden from shop</Badge>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{item.name}</h2>
              {item.description?.trim() ? (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">{item.description}</p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground italic">No description yet — add one so customers know what to expect.</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href={`/inventory/${id}/edit`} />} size="sm">
                Edit service
              </Button>
              {item.is_bookable ? (
                <Button
                  nativeButton={false}
                  render={<Link href={`/appointments/new?service=${id}`} />}
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Book appointment
                </Button>
              ) : null}
              <Button
                nativeButton={false}
                render={<Link href="/appointments" />}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ServiceMetric
          label="List price"
          value={
            hasDiscount ? (
              <span className="flex flex-col gap-0.5">
                <span className="text-primary">{formatMoney(item.discounted_price, item.currency)}</span>
                <span className="text-base font-normal line-through text-muted-foreground">
                  {formatMoney(item.sell_price, item.currency)}
                </span>
              </span>
            ) : (
              formatMoney(item.sell_price, item.currency)
            )
          }
          sub={item.pricing_type === "hourly" ? "Hourly rate" : "Fixed price"}
        />
        <ServiceMetric
          label="Duration"
          value={
            <>
              {item.duration_mins ?? 60}
              <span className="text-base font-normal text-muted-foreground ml-1">min</span>
            </>
          }
          sub="Typical appointment length"
        />
        <ServiceMetric
          label="Bookings · 30 days"
          value={bookingStats.total}
          sub={`${bookingStats.upcoming} upcoming · ${bookingStats.completed} completed`}
        />
        <ServiceMetric
          label="Revenue · 30 days"
          value={formatMoney(bookingStats.revenue, item.currency)}
          sub={
            item.cost_price > 0
              ? `${item.margin_pct.toFixed(0)}% margin · cost ${formatMoney(item.cost_price, item.currency)}`
              : "From completed appointments"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Booking & pricing */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Booking & pricing
              </CardTitle>
              <CardDescription>How this service is sold and booked</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["Pricing", item.pricing_type === "hourly" ? "Hourly rate" : "Fixed price"],
                    ["Duration", `${item.duration_mins ?? 60} minutes`],
                    ["Online booking", item.is_bookable ? "Customers can book online" : "Staff booking only"],
                    ["Deposit", depositLabel(item)],
                    ["Storefront", item.storefront_visible ? "Listed on your public shop" : "Not shown on shop"],
                    [
                      "Discount",
                      hasDiscount
                        ? item.discount_type === "percent"
                          ? `${item.discount_value}% off until ${item.discount_ends_at ? new Date(item.discount_ends_at).toLocaleDateString() : "further notice"}`
                          : `${formatMoney(item.discount_value, item.currency)} off`
                        : "None",
                    ],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="rounded-lg border bg-muted/20 px-4 py-3">
                    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                    <dd className="mt-1 text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Recent appointments */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Recent appointments
                </CardTitle>
                <CardDescription>Latest bookings for this service</CardDescription>
              </div>
              <Button nativeButton={false} render={<Link href={`/appointments?service=${id}`} />} variant="outline" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {apptsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10 px-6">
                  No appointments yet. Turn on &quot;Bookable via Appointments&quot; and share your booking link.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>When</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.slice(0, 8).map((appt) => (
                        <RecentAppointmentRow key={appt.id} appt={appt} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="font-medium">Storefront</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.storefront_visible ? "Customers can browse this on your shop" : "Only visible in your dashboard"}
                  </p>
                </div>
                <Badge variant={item.storefront_visible ? "default" : "secondary"}>
                  {item.storefront_visible ? "Public" : "Hidden"}
                </Badge>
              </div>
              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="font-medium">Appointments</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.is_bookable ? "Available in your booking calendar" : "Not offered for online booking"}
                  </p>
                </div>
                <Badge variant={item.is_bookable ? "default" : "secondary"}>
                  {item.is_bookable ? "On" : "Off"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {hasDiscount ? (
            <Card className="shadow-sm border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  Active discount
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-semibold text-primary">
                  {formatMoney(item.discounted_price, item.currency)} on storefront
                </p>
                <p className="text-muted-foreground line-through">{formatMoney(item.sell_price, item.currency)}</p>
                {item.discount_ends_at ? (
                  <p className="text-xs text-muted-foreground">
                    Ends {new Date(item.discount_ends_at).toLocaleString()}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Record info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 shrink-0" />
                Added {new Date(item.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {gallery.length > 0 ? (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Gallery</CardTitle>
                <CardDescription>{gallery.length} extra photo{gallery.length === 1 ? "" : "s"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {gallery.slice(0, 4).map((url) => (
                    <div key={url} className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveMediaUrl(url)} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                {gallery.length > 4 ? (
                  <Button
                    nativeButton={false}
                    render={<Link href={`/inventory/${id}/edit`} />}
                    variant="link"
                    size="sm"
                    className="mt-2 h-auto p-0"
                  >
                    View all in editor
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
