"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Banknote,
  CalendarClock,
  Check,
  ChevronRight,
  Clock,
  RefreshCw,
  Scissors,
  Sparkles,
  User,
  UserRound,
} from "lucide-react";
import { appointmentsApi, getApiErrorMessage } from "@/lib/api";
import { ServicePickerModal } from "@/components/features/inventory/service-picker-modal";
import { SALE_PAYMENT_METHODS } from "@/lib/sales-constants";
import { CustomerSearchSelect } from "@/components/features/customers/customer-search-select";
import { formatMoney } from "@/lib/format";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/components/features/appointments/appointment-status";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { InventoryItem } from "@/types/api";

const schema = z
  .object({
    booking_type: z.enum(["customer", "guest"]),
    service_id: z.string().uuid("Select a service"),
    customer_id: z.string().optional(),
    guest_name: z.string().optional(),
    guest_phone: z.string().optional(),
    date: z.string().min(1, "Pick a date"),
    slot: z.string().min(1, "Pick an available time slot"),
    notes: z.string().optional(),
    confirm_immediately: z.boolean(),
    collect_deposit: z.boolean(),
    deposit_amount: z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().min(0)),
    deposit_method: z.string(),
    deposit_reference: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.booking_type === "customer" && !data.customer_id) {
      ctx.addIssue({ code: "custom", message: "Select a customer", path: ["customer_id"] });
    }
    if (data.booking_type === "guest") {
      if (!data.guest_name?.trim()) {
        ctx.addIssue({ code: "custom", message: "Name required", path: ["guest_name"] });
      }
      if (!data.guest_phone?.trim()) {
        ctx.addIssue({ code: "custom", message: "Phone required", path: ["guest_phone"] });
      }
    }
    if (data.collect_deposit && data.deposit_amount <= 0) {
      ctx.addIssue({ code: "custom", message: "Enter deposit amount", path: ["deposit_amount"] });
    }
  });

