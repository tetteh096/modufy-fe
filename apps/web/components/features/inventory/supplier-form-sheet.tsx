"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Truck } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Supplier } from "@/types/api";
import { cn } from "@/lib/utils";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type SupplierForm = z.infer<typeof supplierSchema>;

export function SupplierFormSheet({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Supplier;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!initial;
  const [showMore, setShowMore] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupplierForm>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  const phone = watch("phone");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      reset({
        name: initial.name,
        phone: initial.phone ?? "",
        whatsapp: initial.whatsapp ?? "",
        email: initial.email ?? "",
        address: initial.address ?? "",
        notes: initial.notes ?? "",
      });
      setShowMore(
        !!(initial.email || initial.address || initial.notes)
      );
    } else {
      reset({
        name: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: "",
        notes: "",
      });
      setShowMore(false);
    }
  }, [open, initial, reset]);

  const mutation = useMutation({
    mutationFn: (values: SupplierForm) =>
      isEdit
        ? inventoryApi.suppliers.update(initial!.id, values)
        : inventoryApi.suppliers.create(values),
    onSuccess: () => {
      toast.success(isEdit ? "Supplier updated" : "Supplier added");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      onOpenChange(false);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  function copyPhoneToWhatsApp() {
    if (phone?.trim()) setValue("whatsapp", phone.trim());
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <SheetTitle>{isEdit ? "Edit supplier" : "Add supplier"}</SheetTitle>
              <SheetDescription>
                {isEdit
                  ? "Update contact details for purchase orders and products."
                  : "Name and phone are enough to start — add more anytime."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="flex flex-1 flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Supplier name *</Label>
              <Input
                id="supplier-name"
                className="h-11"
                placeholder="e.g. Kofi Traders, Accra Market"
                autoFocus
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quick contact
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier-phone">Phone</Label>
                  <Input
                    id="supplier-phone"
                    className="h-11"
                    placeholder="024 000 0000"
                    {...register("phone")}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="supplier-whatsapp">WhatsApp</Label>
                    {phone?.trim() && (
                      <button
                        type="button"
                        className="text-[11px] text-primary hover:underline"
                        onClick={copyPhoneToWhatsApp}
                      >
                        Same as phone
                      </button>
                    )}
                  </div>
                  <Input
                    id="supplier-whatsapp"
                    className="h-11"
                    placeholder="024 000 0000"
                    {...register("whatsapp")}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Used for one-tap call and WhatsApp reorder from product pages.
              </p>
            </div>

            <div className="rounded-lg border">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
                onClick={() => setShowMore((v) => !v)}
              >
                More details
                <span className="text-xs font-normal text-muted-foreground">
                  email, address, notes
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    showMore && "rotate-180"
                  )}
                />
              </button>
              {showMore && (
                <div className="space-y-4 border-t px-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier-email">Email</Label>
                    <Input
                      id="supplier-email"
                      type="email"
                      className="h-11"
                      placeholder="orders@supplier.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-address">Address</Label>
                    <Input
                      id="supplier-address"
                      className="h-11"
                      placeholder="Shop location or warehouse"
                      {...register("address")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier-notes">Notes</Label>
                    <Textarea
                      id="supplier-notes"
                      rows={3}
                      className="resize-none"
                      placeholder="Payment terms, delivery days, contact person…"
                      {...register("notes")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="border-t bg-muted/20 sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto sm:min-w-[140px]"
            >
              {mutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
              {mutation.isPending
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Add supplier"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
