"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Package, Wrench } from "lucide-react";
import { businessApi, inventoryApi, getApiErrorMessage } from "@/lib/api";
import type { CreateInventoryItemRequest, InventoryItem, UpdateInventoryItemRequest } from "@/types/api";
import { useEnabledCurrencies } from "@/hooks/use-enabled-currencies";
import { AiProductDescribeSheet } from "@/components/features/ai/ai-product-describe-sheet";
import { InventoryCategoryField } from "@/components/features/inventory/inventory-category-field";
import { InventoryPhotoField } from "@/components/features/inventory/inventory-photo-field";
import { PageHeader } from "@/components/shared/page-header";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  currency: z.string().length(3, "Select a currency"),
  sell_price: z.coerce.number().min(0),
  cost_price: z.coerce.number().min(0).optional(),
  unit: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock_qty: z.coerce.number().min(0).optional(),
  duration_mins: z.coerce.number().min(0).optional(),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
});

type FormValues = z.infer<typeof schema>;

type InventoryItemFormProps = {
  mode: "create" | "edit";
  itemType: "product" | "service";
  item?: InventoryItem;
};

export function InventoryItemForm({ mode, itemType, item }: InventoryItemFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currencies, defaultCurrency } = useEnabledCurrencies();
  const isProduct = itemType === "product";

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      currency: defaultCurrency ?? "GHS",
      sell_price: 0,
      cost_price: 0,
      stock_qty: 0,
      status: "active",
    },
  });

  const name = watch("name") ?? "";
  const currency = watch("currency") ?? defaultCurrency ?? "GHS";

  useEffect(() => {
    if (item && mode === "edit") {
      reset({
        name: item.name,
        description: item.description ?? "",
        category: item.category ?? "",
        currency: item.currency,
        sell_price: item.sell_price,
        cost_price: item.cost_price ?? 0,
        unit: item.unit ?? "",
        sku: item.sku ?? "",
        barcode: item.barcode ?? "",
        stock_qty: item.stock_qty ?? 0,
        duration_mins: item.duration_mins ?? 0,
        status: (item.status as FormValues["status"]) ?? "active",
      });
    } else if (defaultCurrency) {
      setValue("currency", defaultCurrency);
    }
  }, [item, mode, defaultCurrency, reset, setValue]);

  const createMutation = useMutation({
    mutationFn: (body: CreateInventoryItemRequest) => inventoryApi.create(body),
    onSuccess: (created) => {
      toast.success(isProduct ? "Product created" : "Service created");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      router.push(`/inventory/${created.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const photoUploadMutation = useMutation({
    mutationFn: (file: File) => inventoryApi.uploadPhoto(item!.id, file),
    onSuccess: () => {
      toast.success("Photo updated");
      queryClient.invalidateQueries({ queryKey: ["inventory", item!.id] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (body: UpdateInventoryItemRequest) => inventoryApi.update(item!.id, body),
    onSuccess: () => {
      toast.success("Saved");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", item!.id] });
      router.push(`/inventory/${item!.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const onSubmit = (values: FormValues) => {
    if (mode === "create") {
      const body: CreateInventoryItemRequest = {
        type: itemType,
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        category: values.category?.trim() || undefined,
        currency: values.currency,
        sell_price: values.sell_price,
        cost_price: values.cost_price || undefined,
        unit: values.unit?.trim() || undefined,
        sku: values.sku?.trim() || undefined,
        barcode: values.barcode?.trim() || undefined,
        stock_qty: isProduct ? values.stock_qty : undefined,
        duration_mins: !isProduct ? values.duration_mins : undefined,
      };
      createMutation.mutate(body);
      return;
    }

    const body: UpdateInventoryItemRequest = {
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      category: values.category?.trim() || undefined,
      sell_price: values.sell_price,
      cost_price: values.cost_price || undefined,
      unit: values.unit?.trim() || undefined,
      sku: values.sku?.trim() || undefined,
      barcode: values.barcode?.trim() || undefined,
      status: values.status,
      duration_mins: !isProduct ? values.duration_mins : undefined,
    };
    updateMutation.mutate(body);
  };

  const saving = isSubmitting || createMutation.isPending || updateMutation.isPending;
  const title = mode === "create"
    ? isProduct ? "Add product" : "Add service"
    : isProduct ? "Edit product" : "Edit service";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={title}
        description={
          mode === "create"
            ? `Create a new ${itemType} in ${business?.name ?? "your catalog"}`
            : item?.name
        }
        action={
          <Button
            nativeButton={false}
            render={<Link href={item ? `/inventory/${item.id}` : "/inventory"} />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {isProduct ? (
                <Package className="h-5 w-5 text-primary" />
              ) : (
                <Wrench className="h-5 w-5 text-primary" />
              )}
              Basic info
            </CardTitle>
            <CardDescription>Name, description, and pricing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" className="h-11" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="description">Description</Label>
                <AiProductDescribeSheet
                  name={name}
                  onApply={({ description, category }) => {
                    setValue("description", description);
                    if (category) setValue("category", category);
                  }}
                />
              </div>
              <Textarea
                id="description"
                rows={3}
                className="resize-none"
                placeholder="What customers should know about this item"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <InventoryCategoryField
                itemType={itemType}
                value={watch("category") ?? ""}
                onChange={(v) => setValue("category", v)}
              />
            </div>

            {mode === "edit" && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch("status") ?? "active"}
                  onValueChange={(v) => v && setValue("status", v as FormValues["status"])}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={currency}
                onValueChange={(v) => v && setValue("currency", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell_price">Sell price *</Label>
              <Input
                id="sell_price"
                type="number"
                step="0.01"
                min={0}
                className="h-11"
                {...register("sell_price")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                min={0}
                className="h-11"
                {...register("cost_price")}
              />
            </div>

            {isProduct ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stock_qty">Opening stock</Label>
                  <Input
                    id="stock_qty"
                    type="number"
                    step="1"
                    min={0}
                    className="h-11"
                    disabled={mode === "edit"}
                    {...register("stock_qty")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" className="h-11" {...register("sku")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" className="h-11" {...register("barcode")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input id="unit" placeholder="e.g. kg, piece" className="h-11" {...register("unit")} />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="duration_mins">Duration (minutes)</Label>
                <Input
                  id="duration_mins"
                  type="number"
                  min={0}
                  className="h-11"
                  {...register("duration_mins")}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {mode === "edit" && item && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryPhotoField
                itemType={itemType}
                name={item.name}
                existingUrl={item.photo_url}
                onUpload={(file) => photoUploadMutation.mutate(file)}
                isUploading={photoUploadMutation.isPending}
                wide
              />
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={saving} className="gap-2 min-w-[8rem]">
            {saving ? <Spinner className="h-4 w-4" /> : null}
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            nativeButton={false}
            render={<Link href={item ? `/inventory/${item.id}` : "/inventory"} />}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
