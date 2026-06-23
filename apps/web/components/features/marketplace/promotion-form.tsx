"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageIcon, Package, Percent, ShoppingBag, Upload } from "lucide-react";
import { getApiErrorMessage, inventoryApi, marketplaceApi } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import { DealProductPickerModal } from "./deal-product-picker-modal";
import { ToggleRow } from "./marketplace-storefront-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreatePromotionRequest, StorefrontPromotion } from "@/types/api";
import { cn } from "@/lib/utils";

export const promotionSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    description: z.string().max(500).optional(),
    scope_type: z.enum(["all_products", "selected_products"]),
    discount_type: z.enum(["percent", "fixed"]),
    discount_value: z.coerce.number().positive("Discount must be greater than zero"),
    product_ids: z.array(z.string()).optional(),
    starts_at: z.string().optional(),
    ends_at: z.string().optional(),
    is_active: z.boolean(),
    show_on_homepage: z.boolean(),
    sort_order: z.coerce.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scope_type === "selected_products" && (!data.product_ids || data.product_ids.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one product",
        path: ["product_ids"],
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

export type PromotionFormValues = z.infer<typeof promotionSchema>;

export function toPromotionISO(local?: string) {
  if (!local) return undefined;
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function fromPromotionISO(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PromotionForm({
  initial,
  onSubmit,
  busy,
  submitLabel,
  cancelHref,
}: {
  initial?: StorefrontPromotion;
  onSubmit: (body: CreatePromotionRequest) => void;
  busy: boolean;
  submitLabel: string;
  cancelHref: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [flyerUrl, setFlyerUrl] = useState(initial?.flyer_url ?? "");
  const flyerInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const promotionId = initial?.id;

  const flyerMutation = useMutation({
    mutationFn: (file: File) => marketplaceApi.promotions.uploadFlyer(promotionId!, file),
    onSuccess: (promo) => {
      setFlyerUrl(promo.flyer_url ?? "");
      queryClient.invalidateQueries({ queryKey: ["marketplace-promotions"] });
      if (promotionId) {
        queryClient.invalidateQueries({ queryKey: ["marketplace-promotion", promotionId] });
      }
      toast.success("Flyer uploaded");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  const flyerSrc = resolveMediaUrl(flyerUrl);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema) as Resolver<PromotionFormValues>,
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      scope_type: initial?.scope_type ?? "selected_products",
      discount_type: initial?.discount_type ?? "percent",
      discount_value: initial?.discount_value ?? 10,
      product_ids: initial?.product_ids ?? [],
      starts_at: fromPromotionISO(initial?.starts_at),
      ends_at: fromPromotionISO(initial?.ends_at),
      is_active: initial?.is_active ?? true,
      show_on_homepage: initial?.show_on_homepage ?? true,
      sort_order: initial?.sort_order ?? 0,
    },
  });

  const scopeType = form.watch("scope_type");
  const selectedIds = form.watch("product_ids") ?? [];

  const { data: selectedProductsData } = useQuery({
    queryKey: ["deal-selected-product-names", selectedIds.join(",")],
    queryFn: async () => {
      const res = await inventoryApi.list({ type: "product", status: "active", limit: 200 });
      return res.items.filter((p) => selectedIds.includes(p.id));
    },
    enabled: selectedIds.length > 0,
  });
  const selectedProducts = selectedProductsData ?? [];

  return (
    <>
      <form
        className="grid gap-6 lg:grid-cols-3"
        onSubmit={form.handleSubmit((values) => {
          onSubmit({
            name: values.name,
            description: values.description || undefined,
            scope_type: values.scope_type,
            discount_type: values.discount_type,
            discount_value: values.discount_value,
            product_ids: values.scope_type === "selected_products" ? values.product_ids : [],
            starts_at: toPromotionISO(values.starts_at) ?? null,
            ends_at: toPromotionISO(values.ends_at) ?? null,
            is_active: values.is_active,
            show_on_homepage: values.show_on_homepage,
            sort_order: values.sort_order ?? 0,
          });
        })}
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign details</CardTitle>
              <CardDescription>Name your promo and write a short blurb for customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Campaign name</Label>
                <Input {...form.register("name")} placeholder="Friday 50% off" className="h-11" />
                {form.formState.errors.name ? (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label>Description (optional)</Label>
                <Textarea
                  {...form.register("description")}
                  rows={3}
                  placeholder="Short promo blurb for customers"
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Campaign flyer
              </CardTitle>
              <CardDescription>
                Wide promo image on your Deals page and homepage deals band — 2:1 landscape works best
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {promotionId ? (
                <>
                  {flyerSrc ? (
                    <div className="overflow-hidden rounded-xl border aspect-[2/1] bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={flyerSrc} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex aspect-[2/1] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 text-muted-foreground">
                      <ImageIcon className="h-8 w-8 opacity-60" />
                      <p className="text-sm">No flyer yet</p>
                    </div>
                  )}
                  <input
                    ref={flyerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) flyerMutation.mutate(file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11"
                    disabled={flyerMutation.isPending}
                    onClick={() => flyerInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {flyerMutation.isPending ? "Uploading…" : flyerUrl ? "Replace flyer" : "Upload flyer"}
                  </Button>
                </>
              ) : (
                <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                  Create the deal first — you can upload a flyer on the next screen.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                Discount
              </CardTitle>
              <CardDescription>How much customers save during this campaign</CardDescription>
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
                <Label>Sort order</Label>
                <Input type="number" min={0} className="h-11 max-w-[8rem]" {...form.register("sort_order")} />
                <p className="text-xs text-muted-foreground">Lower numbers appear first when multiple deals are live</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Products
              </CardTitle>
              <CardDescription>Apply the deal to your whole catalog or hand-pick products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "all_products", label: "All products", hint: "Every item in your shop" },
                    { value: "selected_products", label: "Selected products", hint: "Pick specific items" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => form.setValue("scope_type", opt.value, { shouldValidate: true })}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors hover:bg-muted/40",
                      scopeType === opt.value && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    )}
                  >
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{opt.hint}</p>
                  </button>
                ))}
              </div>

              {scopeType === "selected_products" ? (
                <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {selectedIds.length} product{selectedIds.length === 1 ? "" : "s"} selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Open the picker to search and select from your full catalog
                      </p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => setPickerOpen(true)}>
                      <Package className="mr-2 h-4 w-4" />
                      Choose products
                    </Button>
                  </div>
                  {selectedProducts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProducts.slice(0, 8).map((p) => (
                        <Badge key={p.id} variant="secondary" className="font-normal max-w-[12rem] truncate">
                          {p.name}
                        </Badge>
                      ))}
                      {selectedIds.length > 8 ? (
                        <Badge variant="outline">+{selectedIds.length - 8} more</Badge>
                      ) : null}
                    </div>
                  ) : null}
                  {form.formState.errors.product_ids ? (
                    <p className="text-xs text-destructive">{form.formState.errors.product_ids.message}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Only{" "}
                    <Link href="/marketplace/products" className="text-primary underline">
                      storefront-visible products
                    </Link>{" "}
                    can be added to a deal.
                  </p>
                </div>
              ) : null}
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
              <CardTitle className="text-base">Visibility</CardTitle>
              <CardDescription>Where customers see this deal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                label="Active"
                where="Deals page"
                description="Turn off to hide this campaign without deleting it"
                checked={form.watch("is_active")}
                onChange={(v) => form.setValue("is_active", v)}
              />
              <ToggleRow
                label="Show on homepage"
                where="Storefront home"
                description="Featured in the deals band with a View all link"
                checked={form.watch("show_on_homepage")}
                onChange={(v) => form.setValue("show_on_homepage", v)}
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

      <DealProductPickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedIds={selectedIds}
        onChange={(ids) => form.setValue("product_ids", ids, { shouldValidate: true })}
      />
    </>
  );
}
