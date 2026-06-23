"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { invoicesApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Invoice } from "@/types/api";

const schema = z.object({
  amount: z.coerce.number().min(0.01, "Enter an amount"),
  method: z.enum(["cash", "momo", "card", "bank_transfer"]),
  reference: z.string().optional(),
  paid_at: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const methodLabels: Record<FormValues["method"], string> = {
  cash: "Cash",
  momo: "Mobile money",
  card: "Card",
  bank_transfer: "Bank transfer",
};

export function RecordPaymentForm({
  invoice,
  onSuccess,
}: {
  invoice: Invoice;
  onSuccess?: () => void;
}) {
  const currency = invoice.currency;
  const amountDue = invoice.amount_due ?? 0;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      amount: amountDue > 0 ? amountDue : undefined,
      method: "momo",
      paid_at: new Date().toISOString().split("T")[0],
    },
  });

  const method = watch("method");

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      invoicesApi.recordPayment(invoice.id, {
        amount: data.amount,
        currency,
        method: data.method,
        reference: data.reference?.trim() || undefined,
        paid_at: data.paid_at || new Date().toISOString().split("T")[0],
      }),
    onSuccess: () => {
      toast.success("Payment recorded");
      onSuccess?.();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Outstanding:{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {formatMoney(amountDue, currency)}
        </span>
      </p>

      <div className="space-y-2">
        <Label htmlFor="pay_amount">Amount ({currency})</Label>
        <Input
          id="pay_amount"
          type="number"
          step="0.01"
          min={0.01}
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Payment method</Label>
        <Select value={method} onValueChange={(v) => v && setValue("method", v as FormValues["method"])}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(methodLabels) as FormValues["method"][]).map((m) => (
              <SelectItem key={m} value={m}>
                {methodLabels[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay_ref">Reference (optional)</Label>
        <Input id="pay_ref" placeholder="MoMo ref, receipt #…" {...register("reference")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay_date">Payment date</Label>
        <Input id="pay_date" type="date" {...register("paid_at")} />
      </div>

      <Button type="submit" disabled={isSubmitting || mutation.isPending} className="w-full">
        {(isSubmitting || mutation.isPending) && <Spinner className="mr-2 h-4 w-4" />}
        Record payment
      </Button>
    </form>
  );
}
