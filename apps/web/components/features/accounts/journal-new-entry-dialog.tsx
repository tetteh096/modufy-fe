"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { accountsApi, getApiErrorMessage } from "@/lib/api";
import { JOURNAL_ACCOUNTS } from "@/lib/journal-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const moneyField = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? 0 : Number(v)),
  z.number().min(0)
);

const entrySchema = z.object({
  date: z.string().min(1, "Date required"),
  description: z.string().min(1, "Description required"),
  currency: z.string().length(3),
  lines: z
    .array(
      z.object({
        account_code: z.string().min(1, "Required"),
        debit: moneyField,
        credit: moneyField,
      })
    )
    .min(2, "At least 2 lines required"),
});

type EntryForm = z.infer<typeof entrySchema>;

type JournalNewEntryDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function JournalNewEntryDialog({ open, onClose }: JournalNewEntryDialogProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EntryForm>({
    resolver: zodResolver(entrySchema) as Resolver<EntryForm>,
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      currency: "GHS",
      description: "",
      lines: [
        { account_code: "", debit: 0, credit: 0 },
        { account_code: "", debit: 0, credit: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const mutation = useMutation({
    mutationFn: (v: EntryForm) =>
      accountsApi.journal.create({
        ...v,
        lines: v.lines.map((l) => ({
          account_code: l.account_code,
          account_name:
            JOURNAL_ACCOUNTS.find((a) => a.code === l.account_code)?.name ?? l.account_code,
          debit: l.debit,
          credit: l.credit,
        })),
      }),
    onSuccess: () => {
      toast.success("Journal entry created");
      queryClient.invalidateQueries({ queryKey: ["accounts", "journal"] });
      reset();
      onClose();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const lines = watch("lines");
  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = Math.abs(totalDebit - totalCredit) < 0.005;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New journal entry</DialogTitle>
          <DialogDescription>Manual double-entry. Debits must equal credits.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={watch("currency")}
                onValueChange={(v) => v && setValue("currency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["GHS", "NGN", "USD", "EUR", "GBP"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input
                {...register("description")}
                placeholder="e.g. Correction: reclassify marketing expense"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_100px_100px_32px] gap-2 text-xs font-medium text-muted-foreground px-1">
              <span>Account</span>
              <span className="text-right">Debit</span>
              <span className="text-right">Credit</span>
              <span />
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_100px_100px_32px] gap-2 items-center">
                <Select
                  value={watch(`lines.${i}.account_code`) || undefined}
                  onValueChange={(v) => v && setValue(`lines.${i}.account_code`, v)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOURNAL_ACCOUNTS.map((a) => (
                      <SelectItem key={a.code} value={a.code}>
                        <span className="font-mono text-xs mr-2 text-muted-foreground">{a.code}</span>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`lines.${i}.debit`, { valueAsNumber: true })}
                  className="text-right"
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`lines.${i}.credit`, { valueAsNumber: true })}
                  className="text-right"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => remove(i)}
                  disabled={fields.length <= 2}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ account_code: "", debit: 0, credit: 0 })}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add line
            </Button>
          </div>

          <div
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
              balanced ? "bg-primary/10" : "bg-amber-500/10"
            )}
          >
            <span className={balanced ? "text-primary font-medium" : "text-amber-700 dark:text-amber-400"}>
              {balanced ? "Balanced" : "Debits and credits must match"}
            </span>
            <span className="tabular-nums text-xs text-muted-foreground">
              Dr {totalDebit.toFixed(2)} · Cr {totalCredit.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!balanced || mutation.isPending}>
              {mutation.isPending ? "Posting…" : "Post entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
