"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Pencil, Star } from "lucide-react";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inventoryApi, getApiErrorMessage } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { InventoryItem } from "@/types/api";
import { cn } from "@/lib/utils";

function VisibilityToggle({ item }: { item: InventoryItem }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () =>
      inventoryApi.update(item.id, { storefront_visible: !item.storefront_visible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-products-storefront"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-products-storefront-stats"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(item.storefront_visible ? "Hidden from storefront" : "Now visible on storefront");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  return (
    <button
      type="button"
      role="switch"
      aria-checked={item.storefront_visible}
      aria-label={`${item.storefront_visible ? "Hide" : "Show"} ${item.name} on storefront`}
      disabled={toggleMutation.isPending}
      onClick={() => toggleMutation.mutate()}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-50",
        item.storefront_visible ? "bg-primary" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
          item.storefront_visible ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function StorefrontProductRow({ item }: { item: InventoryItem }) {
  return (
    <TableRow className="group">
      <TableCell>
        <Link href={`/inventory/${item.id}`} className="flex items-center gap-3 min-w-0 hover:text-primary">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden border">
            <InventoryItemPhoto
              src={item.photo_url}
              name={item.name}
              type="product"
              iconClassName="h-5 w-5 text-muted-foreground"
            />
          </div>
          <div className="min-w-0">
            <span className="font-medium text-sm truncate block">{item.name}</span>
            <div className="flex flex-wrap items-center gap-1 mt-0.5">
              {item.has_variants ? (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Variants
                </Badge>
              ) : null}
              {item.is_featured ? (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                  <Star className="h-2.5 w-2.5" />
                  Featured
                </Badge>
              ) : null}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
        {item.category || "—"}
      </TableCell>
      <TableCell className="text-right tabular-nums text-sm font-medium whitespace-nowrap">
        {formatMoney(item.sell_price, item.currency)}
      </TableCell>
      <TableCell className="text-right tabular-nums hidden md:table-cell text-sm">
        {item.stock_qty > 0 ? (
          <span>{item.stock_qty} in stock</span>
        ) : (
          <span className="text-destructive">Out of stock</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <VisibilityToggle item={item} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            nativeButton={false}
            render={<Link href={`/inventory/${item.id}`} />}
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          <Button
            nativeButton={false}
            render={<Link href={`/inventory/${item.id}/edit`} />}
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 hidden sm:inline-flex"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-full max-w-[100px] rounded bg-muted animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function StorefrontProductsTable({
  items,
  isLoading,
}: {
  items: InventoryItem[];
  isLoading?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right hidden md:table-cell">Stock</TableHead>
            <TableHead className="text-center w-24">Visible</TableHead>
            <TableHead className="text-right w-36">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <TableSkeleton key={i} />)
            : items.map((item) => <StorefrontProductRow key={item.id} item={item} />)}
        </TableBody>
      </Table>
    </div>
  );
}
