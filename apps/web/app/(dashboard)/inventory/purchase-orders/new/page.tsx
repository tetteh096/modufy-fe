"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Truck,
  ClipboardList,
  Package,
  Calendar,
  Coins,
} from "lucide-react";
import { inventoryApi, businessApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
const lineSchema = z.object({
  product_id: z.string().uuid("Select a product"),
  qty_ordered: z.preprocess(
    (val) => Number(val),
    z.number().min(0.001, "Quantity required")
  ),
  unit_cost: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost required")
  ),
});

const schema = z.object({
  supplier_id: z.string().uuid("Select a supplier"),
  currency: z.string().length(3),
  expected_at: z.string().optional(),
  notes: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Add at least one line item"),
});

type FormValues = z.infer<typeof schema>;

function lineTotal(qty: unknown, cost: unknown) {
  return (Number(qty) || 0) * (Number(cost) || 0);
}

function defaultExpectedDate(daysAhead = 7) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [productPickerKey, setProductPickerKey] = useState(0);

  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });
  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: inventoryApi.suppliers.list,
  });
  const { data: productsData } = useQuery({
    queryKey: ["inventory", "products"],
    queryFn: () => inventoryApi.list({ type: "product", limit: 200 }),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      currency: "GHS",
      expected_at: defaultExpectedDate(7),
      lines: [{ product_id: "", qty_ordered: 1, unit_cost: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  useEffect(() => {
    if (business?.default_currency) {
      setValue("currency", business.default_currency);
    }
  }, [business?.default_currency, setValue]);

  const mutation = useMutation({
    mutationFn: (v: FormValues) => inventoryApi.purchaseOrders.create(v),
    onSuccess: (po) => {
      toast.success(`PO ${po.number} created`);
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      router.push(`/inventory/purchase-orders/${po.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const suppliers = suppliersData?.suppliers ?? [];
  const products = productsData?.items ?? [];
  const lines = watch("lines");
  const currency = watch("currency") || "GHS";
  const supplierId = watch("supplier_id");
  const expectedAt = watch("expected_at");

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);

  const orderTotal = (lines ?? []).reduce(
    (sum, line) => sum + lineTotal(line.qty_ordered, line.unit_cost),
    0
  );

  const lineCount = (lines ?? []).filter(
    (l) => l.product_id && lineTotal(l.qty_ordered, l.unit_cost) > 0
  ).length;

  const pending = isSubmitting || mutation.isPending;

  function addProductLine(productId: string) {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const idx = fields.length - 1;
    const line = lines?.[idx];
    const fill = {
      product_id: prod.id,
      qty_ordered: 1,
      unit_cost: prod.cost_price ?? 0,
    };
    if (line?.product_id && lineTotal(line.qty_ordered, line.unit_cost) > 0) {
      append(fill);
    } else {
      setValue(`lines.${idx}.product_id`, fill.product_id, { shouldValidate: true });
      setValue(`lines.${idx}.qty_ordered`, fill.qty_ordered, { shouldValidate: true });
      setValue(`lines.${idx}.unit_cost`, fill.unit_cost, { shouldValidate: true });
    }
    setProductPickerKey((k) => k + 1);
  }

  return (
    <div>
      <PageHeader
        title="New purchase order"
        description="Order stock from a supplier — received goods update inventory automatically"
      />

      {suppliers.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-10 text-center space-y-4">
            <Truck className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <div>
              <p className="font-semibold">Add a supplier first</p>
              <p className="text-sm text-muted-foreground mt-1">
                Purchase orders need someone you buy from.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/inventory/suppliers" />}
              className="gap-1.5"
            >
              Go to suppliers
            </Button>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-10 text-center space-y-4">
            <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <div>
              <p className="font-semibold">Add products first</p>
              <p className="text-sm text-muted-foreground mt-1">
                Line items must link to products in your catalogue.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/inventory/new?type=product" />}
              className="gap-1.5"
            >
              Add product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Supplier & delivery
                  </CardTitle>
                  <CardDescription>Who you are ordering from and when you expect stock</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Supplier *</Label>
                    <Select
                      value={supplierId ?? ""}
                      onValueChange={(v) =>
                        setValue("supplier_id", v as string, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Choose supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                            {s.phone ? ` · ${s.phone}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.supplier_id && (
                      <p className="text-xs text-destructive">
                        {errors.supplier_id.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      <Link href="/inventory/suppliers" className="text-primary hover:underline">
                        Manage suppliers
                      </Link>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                      Currency
                    </Label>
                    <Select
                      value={currency}
                      onValueChange={(v) => setValue("currency", v as string)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(business?.currencies?.filter((c) => c.enabled) ?? []).map(
                          (c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Expected delivery
                    </Label>
                    <Input
                      type="date"
                      className="h-11"
                      {...register("expected_at")}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setValue("expected_at", defaultExpectedDate(3))}
                      >
                        +3 days
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setValue("expected_at", defaultExpectedDate(7))}
                      >
                        +7 days
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setValue("expected_at", defaultExpectedDate(14))}
                      >
                        +14 days
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      rows={2}
                      className="resize-none"
                      placeholder="Delivery instructions, reference number, payment terms…"
                      {...register("notes")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Line items
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Products and quantities you are ordering
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() =>
                        append({ product_id: "", qty_ordered: 1, unit_cost: 0 })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add line
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.length > 0 && (
                    <div className="space-y-2">
                      <Label>Quick add product</Label>
                      <Select
                        key={productPickerKey}
                        onValueChange={(id) => id && addProductLine(id as string)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pick a product to add…" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                              {p.sku ? ` · ${p.sku}` : ""}
                              {" · "}
                              {p.stock_qty} {p.unit ?? "units"} in stock
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {errors.lines?.root && (
                    <p className="text-xs text-destructive">
                      {errors.lines.root.message}
                    </p>
                  )}

                  {fields.map((field, i) => {
                    const rowTotal = lineTotal(
                      lines?.[i]?.qty_ordered,
                      lines?.[i]?.unit_cost
                    );
                    return (
                      <div
                        key={field.id}
                        className="rounded-lg border p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            Line {i + 1}
                          </span>
                          {rowTotal > 0 && (
                            <Badge variant="secondary" className="tabular-nums font-normal">
                              {formatMoney(rowTotal, currency)}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Product *</Label>
                          <Select
                            value={watch(`lines.${i}.product_id`) ?? ""}
                            onValueChange={(v) => {
                              setValue(`lines.${i}.product_id`, v as string, {
                                shouldValidate: true,
                              });
                              const prod = products.find((p) => p.id === v);
                              if (prod?.cost_price != null) {
                                setValue(`lines.${i}.unit_cost`, prod.cost_price, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.lines?.[i]?.product_id && (
                            <p className="text-xs text-destructive">
                              {errors.lines[i]?.product_id?.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              step="any"
                              min={0.001}
                              className="h-11"
                              {...register(`lines.${i}.qty_ordered`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Unit cost</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              className="h-11"
                              {...register(`lines.${i}.unit_cost`, {
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive h-11"
                              onClick={() => remove(i)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="shadow-sm sticky top-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Order summary
                  </CardTitle>
                  <CardDescription>Review before creating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Supplier</span>
                      <span className="font-medium text-right truncate max-w-[55%]">
                        {selectedSupplier?.name ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Line items</span>
                      <span className="font-medium tabular-nums">{lineCount}</span>
                    </div>
                    {expectedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected</span>
                        <span className="font-medium">
                          {new Date(expectedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Order total</span>
                      <span className="text-lg font-bold tabular-nums">
                        {formatMoney(orderTotal, currency)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Saved as <strong>draft</strong>. Mark sent when you have placed the order
                    with the supplier.
                  </p>

                  <div className="flex flex-col gap-2 pt-1">
                    <Button
                      type="submit"
                      disabled={
                        pending ||
                        !supplierId ||
                        orderTotal < 0.001 ||
                        lineCount < 1
                      }
                      className="w-full"
                    >
                      {pending && <Spinner className="mr-2 h-4 w-4" />}
                      {pending ? "Creating…" : "Create purchase order"}
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/inventory/purchase-orders" />}
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
