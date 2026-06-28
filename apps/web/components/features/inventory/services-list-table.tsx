"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { formatMoney } from "@/lib/format";
import { tableRowMenuButtonClass } from "@/components/shared/table-row-actions";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  discontinued: { label: "Discontinued", className: "bg-destructive/10 text-destructive" },
};

function ServiceTableRow({
  item,
  onDelete,
}: {
  item: InventoryItem;
  onDelete: (id: string) => void;
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
                type="service"
                iconClassName="h-5 w-5 text-muted-foreground"
              />
            </div>
            <div className="min-w-0">
              <span className="font-medium text-sm hover:text-primary truncate block">{item.name}</span>
              {item.description ? (
                <span className="text-xs text-muted-foreground truncate block">{item.description}</span>
              ) : null}
            </div>
          </Link>
        </TableCell>
        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
          {item.category || "—"}
        </TableCell>
        <TableCell className="text-right tabular-nums">
          <span className="font-medium text-sm">
            {formatMoney(item.sell_price, item.currency)}
            {item.pricing_type === "hourly" ? (
              <span className="text-xs font-normal text-muted-foreground">/hr</span>
            ) : null}
          </span>
          {item.cost_price > 0 ? (
            <p className="text-xs text-muted-foreground">{item.margin_pct.toFixed(0)}% margin</p>
          ) : null}
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {item.duration_mins ?? 60} min
          </span>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {item.is_bookable ? (
              <Badge
                variant="secondary"
                className="text-xs border-0 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
              >
                Bookable
              </Badge>
            ) : null}
            {item.storefront_visible ? (
              <Badge
                variant="secondary"
                className="text-xs border-0 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
              >
                Public
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">Hidden</span>
            )}
          </div>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <Badge className={cn("text-xs border-0", status.className)}>{status.label}</Badge>
        </TableCell>
        <TableCell className="text-right w-14">
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
              <DropdownMenuItem nativeButton={false} render={<Link href={`/inventory/${item.id}`} />}>
                <Eye className="mr-2 h-4 w-4" />
                View detail
              </DropdownMenuItem>
              <DropdownMenuItem nativeButton={false} render={<Link href={`/inventory/${item.id}/edit`} />}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the service from your catalogue. It won&apos;t appear in bookings or on your storefront.
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

function ServiceTableSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 w-full max-w-[120px] rounded bg-muted animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export function ServicesListTable({
  items,
  isLoading,
  onDelete,
}: {
  items: InventoryItem[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Service</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Storefront</TableHead>
            <TableHead className="hidden lg:table-cell">Status</TableHead>
            <TableHead className="text-right w-14">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <ServiceTableSkeleton key={i} />)
          ) : (
            items.map((item) => <ServiceTableRow key={item.id} item={item} onDelete={onDelete} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
