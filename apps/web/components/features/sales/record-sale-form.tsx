"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Receipt,
  Zap,
  ListOrdered,
  Calendar,
  User,
} from "lucide-react";
import { customersApi, salesApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney, todayISO } from "@/lib/format";
import {
  SALE_PAYMENT_METHODS,
  QUICK_SALE_SUGGESTIONS,
  type SalePaymentMethod,
} from "@/lib/sales-constants";
import { useEnabledCurrencies } from "@/hooks/use-enabled-currencies";
import { customerDisplayLabel } from "@/lib/customer-label";
import { SectionLoader } from "@/components/shared/page-loader";
import type { Sale } from "@/types/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const lineSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.001, "Min 0.001")
  ),
  unit_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price must be 0 or more")
  ),
});

const schema = z.object({
  customer_id: z.string().optional(),
  currency: z.string().length(3),
  payment_method: z.enum([
    "cash",
    "momo_mtn",
    "momo_voda",
    "momo_airtel",
    "card",
    "bank",
  ]),
  sale_date: z.string().min(1, "Date required"),
  note: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Add at least one item"),
});

type FormValues = z.infer<typeof schema>;

function lineSubtotal(qty: number, price: number) {
  return (Number(qty) || 0) * (Number(price) || 0);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function saleDateToInput(date: string) {
  return date.includes("T") ? date.split("T")[0]! : date.slice(0, 10);
}

function saleToFormValues(sale: Sale): FormValues {
  return {
    customer_id: sale.customer_id ?? undefined,
    currency: sale.currency,
    payment_method: sale.payment_method as FormValues["payment_method"],
    sale_date: saleDateToInput(sale.sale_date),
    note: sale.note ?? "",
    lines: sale.lines.map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unit_price: l.unit_price,
    })),
  };
}

type RecordSaleFormProps = {
  saleId?: string;
};

