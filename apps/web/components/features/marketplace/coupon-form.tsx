"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Percent, Ticket, Users } from "lucide-react";
import { customersApi } from "@/lib/api";
import { CouponCustomerPickerModal } from "./coupon-customer-picker-modal";
import { ToggleRow } from "./marketplace-storefront-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateCouponRequest, StorefrontCoupon } from "@/types/api";
import { cn } from "@/lib/utils";

export const couponSchema = z
  .object({
    code: z.string().min(1, "Code is required").max(32),
    discount_type: z.enum(["percent", "fixed"]),
    discount_value: z.coerce.number().positive("Must be greater than zero"),
    min_order_amount: z.coerce.number().min(0).optional(),
    max_uses: z.coerce.number().int().min(0).optional(),
    max_uses_per_customer: z.coerce.number().int().min(0).optional(),
    audience: z.enum(["public", "restricted"]),
    customer_ids: z.array(z.string()).optional(),
    starts_at: z.string().optional(),
    ends_at: z.string().optional(),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.audience === "restricted" && (!data.customer_ids || data.customer_ids.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one customer",
        path: ["customer_ids"],
      });
    }
    if (data.discount_type === "percent" && data.discount_value >= 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Percent must be less than 100",
        path: ["discount_value"],
      });
    }
  });

export type CouponFormValues = z.infer<typeof couponSchema>;

