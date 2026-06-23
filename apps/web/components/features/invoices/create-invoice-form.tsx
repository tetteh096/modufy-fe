"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  FileText,
  User,
  Phone,
  Mail,
  Calendar,
  Receipt,
  Package,
  Scissors,
  PencilLine,
  Search,
} from "lucide-react";
import { businessApi, customersApi, invoicesApi, getApiErrorMessage } from "@/lib/api";
import type { CreateInvoiceRequest, InvoiceDocType, AIInvoiceLineSuggestion } from "@/types/api";
import { useEnabledCurrencies } from "@/hooks/use-enabled-currencies";
import { customerDisplayLabel } from "@/lib/customer-label";
import { CustomerAvatar } from "@/components/features/customers/customer-initials";
import { CustomerSearchSelect } from "@/components/features/customers/customer-search-select";
import { ProductPickerModal } from "@/components/features/inventory/product-picker-modal";
import { ServicePickerModal } from "@/components/features/inventory/service-picker-modal";
import { formatMoney } from "@/lib/format";
import { QUICK_SALE_SUGGESTIONS } from "@/lib/sales-constants";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AiInvoiceLinesSheet } from "@/components/features/ai/ai-invoice-lines-sheet";

const lineSchema = z.object({
  description: z.string().min(1, "Description required"),
  product_id: z.string().optional(),
  service_id: z.string().optional(),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.001, "Quantity required")
  ),
  unit_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price required")
  ),
});

function lineSubtotal(qty: unknown, price: unknown) {
  return (Number(qty) || 0) * (Number(price) || 0);
}

function mapLineToApi(l: FormValues["lines"][number]) {
  const line: CreateInvoiceRequest["lines"][number] = {
    description: l.description.trim(),
    quantity: Number(l.quantity),
    unit_price: Number(l.unit_price),
  };
  if (l.product_id) line.product_id = l.product_id;
  if (l.service_id) line.service_id = l.service_id;
  return line;
}

const schema = z.object({
  customer_id: z.string().uuid("Select a customer"),
  currency: z.string().length(3),
  due_date: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  apply_vat: z.boolean(),
  lines: z.array(lineSchema).min(1, "Add at least one line"),
});

type FormValues = z.infer<typeof schema>;

function defaultDueDate(daysAhead = 14) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

function SelectTriggerLabel({
  value,
  placeholder,
}: {
  value: string | undefined;
  placeholder: string;
}) {
  return (
    <span
      className={cn(
        "truncate text-left flex-1",
        !value && "text-muted-foreground"
      )}
    >
      {value || placeholder}
    </span>
  );
}