export function RecordSaleForm({ saleId }: RecordSaleFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!saleId;
  const { currencies, defaultCurrency, isLoading: currenciesLoading } =
    useEnabledCurrencies();
  const [mode, setMode] = useState<"quick" | "itemized">("quick");

  const { data: existingSale, isLoading: saleLoading } = useQuery({
    queryKey: ["sale", saleId],
    queryFn: () => salesApi.get(saleId!),
    enabled: isEdit,
  });

  const { data: customersData } = useQuery({
    queryKey: ["customers", "picker"],
    queryFn: () => customersApi.list({ limit: 100 }),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      currency: "GHS",
      payment_method: "cash",
      sale_date: todayISO(),
      lines: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines");
  const currency = watch("currency");
  const paymentMethod = watch("payment_method");
  const saleDate = watch("sale_date");

  useEffect(() => {
    if (!isEdit && defaultCurrency && !currenciesLoading) {
      setValue("currency", defaultCurrency);
    }
  }, [defaultCurrency, currenciesLoading, isEdit, setValue]);

  useEffect(() => {
    if (!existingSale) return;
    const values = saleToFormValues(existingSale);
    reset(values);
    setMode(values.lines.length > 1 ? "itemized" : "quick");
  }, [existingSale, reset]);

  const lineTotal = lines.reduce(
    (sum, l) => sum + lineSubtotal(l.quantity, l.unit_price),
    0
  );

  const saveMutation = useMutation({
    mutationFn: (body: Parameters<typeof salesApi.record>[0]) =>
      isEdit ? salesApi.update(saleId!, body) : salesApi.record(body),
    onSuccess: (sale) => {
      toast.success(isEdit ? "Sale updated" : "Sale recorded");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["sales-trends"] });
      queryClient.invalidateQueries({ queryKey: ["sale", sale.id] });
      router.push(`/sales/${sale.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: FormValues) {
    if (lineTotal <= 0) {
      toast.error("Enter an amount greater than zero");
      return;
    }
    if (!currencies.includes(data.currency)) {
      toast.error("Choose a currency enabled in Settings → Currency");
      return;
    }
    saveMutation.mutate({
      customer_id: data.customer_id || undefined,
      currency: data.currency,
      payment_method: data.payment_method,
      sale_date: data.sale_date,
      note: data.note,
      lines: data.lines.map((l) => ({
        description: l.description,
        quantity: Number(l.quantity),
        unit_price: Number(l.unit_price),
      })),
    });
  }

  if (isEdit && saleLoading) {
    return <SectionLoader />;
  }

  function applyQuickSale(description: string, amount: number) {
    setValue("lines", [{ description, quantity: 1, unit_price: amount }], {
      shouldValidate: true,
    });
  }

  const customers = customersData?.customers ?? [];
  const quickAmount = lines[0]?.unit_price ?? 0;
  const quickDescription = lines[0]?.description ?? "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs
        value={mode}
        onValueChange={(v) => {
          setMode(v as "quick" | "itemized");
          if (v === "quick" && fields.length > 1) {
            setValue("lines", [lines[0] ?? { description: "", quantity: 1, unit_price: 0 }]);
          }
        }}
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-2">
          <TabsTrigger value="quick" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Quick sale
          </TabsTrigger>
          <TabsTrigger value="itemized" className="gap-1.5">
            <ListOrdered className="h-3.5 w-3.5" />
            Multiple items
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            What did you receive?
          </CardTitle>
          <CardDescription>
            Record payment when money hits your hand or account — no invoice required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mode === "quick" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="quick-amount" className="text-sm font-medium">
                  Amount received
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      id="quick-amount"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="0.00"
                      className="pl-14 h-12 text-lg font-semibold tabular-nums"
                      value={quickAmount === 0 ? "" : quickAmount}
                      onChange={(e) => {
                        const v = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        applyQuickSale(
                          quickDescription || "Sale",
                          Number.isNaN(v) ? 0 : v
                        );
                      }}
                    />
                  </div>
                  <Select
                    value={currency}
                    onValueChange={(v) => v && setValue("currency", v)}
                  >
                    <SelectTrigger className="w-[100px] h-14">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="quick-desc">What was it for?</Label>
                <Input
                  id="quick-desc"
                  placeholder="e.g. Haircut, 2 bags of rice, tailoring"
                  className="h-11"
                  value={quickDescription}
                  onChange={(e) =>
                    applyQuickSale(e.target.value, Number(quickAmount) || 0)
                  }
                />
                {errors.lines?.[0]?.description && (
                  <p className="text-xs text-destructive">
                    {errors.lines[0]?.description?.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_SALE_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="text-xs rounded-full border px-2.5 py-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                      onClick={() =>
                        applyQuickSale(s, Number(quickAmount) || 0)
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Item {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(index)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="What was sold?"
                      {...register(`lines.${index}.description`)}
                    />
                    {errors.lines?.[index]?.description && (
                      <p className="text-xs text-destructive">
                        {errors.lines[index]?.description?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        step="any"
                        min={0}
                        {...register(`lines.${index}.quantity`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Unit price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        {...register(`lines.${index}.unit_price`)}
                      />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end">
                      <Label className="text-xs text-muted-foreground">Line total</Label>
                      <p className="text-sm font-semibold tabular-nums h-9 flex items-center">
                        {formatMoney(
                          lineSubtotal(
                            lines[index]?.quantity ?? 0,
                            lines[index]?.unit_price ?? 0
                          ),
                          currency
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
              >
                <Plus className="h-4 w-4" />
                Add another item
              </Button>
              {errors.lines?.message && (
                <p className="text-xs text-destructive">{String(errors.lines.message)}</p>
              )}
            </div>
          )}

          {mode === "itemized" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Select
                value={currency}
                onValueChange={(v) => v && setValue("currency", v)}
              >
                <SelectTrigger className="w-full max-w-[200px] h-10">
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
          )}

          <div className="space-y-3 pt-2 border-t">
            <Label className="text-sm font-medium">How did they pay?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SALE_PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("payment_method", value as SalePaymentMethod)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    paymentMethod === value
                      ? "border-primary bg-primary/10 text-primary font-medium ring-1 ring-primary/20"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Date
              </Label>
              <Input type="date" {...register("sale_date")} className="h-10" />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={saleDate === todayISO() ? "secondary" : "outline"}
                  size="xs"
                  onClick={() => setValue("sale_date", todayISO())}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant={saleDate === yesterdayISO() ? "secondary" : "outline"}
                  size="xs"
                  onClick={() => setValue("sale_date", yesterdayISO())}
                >
                  Yesterday
                </Button>
              </div>
              {errors.sale_date && (
                <p className="text-xs text-destructive">{errors.sale_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Customer
              </Label>
              <Select
                value={watch("customer_id") ?? "none"}
                onValueChange={(v) =>
                  setValue("customer_id", !v || v === "none" ? undefined : v)
                }
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Walk-in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Walk-in (no customer)</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {customerDisplayLabel(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  <Link href="/customers/new" className="text-primary hover:underline">
                    Add customers
                  </Link>{" "}
                  to link sales later.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm text-muted-foreground">
              Note (optional)
            </Label>
            <Textarea
              id="note"
              rows={2}
              className="resize-none"
              placeholder="Reference, receipt number, who paid…"
              {...register("note")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 -mx-1 mt-2 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-md flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Total to record
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight">
            {formatMoney(lineTotal, currency)}
          </p>
          {lineTotal <= 0 && (
            <p className="text-xs text-destructive mt-0.5">Enter an amount above</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            nativeButton={false}
            render={<Link href={isEdit && saleId ? `/sales/${saleId}` : "/sales"} />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || saveMutation.isPending || lineTotal <= 0}
            className="min-w-[130px]"
          >
            {(isSubmitting || saveMutation.isPending) && (
              <Spinner className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Save changes" : "Record sale"}
          </Button>
        </div>
      </div>
    </form>
  );
}