export function toCouponISO(local?: string) {
  if (!local) return undefined;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function fromCouponISO(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function customerLabel(name: string, displayName?: string) {
  return displayName?.trim() || name?.trim() || "Customer";
}

export function CouponForm({
  initial,
  onSubmit,
  busy,
  submitLabel,
  cancelHref,
}: {
  initial?: StorefrontCoupon;
  onSubmit: (body: CreateCouponRequest) => void;
  busy: boolean;
  submitLabel: string;
  cancelHref: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,
    defaultValues: {
      code: initial?.code ?? "",
      discount_type: initial?.discount_type ?? "percent",
      discount_value: initial?.discount_value ?? 10,
      min_order_amount: initial?.min_order_amount ?? 0,
      max_uses: initial?.max_uses ?? 0,
      max_uses_per_customer: initial?.max_uses_per_customer ?? 0,
      audience: initial?.audience ?? "public",
      customer_ids: initial?.customer_ids ?? [],
      starts_at: fromCouponISO(initial?.starts_at),
      ends_at: fromCouponISO(initial?.ends_at),
      is_active: initial?.is_active ?? true,
    },
  });

  const audience = form.watch("audience");
  const selectedIds = form.watch("customer_ids") ?? [];

  const { data: selectedCustomersData } = useQuery({
    queryKey: ["coupon-selected-customers", selectedIds.join(",")],
    queryFn: async () => {
      const res = await customersApi.list({ limit: 200 });
      return res.customers.filter((c) => selectedIds.includes(c.id));
    },
    enabled: selectedIds.length > 0,
  });
  const selectedCustomers = selectedCustomersData ?? [];

  return (
    <>
      <form
        className="grid gap-6 lg:grid-cols-3"
        onSubmit={form.handleSubmit((values) => {
          onSubmit({
            code: values.code.trim().toUpperCase(),
            discount_type: values.discount_type,
            discount_value: values.discount_value,
            min_order_amount: values.min_order_amount ?? 0,
            max_uses: values.max_uses ?? 0,
            max_uses_per_customer: values.max_uses_per_customer ?? 0,
            audience: values.audience,
            customer_ids: values.audience === "restricted" ? values.customer_ids : [],
            starts_at: toCouponISO(values.starts_at) ?? null,
            ends_at: toCouponISO(values.ends_at) ?? null,
            is_active: values.is_active,
          });
        })}
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Coupon code
              </CardTitle>
              <CardDescription>Customers enter this at checkout for a discount on their order total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input
                  {...form.register("code")}
                  placeholder="SAVE10"
                  className="h-11 uppercase font-mono"
                  onChange={(e) => form.setValue("code", e.target.value.toUpperCase())}
                />
                {form.formState.errors.code ? (
                  <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Discount
              </CardTitle>
              <CardDescription>Applied to the order subtotal after product and deal discounts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Discount type</Label>
                <Select
                  value={form.watch("discount_type")}
                  onValueChange={(v) => form.setValue("discount_type", v as "percent" | "fixed")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input type="number" step="0.01" min={0} className="h-11" {...form.register("discount_value")} />
                {form.formState.errors.discount_value ? (
                  <p className="text-xs text-destructive">{form.formState.errors.discount_value.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Minimum order amount</Label>
                <Input type="number" step="0.01" min={0} className="h-11 max-w-[12rem]" {...form.register("min_order_amount")} />
                <p className="text-xs text-muted-foreground">Use 0 for no minimum</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Who can use this code
              </CardTitle>
              <CardDescription>Public codes work for anyone; restricted codes match checkout phone numbers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "public", label: "Anyone with the code", hint: "Share freely — no customer list needed" },
                    { value: "restricted", label: "Selected customers only", hint: "Phone must match at checkout" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => form.setValue("audience", opt.value, { shouldValidate: true })}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors hover:bg-muted/40",
                      audience === opt.value && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    )}
                  >
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.hint}</p>
                  </button>
                ))}
              </div>

              {audience === "restricted" ? (
                <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {selectedIds.length} customer{selectedIds.length === 1 ? "" : "s"} selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Open the picker to search and select eligible customers
                      </p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>
                      <Users className="mr-2 h-4 w-4" />
                      Choose customers
                    </Button>
                  </div>
                  {selectedCustomers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomers.slice(0, 8).map((c) => (
                        <Badge key={c.id} variant="secondary" className="font-normal max-w-[14rem] truncate">
                          {customerLabel(c.name, c.display_name)}
                        </Badge>
                      ))}
                      {selectedIds.length > 8 ? (
                        <Badge variant="outline">+{selectedIds.length - 8} more</Badge>
                      ) : null}
                    </div>
                  ) : null}
                  {form.formState.errors.customer_ids ? (
                    <p className="text-xs text-destructive">{form.formState.errors.customer_ids.message}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Customers need a phone number on file.{" "}
                    <Link href="/customers" className="text-primary underline">
                      Manage customers
                    </Link>
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage limits</CardTitle>
              <CardDescription>Control how often this code can be redeemed</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Max total uses</Label>
                <Input type="number" min={0} className="h-11" {...form.register("max_uses")} />
                <p className="text-xs text-muted-foreground">0 = unlimited</p>
              </div>
              <div className="space-y-1.5">
                <Label>Max per customer</Label>
                <Input type="number" min={0} className="h-11" {...form.register("max_uses_per_customer")} />
                <p className="text-xs text-muted-foreground">0 = unlimited</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
              <CardDescription>Optional start and end — leave blank to run until you turn it off</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Starts (optional)</Label>
                <Input type="datetime-local" className="h-11" {...form.register("starts_at")} />
              </div>
              <div className="space-y-1.5">
                <Label>Ends (optional)</Label>
                <Input type="datetime-local" className="h-11" {...form.register("ends_at")} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
              <CardDescription>Inactive codes cannot be redeemed at checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Active"
                where="Checkout"
                description="Turn off to pause this code without deleting it"
                checked={form.watch("is_active")}
                onChange={(v) => form.setValue("is_active", v)}
              />
              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" disabled={busy} className="w-full">
                  {submitLabel}
                </Button>
                <Button nativeButton={false} render={<Link href={cancelHref} />} type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <CouponCustomerPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedIds={selectedIds}
        onChange={(ids) => form.setValue("customer_ids", ids, { shouldValidate: true })}
      />
    </>
  );
}
