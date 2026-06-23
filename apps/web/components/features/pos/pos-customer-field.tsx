"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserRound, UserPlus, X } from "lucide-react";
import { customersApi, getApiErrorMessage } from "@/lib/api";
import { CustomerSearchSelect } from "@/components/features/customers/customer-search-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/shared/spinner";

export function PosCustomerField({
  customerId,
  onCustomerIdChange,
}: {
  customerId: string;
  onCustomerIdChange: (id: string) => void;
}) {
  const qc = useQueryClient();
  const [quickOpen, setQuickOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      customersApi.create({
        name: name.trim(),
        phone: phone.trim() || undefined,
      }),
    onSuccess: (customer) => {
      toast.success("Customer added");
      onCustomerIdChange(customer.id);
      qc.invalidateQueries({ queryKey: ["customers"] });
      setQuickOpen(false);
      setName("");
      setPhone("");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div className="space-y-2 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <UserRound className="h-3.5 w-3.5" />
          Customer
          <span className="font-normal normal-case text-muted-foreground">(optional)</span>
        </p>
        {customerId ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onCustomerIdChange("")}
          >
            <X className="h-3 w-3 mr-1" />
            Walk-in
          </Button>
        ) : null}
      </div>
      <CustomerSearchSelect
        value={customerId}
        onValueChange={onCustomerIdChange}
        placeholder="Search name or phone…"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-xs"
        onClick={() => setQuickOpen(true)}
      >
        <UserPlus className="h-3.5 w-3.5" />
        Quick add customer
      </Button>
      {!customerId ? (
        <p className="text-[11px] text-muted-foreground leading-snug">
          Walk-in is fine — link a customer when you have a name or phone for receipts and history.
        </p>
      ) : null}

      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick add customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="pos-cust-name">Name</Label>
              <Input
                id="pos-cust-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emma Mensah"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pos-cust-phone">Phone (optional)</Label>
              <Input
                id="pos-cust-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 024 123 4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setQuickOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!name.trim() || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? <Spinner className="h-4 w-4" /> : "Save & attach"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
