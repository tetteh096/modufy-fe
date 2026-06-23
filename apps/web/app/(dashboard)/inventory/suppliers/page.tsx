"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Truck, MoreHorizontal, Trash2, Pencil, Phone, MessageCircle } from "lucide-react";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { SupplierFormSheet } from "@/components/features/inventory/supplier-form-sheet";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Supplier } from "@/types/api";

function SupplierRow({
  sup,
  onEdit,
  onDelete,
}: {
  sup: Supplier;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const waNumber = sup.whatsapp?.replace(/\D/g, "");

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/40 rounded-lg transition-colors group">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Truck className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{sup.name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {[sup.phone, sup.whatsapp && sup.whatsapp !== sup.phone ? sup.whatsapp : null, sup.email]
            .filter(Boolean)
            .join(" · ") || "Add phone or WhatsApp for quick reorder"}
        </p>
      </div>
      <div className="flex gap-1 shrink-0">
        {sup.phone && (
          <Button
            nativeButton={false}
            render={<a href={`tel:${sup.phone}`} aria-label="Call supplier" />}
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <Phone className="h-4 w-4" />
          </Button>
        )}
        {waNumber && (
          <Button
            nativeButton={false}
            render={
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp supplier"
              />
            }
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-emerald-600 hover:text-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            />
          }
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function SuppliersPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | undefined>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: inventoryApi.suppliers.list,
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.suppliers.delete,
    onSuccess: () => {
      toast.success("Supplier deleted");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const suppliers = data?.suppliers ?? [];

  function openAdd() {
    setEditing(undefined);
    setSheetOpen(true);
  }

  function openEdit(sup: Supplier) {
    setEditing(sup);
    setSheetOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description={
          suppliers.length > 0
            ? `${suppliers.length} supplier${suppliers.length !== 1 ? "s" : ""} · tap to call or WhatsApp`
            : "Who you buy stock from — link them to products for quick reorders"
        }
        action={
          <Button onClick={openAdd} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add supplier
          </Button>
        }
      />

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <EmptyState
              icon={<Truck className="h-8 w-8" />}
              title="No suppliers yet"
              description="Add who you buy from. Link suppliers on products for one-tap call and WhatsApp when stock runs low."
              action={
                <Button onClick={openAdd} size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add first supplier
                </Button>
              }
            />
          ) : (
            <div className="divide-y">
              {suppliers.map((sup) => (
                <SupplierRow
                  key={sup.id}
                  sup={sup}
                  onEdit={() => openEdit(sup)}
                  onDelete={() => deleteMutation.mutate(sup.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SupplierFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditing(undefined);
        }}
        initial={editing}
      />
    </div>
  );
}
