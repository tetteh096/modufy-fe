"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { posApi, getApiErrorMessage } from "@/lib/api";
import { SALE_PAYMENT_METHODS } from "@/lib/sales-constants";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  receipt_prefix: z.string().max(20),
  receipt_footer: z.string().optional(),
  default_payment_method: z.string(),
  show_out_of_stock: z.boolean(),
  max_cashier_discount_pct: z.coerce.number().min(0).max(100),
  idle_lock_minutes: z.coerce.number().min(0).max(120),
});

type FormValues = z.infer<typeof schema>;

export function PosSettingsForm() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["pos-settings"], queryFn: posApi.getSettings });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      receipt_prefix: "RCP",
      receipt_footer: "",
      default_payment_method: "cash",
      show_out_of_stock: true,
      max_cashier_discount_pct: 10,
      idle_lock_minutes: 10,
    },
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const save = useMutation({
    mutationFn: (values: FormValues) => posApi.updateSettings(values),
    onSuccess: () => {
      toast.success("POS settings saved");
      qc.invalidateQueries({ queryKey: ["pos-settings"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  if (isLoading) return <Spinner className="h-6 w-6" />;

  return (
    <form
      className="max-w-lg space-y-6"
      onSubmit={form.handleSubmit((v) => save.mutate(v))}
    >
      <div className="space-y-2">
        <Label>Receipt number prefix</Label>
        <Input {...form.register("receipt_prefix")} placeholder="RCP" />
      </div>
      <div className="space-y-2">
        <Label>Receipt footer</Label>
        <Textarea {...form.register("receipt_footer")} placeholder="Thank you for shopping with us!" rows={3} />
      </div>
      <div className="space-y-2">
        <Label>Default payment method</Label>
        <Select
          value={form.watch("default_payment_method")}
          onValueChange={(v) => v && form.setValue("default_payment_method", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SALE_PAYMENT_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer">
        <Checkbox
          checked={form.watch("show_out_of_stock")}
          onCheckedChange={(v) => form.setValue("show_out_of_stock", v === true)}
        />
        <div>
          <p className="font-medium text-sm">Show out-of-stock products</p>
          <p className="text-xs text-muted-foreground">Grey out items with zero stock on the register</p>
        </div>
      </label>
      <div className="space-y-2">
        <Label>Max cashier discount (%)</Label>
        <Input type="number" min={0} max={100} {...form.register("max_cashier_discount_pct")} />
        <p className="text-xs text-muted-foreground">
          Staff can apply this discount at checkout (end of sale), not on individual products in the grid.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Auto-lock after idle (minutes)</Label>
        <Input type="number" min={0} max={120} {...form.register("idle_lock_minutes")} />
        <p className="text-xs text-muted-foreground">
          Lock the register when there is no activity. Set to 0 to disable. Default is 10 minutes.
        </p>
      </div>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? <Spinner className="h-4 w-4" /> : "Save settings"}
      </Button>
    </form>
  );
}