export function CreateInvoiceForm({
  invoiceId,
  docType = "invoice",
}: {
  invoiceId?: string;
  docType?: InvoiceDocType;
} = {}) {
  const isEdit = !!invoiceId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { currencies, defaultCurrency } = useEnabledCurrencies();

  const { data: invoiceSettings } = useQuery({
    queryKey: ["invoice-settings"],
    queryFn: invoicesApi.settings.get,
    enabled: !isEdit,
  });

  const { data: existingInvoice, isLoading: loadingInvoice } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => invoicesApi.get(invoiceId!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      customer_id: "",
      currency: "GHS",
      due_date: "",
      notes: "",
      terms: "",
      apply_vat: true,
      lines: [{ description: "", product_id: "", service_id: "", quantity: 1, unit_price: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const customerId = watch("customer_id");
  const currency = watch("currency");
  const lines = watch("lines");

  const { data: modulesData } = useQuery({
    queryKey: ["business-modules"],
    queryFn: businessApi.modules,
    staleTime: 60_000,
  });
  const inventoryEnabled = (modulesData?.modules ?? []).some(
    (m) => m.module === "inventory" && m.enabled
  );

  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [pickerTargetIndex, setPickerTargetIndex] = useState(0);

  function fillLineAtIndex(
    index: number,
    item: { id: string; name: string; type: string; sell_price?: number },
  ) {
    const fill = {
      description: item.name,
      product_id: item.type === "product" ? item.id : "",
      service_id: item.type === "service" ? item.id : "",
      quantity: 1,
      unit_price: item.sell_price ?? 0,
    };
    setValue(`lines.${index}.description`, fill.description, { shouldValidate: true });
    setValue(`lines.${index}.product_id`, fill.product_id);
    setValue(`lines.${index}.service_id`, fill.service_id);
    setValue(`lines.${index}.quantity`, fill.quantity, { shouldValidate: true });
    setValue(`lines.${index}.unit_price`, fill.unit_price, { shouldValidate: true });
  }

  function applyAiLines(suggestions: AIInvoiceLineSuggestion[]) {
    for (const line of suggestions) {
      append({
        description: line.description,
        product_id: "",
        service_id: "",
        quantity: line.quantity || 1,
        unit_price: line.unit_price || 0,
      });
    }
  }

  function openInventoryPicker(kind: "product" | "service", lineIndex?: number) {
    let target = lineIndex ?? fields.length - 1;
    if (lineIndex === undefined) {
      const last = lines?.[target];
      if (last?.description?.trim() && lineSubtotal(last.quantity, last.unit_price) > 0) {
        append({ description: "", product_id: "", service_id: "", quantity: 1, unit_price: 0 });
        target = fields.length;
      }
    }
    setPickerTargetIndex(target);
    if (kind === "product") setProductPickerOpen(true);
    else setServicePickerOpen(true);
  }

  function lineSourceType(line: FormValues["lines"][number] | undefined) {
    if (line?.product_id) return "product" as const;
    if (line?.service_id) return "service" as const;
    return "custom" as const;
  }

  const { data: selectedCustomer } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => customersApi.get(customerId),
    enabled: !!customerId,
  });

  const subtotal = (lines ?? []).reduce(
    (sum, line) => sum + lineSubtotal(line.quantity, line.unit_price),
    0
  );

  useEffect(() => {
    if (defaultCurrency && !isEdit) setValue("currency", defaultCurrency);
  }, [defaultCurrency, setValue, isEdit]);

  useEffect(() => {
    if (!isEdit && invoiceSettings) {
      if (invoiceSettings.default_terms) setValue("terms", invoiceSettings.default_terms);
      if (invoiceSettings.default_footer) setValue("notes", invoiceSettings.default_footer);
      const days = invoiceSettings.default_payment_days || 14;
      setValue("due_date", defaultDueDate(days));
    }
  }, [invoiceSettings, isEdit, setValue]);

  useEffect(() => {
    if (isEdit && existingInvoice) {
      const inv = existingInvoice;
      setValue("customer_id", inv.customer_id ?? "");
      setValue("currency", inv.currency);
      setValue("due_date", inv.due_date?.split("T")[0] ?? "");
      setValue("notes", inv.notes ?? "");
      setValue("terms", inv.terms ?? "");
      setValue("apply_vat", (inv.vat_amount ?? 0) > 0);
      setValue(
        "lines",
        (inv.lines ?? []).map((l) => ({
          description: l.description,
          product_id: l.product_id ?? "",
          service_id: l.service_id ?? "",
          quantity: l.quantity,
          unit_price: l.unit_price ?? 0,
        }))
      );
    }
  }, [existingInvoice, isEdit, setValue]);

  useEffect(() => {
    const prefill = searchParams.get("customer_id");
    if (prefill && !isEdit) {
      setValue("customer_id", prefill, { shouldValidate: true });
    }
  }, [searchParams, setValue, isEdit]);

  const createMutation = useMutation({
    mutationFn: invoicesApi.create,
    onSuccess: (invoice) => {
      toast.success(docType === "quote" ? "Quote created" : "Invoice created", {
        description: invoice.number ?? "Draft saved",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      router.push(invoice.id ? `/invoices/${invoice.id}` : "/invoices");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) =>
      invoicesApi.update(invoiceId!, {
        currency: data.currency,
        due_date: data.due_date || undefined,
        notes: data.notes?.trim() || undefined,
        terms: data.terms?.trim() || undefined,
        apply_vat: data.apply_vat,
        lines: data.lines.map(mapLineToApi),
      }),
    onSuccess: () => {
      toast.success("Invoice updated");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      router.push(`/invoices/${invoiceId}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: FormValues) {
    if (!currencies.includes(data.currency)) {
      toast.error("Choose a currency enabled in Settings");
      return;
    }
    const payload = {
      customer_id: data.customer_id,
      type: docType,
      currency: data.currency,
      due_date: data.due_date || undefined,
      notes: data.notes?.trim() || undefined,
      terms: data.terms?.trim() || undefined,
      apply_vat: data.apply_vat,
      lines: data.lines.map(mapLineToApi),
    };
    if (isEdit) {
      updateMutation.mutate(data);
      return;
    }
    createMutation.mutate(payload);
  }

  const pending =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  if (isEdit && loadingInvoice) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Customer
              </CardTitle>
              <CardDescription>Who you are billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <CustomerSearchSelect
                  value={customerId}
                  onValueChange={(id) =>
                    setValue("customer_id", id, { shouldValidate: true })
                  }
                  placeholder="Search by name or phone…"
                  disabled={isEdit}
                />
                {errors.customer_id && (
                  <p className="text-xs text-destructive">{errors.customer_id.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Can&apos;t find them?{" "}
                  <Link
                    href="/customers/new"
                    className="text-primary font-medium hover:underline"
                  >
                    Add a customer
                  </Link>
                </p>
              </div>

              {selectedCustomer && (
                <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                  <CustomerAvatar name={selectedCustomer.name} />
                  <div className="min-w-0 text-sm space-y-1">
                    <p className="font-medium">{customerDisplayLabel(selectedCustomer)}</p>
                    {selectedCustomer.phone && (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        {selectedCustomer.phone}
                      </p>
                    )}
                    {selectedCustomer.email && (
                      <p className="flex items-center gap-1.5 text-muted-foreground truncate">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {selectedCustomer.email}
                      </p>
                    )}
                    <Link
                      href={`/customers/${selectedCustomer.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={currency}
                    onValueChange={(v) => v && setValue("currency", v)}
                  >
                    <SelectTrigger className="w-full h-11">
                      <SelectTriggerLabel
                        value={currency}
                        placeholder="Currency"
                      />
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
                  <Label htmlFor="due_date" className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Due date
                  </Label>
                  <Input
                    id="due_date"
                    type="date"
                    className="h-11"
                    {...register("due_date")}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setValue("due_date", defaultDueDate(7))}
                    >
                      +7 days
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setValue("due_date", defaultDueDate(14))}
                    >
                      +14 days
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setValue("due_date", defaultDueDate(30))}
                    >
                      +30 days
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Line items
                  </CardTitle>
                  <CardDescription>
                    Search your catalog or type charges manually — both work on the same invoice.
                  </CardDescription>
                </div>
                <AiInvoiceLinesSheet currency={currency} onApply={applyAiLines} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/25 p-4 space-y-3 text-sm">
                <p className="font-medium">Two ways to add a line</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-2.5 rounded-lg border bg-background p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Search className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-xs">From inventory</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                        {inventoryEnabled
                          ? "Search products or services — prices and names fill in automatically."
                          : "Enable the Inventory module to pick from a catalog."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 rounded-lg border bg-background p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <PencilLine className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-xs">Type it yourself</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                        No catalog needed — describe the charge and enter qty &amp; price on any line.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {inventoryEnabled ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground w-full sm:w-auto">
                    Quick add from catalog:
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openInventoryPicker("product")}
                  >
                    <Package className="h-3.5 w-3.5" />
                    Browse products
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openInventoryPicker("service")}
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    Browse services
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground rounded-lg border border-dashed px-3 py-2.5">
                  Inventory is off for this business — use <strong className="font-medium text-foreground">Add custom line</strong> below and type what you are billing for.
                </p>
              )}

              <ProductPickerModal
                open={productPickerOpen}
                onOpenChange={setProductPickerOpen}
                title="Choose a product for this invoice"
                description="Search your product catalog — the selected line will fill automatically."
                onSelect={(product) => fillLineAtIndex(pickerTargetIndex, product)}
              />
              <ServicePickerModal
                open={servicePickerOpen}
                onOpenChange={setServicePickerOpen}
                bookableOnly={false}
                title="Choose a service for this invoice"
                description="Search your service catalog — the selected line will fill automatically."
                onSelect={(service) => fillLineAtIndex(pickerTargetIndex, service)}
              />

              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-medium text-muted-foreground w-full">
                  Quick labels (custom lines):
                </span>
                {QUICK_SALE_SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="text-xs rounded-full border px-2.5 py-1 hover:bg-muted/60 transition-colors"
                    onClick={() => {
                      const idx = fields.length - 1;
                      if (lines?.[idx]?.description?.trim()) {
                        append({ description: s, product_id: "", service_id: "", quantity: 1, unit_price: 0 });
                      } else {
                        setValue(`lines.${idx}.description`, s);
                        setValue(`lines.${idx}.product_id`, "");
                        setValue(`lines.${idx}.service_id`, "");
                      }
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {fields.map((field, index) => {
                const line = lines?.[index];
                const source = lineSourceType(line);
                const lineTotal = lineSubtotal(line?.quantity, line?.unit_price);
                return (
                  <div
                    key={field.id}
                    className={cn(
                      "rounded-lg border p-4 space-y-3",
                      source !== "custom" && "border-primary/20 bg-primary/[0.02]",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Line {index + 1}
                        </span>
                        {source === "product" ? (
                          <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
                            <Package className="h-3 w-3" />
                            From inventory · Product
                          </Badge>
                        ) : source === "service" ? (
                          <Badge variant="secondary" className="gap-1 text-[10px] font-normal">
                            <Scissors className="h-3 w-3" />
                            From inventory · Service
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-[10px] font-normal">
                            <PencilLine className="h-3 w-3" />
                            Custom — typed by you
                          </Badge>
                        )}
                      </div>
                      {lineTotal > 0 && (
                        <Badge variant="secondary" className="tabular-nums font-normal">
                          {formatMoney(lineTotal, currency)}
                        </Badge>
                      )}
                    </div>

                    {inventoryEnabled ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => openInventoryPicker("product", index)}
                        >
                          <Package className="h-3 w-3" />
                          Pick product
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs"
                          onClick={() => openInventoryPicker("service", index)}
                        >
                          <Scissors className="h-3 w-3" />
                          Pick service
                        </Button>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Label htmlFor={`line-desc-${index}`}>
                        {source === "custom" ? "What are you charging for?" : "Description"}
                      </Label>
                      <Input
                        id={`line-desc-${index}`}
                        placeholder={
                          source === "custom"
                            ? "e.g. Consultation, delivery fee, 2× custom shirts…"
                            : "Name from catalog — edit if needed"
                        }
                        {...register(`lines.${index}.description`, {
                          onChange: () => {
                            if (line?.product_id || line?.service_id) {
                              setValue(`lines.${index}.product_id`, "");
                              setValue(`lines.${index}.service_id`, "");
                            }
                          },
                        })}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {source === "custom"
                          ? "Free text — no inventory required."
                          : "Linked to inventory. Clearing and retyping turns this into a custom line."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                      <div className="space-y-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          step="any"
                          min={0.001}
                          {...register(`lines.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          {...register(`lines.${index}.unit_price`, { valueAsNumber: true })}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive shrink-0"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() =>
                    append({ description: "", product_id: "", service_id: "", quantity: 1, unit_price: 0 })
                  }
                >
                  <PencilLine className="h-4 w-4" />
                  Add custom line
                </Button>
                {inventoryEnabled ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const newIdx = fields.length;
                        append({ description: "", product_id: "", service_id: "", quantity: 1, unit_price: 0 });
                        setPickerTargetIndex(newIdx);
                        setProductPickerOpen(true);
                      }}
                    >
                      <Package className="h-4 w-4" />
                      Add line from product
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const newIdx = fields.length;
                        append({ description: "", product_id: "", service_id: "", quantity: 1, unit_price: 0 });
                        setPickerTargetIndex(newIdx);
                        setServicePickerOpen(true);
                      }}
                    >
                      <Scissors className="h-4 w-4" />
                      Add line from service
                    </Button>
                  </>
                ) : null}
              </div>
              {errors.lines && (
                <p className="text-xs text-destructive">
                  {errors.lines.message ?? errors.lines.root?.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notes & terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms">Payment terms</Label>
                <Textarea
                  id="terms"
                  rows={2}
                  className="resize-none"
                  placeholder="Due within 14 days. Late fees may apply."
                  {...register("terms")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Footer / notes on PDF</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  className="resize-none"
                  placeholder="Bank details, thank-you message…"
                  {...register("notes")}
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={watch("apply_vat")}
                  onChange={(e) => setValue("apply_vat", e.target.checked)}
                />
                Apply VAT (based on your tax settings)
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-sm sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Invoice total
              </CardTitle>
              <CardDescription>VAT may apply based on your tax settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold tabular-nums">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedCustomer
                  ? `Billing ${customerDisplayLabel(selectedCustomer)}`
                  : "Select a customer to continue"}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={pending || !customerId || subtotal < 0.001}
                  className="w-full"
                >
                  {pending && <Spinner className="mr-2 h-4 w-4" />}
                  {isEdit ? "Save changes" : docType === "quote" ? "Create quote" : "Create invoice"}
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/invoices" />}
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
  );
}