type FormValues = z.infer<typeof schema>;

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold leading-tight">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function CreateAppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<InventoryItem | null>(null);
  const initialDate = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      booking_type: "customer",
      date: initialDate,
      slot: "",
      confirm_immediately: true,
      collect_deposit: false,
      deposit_amount: 0,
      deposit_method: "cash",
    },
  });

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) form.setValue("date", dateParam);
  }, [searchParams, form]);

  const serviceId = form.watch("service_id");
  const date = form.watch("date");
  const selectedSlot = form.watch("slot");
  const bookingType = form.watch("booking_type");
  const confirmImmediately = form.watch("confirm_immediately");
  const collectDeposit = form.watch("collect_deposit");
  const depositAmount = form.watch("deposit_amount");
  const depositMethod = form.watch("deposit_method");
  const guestName = form.watch("guest_name");
  const guestPhone = form.watch("guest_phone");
  const customerId = form.watch("customer_id");
  const notes = form.watch("notes");

  const { data: availability, refetch: refetchSlots, isFetching: slotsFetching } = useQuery({
    queryKey: ["appointment-slots", serviceId, date],
    queryFn: async () => {
      setSlotsLoading(true);
      try {
        return await appointmentsApi.availability(date, serviceId);
      } finally {
        setSlotsLoading(false);
      }
    },
    enabled: !!serviceId && !!date,
  });

  const slotsBusy = slotsLoading || slotsFetching;
  const slots = slotsBusy ? [] : (availability?.slots ?? []);

  useEffect(() => {
    if (selectedSlot && slots.length > 0 && !slots.includes(selectedSlot)) {
      form.setValue("slot", "", { shouldValidate: true });
    }
  }, [selectedSlot, slots, form]);

  useEffect(() => {
    form.setValue("slot", "", { shouldValidate: true });
  }, [serviceId, date, form]);

  const scheduledPreview = useMemo(() => {
    if (!selectedSlot) return null;
    return {
      iso: selectedSlot,
      dateLabel: formatAppointmentDate(selectedSlot),
      timeLabel: formatAppointmentTime(selectedSlot),
    };
  }, [selectedSlot]);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const createMutation = useMutation({
    mutationFn: (values: FormValues) =>
      appointmentsApi.create({
        service_id: values.service_id,
        customer_id: values.booking_type === "customer" ? values.customer_id : undefined,
        guest_name: values.booking_type === "guest" ? values.guest_name : undefined,
        guest_phone: values.booking_type === "guest" ? values.guest_phone : undefined,
        start_time: values.slot,
        notes: values.notes,
        confirm_immediately: values.confirm_immediately,
        ...(values.collect_deposit && values.deposit_amount > 0
          ? {
              deposit_paid: values.deposit_amount,
              deposit_method: values.deposit_method,
              deposit_ref: values.deposit_reference?.trim() || undefined,
            }
          : {}),
      }),
    onSuccess: (appt) => {
      toast.success("Booking created");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      router.push(`/appointments/${appt.id}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const whoLabel =
    bookingType === "guest"
      ? guestName?.trim() || guestPhone?.trim() || "Walk-in guest"
      : customerId
        ? "Selected customer"
        : "Customer not chosen";

  return (
    <form
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
      onSubmit={form.handleSubmit((v) => createMutation.mutate(v))}
    >
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" />
            Booking details
          </CardTitle>
          <CardDescription>
            Pick a service, who it is for, and when — takes under a minute.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Service */}
          <section className="space-y-4">
            <SectionHeading
              icon={Scissors}
              title="Service"
              description="From Inventory — must be marked bookable."
            />
            <button
              type="button"
              onClick={() => setServicePickerOpen(true)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-accent/50",
                serviceId ? "border-primary/40 bg-primary/5" : "border-dashed",
              )}
            >
              {selectedService ? (
                <div className="min-w-0">
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedService.duration_mins ? `${selectedService.duration_mins} min · ` : ""}
                    {formatMoney(selectedService.sell_price, selectedService.currency)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Choose a service</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Search your full catalog — scales to thousands of services.
                  </p>
                </div>
              )}
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
            <ServicePickerModal
              open={servicePickerOpen}
              onOpenChange={setServicePickerOpen}
              value={serviceId}
              onSelect={(service) => {
                setSelectedService(service);
                form.setValue("service_id", service.id, { shouldValidate: true });
                form.setValue("slot", "", { shouldValidate: true });
              }}
            />
            {form.formState.errors.service_id && (
              <p className="text-sm text-destructive">{form.formState.errors.service_id.message}</p>
            )}
            {selectedService ? (
              <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong>{selectedService.name}</strong>
                  {" · "}
                  {selectedService.duration_mins ?? 60} min
                  {" · "}
                  {formatMoney(selectedService.sell_price, selectedService.currency)}
                </span>
              </div>
            ) : null}
          </section>

          {/* Customer */}
          <section className="space-y-4 border-t pt-8">
            <SectionHeading icon={User} title="Who is this for?" />
            <Tabs
              value={bookingType}
              onValueChange={(v) => form.setValue("booking_type", v as "customer" | "guest")}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="customer" className="gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="guest" className="gap-1.5">
                  <UserRound className="h-3.5 w-3.5" />
                  Walk-in
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {bookingType === "customer" ? (
              <CustomerSearchSelect
                value={customerId ?? ""}
                onValueChange={(id) => form.setValue("customer_id", id, { shouldValidate: true })}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="guest_name">Name</Label>
                  <Input id="guest_name" placeholder="e.g. Ama Mensah" {...form.register("guest_name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest_phone">Phone</Label>
                  <Input
                    id="guest_phone"
                    type="tel"
                    placeholder="e.g. 024 123 4567"
                    {...form.register("guest_phone")}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Date & time — availability only */}
          <section className="space-y-4 border-t pt-8">
            <SectionHeading
              icon={Clock}
              title="When"
              description="Pick a day, then choose an open slot — only conflict-free times are shown."
            />
            {!serviceId ? (
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-center">
                Select a service first to see available times.
              </p>
            ) : (
              <>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    className="h-11"
                    min={today}
                    value={date}
                    onChange={(e) => {
                      form.setValue("date", e.target.value, { shouldValidate: true });
                      form.setValue("slot", "", { shouldValidate: true });
                    }}
                  />
                </div>

                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Available times
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => refetchSlots()}
                      disabled={!date}
                    >
                      <RefreshCw className={cn("h-3 w-3", slotsBusy && "animate-spin")} />
                      Refresh
                    </Button>
                  </div>
                  {slotsBusy ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                      <Spinner className="h-4 w-4" />
                      Checking open times…
                    </div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      No open slots this day — the business may be closed or fully booked. Try another
                      date.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          size="sm"
                          variant={selectedSlot === slot ? "default" : "outline"}
                          className="h-9 min-w-[4.5rem] text-xs"
                          onClick={() =>
                            form.setValue("slot", slot, { shouldValidate: true })
                          }
                        >
                          {formatAppointmentTime(slot)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {form.formState.errors.slot ? (
                  <p className="text-sm text-destructive">{form.formState.errors.slot.message}</p>
                ) : selectedSlot ? (
                  <p className="text-sm text-muted-foreground">
                    Selected:{" "}
                    <span className="font-medium text-foreground">
                      {formatAppointmentDate(selectedSlot)} at {formatAppointmentTime(selectedSlot)}
                    </span>
                  </p>
                ) : slots.length > 0 ? (
                  <p className="text-sm text-muted-foreground">Tap an available time to continue.</p>
                ) : null}
              </>
            )}
          </section>

          {/* Deposit */}
          <section className="space-y-4 border-t pt-8">
            <SectionHeading
              icon={Banknote}
              title="Deposit / partial payment"
              description="Optional — record money collected at booking."
            />
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/20 p-3">
              <Checkbox
                checked={collectDeposit}
                onCheckedChange={(v) => form.setValue("collect_deposit", v === true)}
              />
              <span className="text-sm leading-snug">
                <span className="font-medium">Collect deposit now</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Logs payment to accounts and counts toward the booking total.
                </span>
              </span>
            </label>
            {collectDeposit ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="deposit_amount">Amount received</Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder={
                      selectedService
                        ? `Up to ${formatMoney(selectedService.sell_price, selectedService.currency)}`
                        : "0.00"
                    }
                    {...form.register("deposit_amount")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <Select
                    value={depositMethod}
                    onValueChange={(v) => v && form.setValue("deposit_method", v)}
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
                <div className="space-y-2">
                  <Label htmlFor="deposit_reference">Reference (optional)</Label>
                  <Input
                    id="deposit_reference"
                    placeholder="MoMo ref…"
                    {...form.register("deposit_reference")}
                  />
                </div>
              </div>
            ) : null}
          </section>

          {/* Notes */}
          <section className="space-y-4 border-t pt-8">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Internal note for your team…"
                {...form.register("notes")}
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/20 p-3">
              <Checkbox
                checked={confirmImmediately}
                onCheckedChange={(v) => form.setValue("confirm_immediately", v === true)}
              />
              <span className="text-sm leading-snug">
                <span className="font-medium">Confirm immediately</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Skip pending status unless a deposit is still required.
                </span>
              </span>
            </label>
          </section>
        </CardContent>
      </Card>

      {/* Summary sidebar */}
      <div className="space-y-4 lg:sticky lg:top-6">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Review before you save.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Service
              </p>
              <p className="mt-1 font-medium">
                {selectedService?.name ?? "—"}
              </p>
              {selectedService ? (
                <p className="text-xs text-muted-foreground">
                  {selectedService.duration_mins ?? 60} min ·{" "}
                  {formatMoney(selectedService.sell_price, selectedService.currency)}
                </p>
              ) : null}
            </div>

            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Customer
              </p>
              <p className="mt-1 font-medium">{whoLabel}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                When
              </p>
              {scheduledPreview ? (
                <>
                  <p className="mt-1 font-medium">{scheduledPreview.dateLabel}</p>
                  <p className="text-muted-foreground">{scheduledPreview.timeLabel}</p>
                </>
              ) : (
                <p className="mt-1 text-muted-foreground">Pick an open slot</p>
              )}
            </div>

            {collectDeposit && depositAmount > 0 ? (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Deposit now
                </p>
                <p className="mt-1 font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {selectedService
                    ? formatMoney(depositAmount, selectedService.currency)
                    : depositAmount.toFixed(2)}
                </p>
                {selectedService && depositAmount < selectedService.sell_price ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Balance at visit:{" "}
                    {formatMoney(selectedService.sell_price - depositAmount, selectedService.currency)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {notes?.trim() ? (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 text-muted-foreground line-clamp-3">{notes.trim()}</p>
              </div>
            ) : null}

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                Status after save:{" "}
                <span className="font-medium text-foreground">
                  {confirmImmediately ? "Confirmed" : "Pending"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={createMutation.isPending || !serviceId || !selectedSlot}
          >
            {createMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Create booking
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/appointments")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
