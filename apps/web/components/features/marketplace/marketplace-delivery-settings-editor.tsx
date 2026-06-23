"use client";

import { Plus, Trash2, Truck } from "lucide-react";
import type { StorefrontDeliveryRule, StorefrontDeliverySettings } from "@/types/api";
import { FEE_TYPE_OPTIONS } from "@/lib/storefront-delivery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleRow } from "./marketplace-storefront-shared";

function newRule(): StorefrontDeliveryRule {
  return {
    id: crypto.randomUUID(),
    label: "",
    description: "",
    fee_type: "quote",
    fee_amount: 0,
    fee_note: "",
    sort_order: 0,
  };
}

export function MarketplaceDeliverySettingsEditor({
  value,
  onChange,
}: {
  value: StorefrontDeliverySettings;
  onChange: (next: StorefrontDeliverySettings) => void;
}) {
  function patch(p: Partial<StorefrontDeliverySettings>) {
    onChange({ ...value, ...p });
  }

  function updateRule(index: number, patchRule: Partial<StorefrontDeliveryRule>) {
    const rules = value.rules.map((r, i) => (i === index ? { ...r, ...patchRule } : r));
    onChange({ ...value, rules });
  }

  function removeRule(index: number) {
    if (value.rules.length <= 1) return;
    onChange({ ...value, rules: value.rules.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      <ToggleRow
        label="Offer delivery on checkout"
        where="Product orders"
        description="Turn off if customers only pick up in store"
        checked={value.enabled}
        onChange={(enabled) => patch({ enabled })}
      />

      {value.enabled ? (
        <>
          <div className="space-y-2">
            <Label>Delivery terms (shown to customers)</Label>
            <Textarea
              rows={3}
              placeholder="e.g. We deliver Mon–Sat 9am–6pm. Orders after 4pm go out next day."
              value={value.instructions}
              onChange={(e) => patch({ instructions: e.target.value })}
              className="resize-none"
            />
          </div>

          <ToggleRow
            label="Require map pin"
            where="Checkout"
            description="Customer drops a pin so you know where to deliver"
            checked={value.require_map_pin}
            onChange={(require_map_pin) => patch({ require_map_pin })}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Delivery options
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add zones or methods — Accra free, Bolt paid by customer, outside Accra GH₵45, etc.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => patch({ rules: [...value.rules, { ...newRule(), sort_order: value.rules.length }] })}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add option
              </Button>
            </div>

            <div className="space-y-4">
              {value.rules.map((rule, index) => (
                <div key={rule.id} className="rounded-xl border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-muted-foreground">Option {index + 1}</p>
                    {value.rules.length > 1 ? (
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeRule(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Label *</Label>
                      <Input
                        value={rule.label}
                        onChange={(e) => updateRule(index, { label: e.target.value })}
                        placeholder="Accra — free delivery"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Description for customers</Label>
                      <Input
                        value={rule.description}
                        onChange={(e) => updateRule(index, { description: e.target.value })}
                        placeholder="Within Accra city limits, 1–2 days"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Fee type</Label>
                      <Select value={rule.fee_type} onValueChange={(v) => updateRule(index, { fee_type: v as StorefrontDeliveryRule["fee_type"] })}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        {FEE_TYPE_OPTIONS.find((o) => o.value === rule.fee_type)?.hint}
                      </p>
                    </div>
                    {rule.fee_type === "fixed" ? (
                      <div className="space-y-1.5">
                        <Label>Fee amount</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          className="h-10"
                          value={rule.fee_amount ?? 0}
                          onChange={(e) => updateRule(index, { fee_amount: Number(e.target.value) })}
                        />
                      </div>
                    ) : rule.fee_type === "customer_pays" || rule.fee_type === "quote" ? (
                      <div className="space-y-1.5">
                        <Label>Note (optional)</Label>
                        <Input
                          value={rule.fee_note ?? ""}
                          onChange={(e) => updateRule(index, { fee_note: e.target.value })}
                          placeholder="You pay Bolt / courier directly"
                          className="h-10"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}

      <div className="rounded-xl border p-4 space-y-4 bg-muted/10">
        <p className="text-sm font-medium">Payment at checkout</p>
        <ToggleRow
          label="Pay on delivery"
          where="Cash / MoMo when order arrives"
          checked={value.allow_pay_on_delivery}
          onChange={(allow_pay_on_delivery) => patch({ allow_pay_on_delivery })}
        />
        <ToggleRow
          label="Pay online"
          where="Card / MoMo via gateway"
          description="Coming soon — enable when your payment gateway is connected"
          checked={value.allow_pay_online}
          onChange={(allow_pay_online) => patch({ allow_pay_online })}
        />
      </div>

      <div className="space-y-2">
        <Label>Booking terms (services)</Label>
        <Textarea
          rows={3}
          placeholder="e.g. Cancellations within 24h forfeit deposit. Reschedule once for free."
          value={value.booking_instructions}
          onChange={(e) => patch({ booking_instructions: e.target.value })}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Shown on service booking flows. Deposits are set per service in Inventory → Services.
        </p>
      </div>
    </div>
  );
}
