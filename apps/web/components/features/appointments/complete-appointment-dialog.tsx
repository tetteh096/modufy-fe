"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ExternalLink, Receipt } from "lucide-react";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { SALE_PAYMENT_METHODS } from "@/lib/sales-constants";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Appointment, CompleteAppointmentRequest } from "@/types/api";

export function CompleteAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onCompleted,
}: {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: (updated: Appointment) => void;
}) {
  const balanceDue = Math.max(0, appointment.service_price - (appointment.deposit_paid ?? 0));
  const [balanceAmount, setBalanceAmount] = useState(balanceDue);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [sendReceipt, setSendReceipt] = useState(true);

  useEffect(() => {
    if (open) {
      setBalanceAmount(balanceDue);
      setPaymentMethod("cash");
      setReference("");
      setSendReceipt(true);
    }
  }, [open, balanceDue]);

  const fullyPaid = useMemo(
    () => balanceDue <= 0 && (appointment.deposit_paid ?? 0) >= appointment.service_price,
    [appointment.deposit_paid, appointment.service_price, balanceDue],
  );

  const completeMutation = useMutation({
    mutationFn: (body: CompleteAppointmentRequest) => appointmentsApi.complete(appointment.id, body),
    onSuccess: (updated) => {
      const link = updated.receipt_whatsapp_link;
      if (link) {
        toast.success("Completed — receipt ready", {
          description: "Opening WhatsApp to send the receipt.",
          action: {
            label: "Open",
            onClick: () => window.open(link, "_blank", "noopener,noreferrer"),
          },
        });
        window.open(link, "_blank", "noopener,noreferrer");
      } else if (updated.invoice_id) {
        toast.success("Completed — invoice paid");
      } else {
        toast.success("Appointment completed");
      }
      onCompleted(updated);
      onOpenChange(false);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function handleSubmit() {
    const body: CompleteAppointmentRequest = {
      send_receipt: sendReceipt,
    };
    if (balanceDue > 0) {
      body.balance_amount = balanceAmount;
      body.payment_method = paymentMethod;
      if (reference.trim()) body.reference = reference.trim();
    }
    completeMutation.mutate(body);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete appointment</DialogTitle>
          <DialogDescription>
            Collect any remaining balance, mark the booking complete, and optionally send a paid receipt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Service total</span>
              <span className="font-medium tabular-nums">
                {formatMoney(appointment.service_price, appointment.currency)}
              </span>
            </div>
            {(appointment.deposit_paid ?? 0) > 0 ? (
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Deposit already paid</span>
                <span className="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                  −{formatMoney(appointment.deposit_paid, appointment.currency)}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between gap-2 border-t pt-2 font-semibold">
              <span>Balance due</span>
              <span className="tabular-nums">{formatMoney(balanceDue, appointment.currency)}</span>
            </div>
          </div>

          {balanceDue > 0 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="balance_amount">Amount collected now</Label>
                <Input
                  id="balance_amount"
                  type="number"
                  min={0}
                  max={balanceDue}
                  step="0.01"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment method</Label>
                <Select value={paymentMethod} onValueChange={(v) => v && setPaymentMethod(v)}>
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
              <div className="space-y-2">
                <Label htmlFor="payment_ref">Reference (optional)</Label>
                <Input
                  id="payment_ref"
                  placeholder="MoMo ref, receipt no…"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
            </>
          ) : fullyPaid ? (
            <p className="text-muted-foreground text-xs">
              Fully paid from deposit — no balance to collect.
            </p>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
            <Checkbox checked={sendReceipt} onCheckedChange={(v) => setSendReceipt(v === true)} />
            <span className="leading-snug">
              <span className="font-medium flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" />
                Send paid receipt
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Opens WhatsApp with a receipt message when the customer has a phone number.
              </span>
            </span>
          </label>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2"
            disabled={completeMutation.isPending || (balanceDue > 0 && balanceAmount <= 0)}
            onClick={handleSubmit}
          >
            {completeMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Complete &amp; {balanceDue > 0 ? "record payment" : "finish"}
            {sendReceipt ? <ExternalLink className="h-3.5 w-3.5 opacity-70" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
