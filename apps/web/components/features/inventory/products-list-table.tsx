"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  RefreshCw,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";
import { InventoryItemPhoto } from "@/components/features/inventory/inventory-item-photo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InventoryItem } from "@/types/api";
import { tableRowActionButtonClass, tableRowMenuButtonClass } from "@/components/shared/table-row-actions";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  discontinued: { label: "Discontinued", className: "bg-destructive/10 text-destructive" },
};

function ProductTableRow({
  item,
  onDelete,
  onQuickAdjust,
}: {
  item: InventoryItem;
  onDelete: (id: string) => void;
  onQuickAdjust: (item: InventoryItem) => void;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const status = statusConfig[item.status] ?? statusConfig.active;

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <Link href={`/inventory/${item.id}`} className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden border">
              <InventoryItemPhoto
                src={item.photo_url}
                name={item.name}
                type="product"
                iconClassName="h-5 w-5 text-muted-foreground"
              />
            </div>
            <div className="min-w-0">
              <span className="font-medium text-sm hover:text-primary truncate block">{item.name}</span>
              {item.sku ? (
                <span className="text-xs text-muted-foreground font-mono truncate block">{item.sku}</span>
              ) : null}
            </div>
          </Link>
        </TableCell>
        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
          {item.category || "—"}
        </TableCell>
        <TableCell className="text-right tabular-nums">
          <span className="font-medium text-sm">
            {item.currency} {item.sell_price.toFixed(2)}
          </span>
          {item.cost_price > 0 ? (
            <p className="text-xs text-muted-foreground">{item.margin_pct.toFixed(0)}% margin</p>
          ) : null}
        </TableCell>
        <TableCell className="text-right tabular-nums hidden md:table-cell">
          <button
            type="button"
            onClick={() => onQuickAdjust(item)}
            className={cn(
              "text-sm font-medium rounded-md px-2 py-1 -mr-2 transition-colors hover:bg-muted",
              item.is_low_stock && "text-amber-600 dark:text-amber-400",
            )}
            title="Quick adjust stock"
          >
            {item.stock_qty} {item.unit || "units"}
          </button>
          {item.is_low_stock ? (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center justify-end gap-0.5">
              <AlertTriangle className="h-3 w-3" />
              Low
            </p>
          ) : null}
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <Badge className={cn("text-xs border-0", status.className)}>{status.label}</Badge>
        </TableCell>
        <TableCell className="text-right w-[7.5rem] sm:w-36">
          <div className="flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={tableRowActionButtonClass}
              onClick={() => onQuickAdjust(item)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Adjust
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className={tableRowMenuButtonClass}
                    aria-label={`Actions for ${item.name}`}
                  />
                }
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onQuickAdjust(item)}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Quick adjust
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/inventory/${item.id}`} />}>
                  <Eye className="mr-2 h-4 w-4" />
                  View detail
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href={`/inventory/${item.id}/edit`} />}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickAdjust(item)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restock
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from your inventory. Stock history is kept but the item won&apos;t appear in lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(item.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProductTableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-full max-w-[120px] rounded bg-muted animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ProductsListTable({
  items,
  isLoading,
  onDelete,
  onQuickAdjust,
}: {
  items: InventoryItem[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
  onQuickAdjust: (item: InventoryItem) => void;
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
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="text-right w-[7.5rem] sm:w-36">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductTableSkeleton key={i} />)
          ) : (
            items.map((item) => (
              <ProductTableRow
                key={item.id}
                item={item}
                onDelete={onDelete}
                onQuickAdjust={onQuickAdjust}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
