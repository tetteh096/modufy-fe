"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Receipt, Calendar, FileText } from "lucide-react";
import { expensesApi, getApiErrorMessage } from "@/lib/api";
import { todayISO, localDateISO } from "@/lib/format";
import type { Expense } from "@/types/api";
import { SectionLoader } from "@/components/shared/page-loader";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_PAYMENT_METHODS,
  type ExpenseCategory,
  type ExpensePaymentMethod,
} from "@/lib/expense-constants";
import { useEnabledCurrencies } from "@/hooks/use-enabled-currencies";
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
import { cn } from "@/lib/utils";
import { AiExpenseCategoryHint } from "@/components/features/ai/ai-expense-category-hint";

const schema = z.object({
  category: z.enum([
    "rent",
    "transport",
    "supplies",
    "staff",
    "utilities",
    "marketing",
    "phone",
    "other",
  ]),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, "Enter an amount greater than zero")
  ),
  currency: z.string().length(3),
  payment_method: z.enum(["cash", "momo", "bank"]),
  expense_date: z.string().min(1, "Date required"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function expenseDateInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return todayISO();
  return localDateISO(d);
}

type LogExpenseFormProps = {
  expense?: Expense;
};

export function LogExpenseForm({ expense }: LogExpenseFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currencies, defaultCurrency } = useEnabledCurrencies();
  const isEdit = !!expense;

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
      category: "supplies",
      currency: "GHS",
      payment_method: "cash",
      expense_date: todayISO(),
    },
  });

  const category = watch("category");
  const currency = watch("currency");
  const paymentMethod = watch("payment_method");
  const expenseDate = watch("expense_date");
  const note = watch("note") ?? "";
  const amount = watch("amount");

  useEffect(() => {
    if (expense) {
      reset({
        category: expense.category as FormValues["category"],
        amount: expense.amount,
        currency: expense.currency,
        payment_method: (expense.payment_method || "cash") as FormValues["payment_method"],
        expense_date: expenseDateInput(expense.expense_date),
        note: expense.note ?? "",
      });
    } else if (defaultCurrency) {
      setValue("currency", defaultCurrency);
    }
  }, [expense, defaultCurrency, reset, setValue]);

  const logMutation = useMutation({
    mutationFn: expensesApi.log,
    onSuccess: () => {
      toast.success("Expense logged");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-trends"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      router.push("/expenses");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (body: Parameters<typeof expensesApi.update>[1]) =>
      expensesApi.update(expense!.id, body),
    onSuccess: () => {
      toast.success("Expense updated");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-trends"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      router.push("/expenses");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function onSubmit(data: FormValues) {
    if (!currencies.includes(data.currency)) {
      toast.error("Choose a currency enabled in Settings → Currency");
      return;
    }
    const body = {
      category: data.category,
      amount: Number(data.amount),
      currency: data.currency,
      payment_method: data.payment_method,
      expense_date: data.expense_date,
      note: data.note?.trim() || undefined,
    };
    if (isEdit) updateMutation.mutate(body);
    else logMutation.mutate(body);
  }

  const pending = isSubmitting || logMutation.isPending || updateMutation.isPending;

  if (isEdit && !expense) {
    return <SectionLoader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            What did you spend?
          </CardTitle>
          <CardDescription>
            Rent, stock, transport, wages — anything that leaves the business.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("category", value as ExpenseCategory)}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    category === value
                      ? "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300 font-medium ring-1 ring-orange-500/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  <span className="leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount spent
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {currency}
                </span>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  placeholder="0.00"
                  className="pl-14 h-12 text-lg font-semibold tabular-nums"
                  {...register("amount")}
                />
              </div>
              <Select
                value={currency}
                onValueChange={(v) => v && setValue("currency", v)}
              >
                <SelectTrigger className="w-[88px] h-12">
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
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label className="text-sm font-medium">How did you pay?</Label>
            <div className="grid grid-cols-3 gap-2">
              {EXPENSE_PAYMENT_METHODS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setValue("payment_method", value as ExpensePaymentMethod)
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    paymentMethod === value
                      ? "border-orange-500 bg-orange-500/10 font-medium ring-1 ring-orange-500/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Date
            </Label>
            <Input type="date" {...register("expense_date")} className="h-10 max-w-xs" />
            <div className="flex gap-2">
              <Button
                type="button"
                variant={expenseDate === todayISO() ? "secondary" : "outline"}
                size="xs"
                onClick={() => setValue("expense_date", todayISO())}
              >
                Today
              </Button>
              <Button
                type="button"
                variant={expenseDate === yesterdayISO() ? "secondary" : "outline"}
                size="xs"
                onClick={() => setValue("expense_date", yesterdayISO())}
              >
                Yesterday
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Note (optional)
            </Label>
            <Textarea
              id="note"
              rows={2}
              className="resize-none"
              placeholder="e.g. March shop rent, fuel for delivery van"
              {...register("note")}
            />
            <AiExpenseCategoryHint
              note={note}
              onSuggest={(cat) => setValue("category", cat)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-10 rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur-md flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {Number(amount) > 0
            ? `Recording ${currency} ${Number(amount).toFixed(2)}`
            : "Enter amount above"}
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            nativeButton={false}
            render={<Link href="/expenses" />}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending} className="min-w-[130px]">
            {pending && <Spinner className="mr-2 h-4 w-4" />}
            {isEdit ? "Save changes" : "Log expense"}
          </Button>
        </div>
      </div>
    </form>
  );
}
