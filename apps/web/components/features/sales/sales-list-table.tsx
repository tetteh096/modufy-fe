"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  Wallet,
  User,
} from "lucide-react";
import { paymentMethodMeta } from "@/lib/sales-constants";
import { formatMoney, formatPaymentMethod, formatSaleDate } from "@/lib/format";
import { saleSourceBadgeClass, saleSourceLabel } from "@/lib/sale-source";
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
import type { Sale } from "@/types/api";
import { tableRowMenuButtonClass } from "@/components/shared/table-row-actions";

function SaleTableRow({
  sale,
  onDelete,
  showBranch,
}: {
  sale: Sale;
  onDelete: (id: string) => void;
  showBranch?: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const firstLine = sale.lines[0]?.description ?? "Sale";
  const payMeta = paymentMethodMeta(sale.payment_method);
  const PayIcon = payMeta?.icon ?? Wallet;
  const itemCount = sale.lines.length;

  return (
    <>
      <TableRow className="group">
        <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
          {formatSaleDate(sale.sale_date)}
        </TableCell>
        <TableCell>
          <Link
            href={`/sales/${sale.id}`}
            className="font-medium text-sm hover:text-primary line-clamp-2"
          >
            {firstLine}
          </Link>
          {sale.receipt_number ? (
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{sale.receipt_number}</p>
          ) : null}
          {itemCount > 1 && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              +{itemCount - 1} more item{itemCount > 2 ? "s" : ""}
            </p>
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {sale.customer_name ? (
            <span className="flex items-center gap-1.5 text-sm truncate max-w-[160px]">
              <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              {sale.customer_name}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Walk-in</span>
          )}
        </TableCell>
        {showBranch ? (
          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
            {sale.branch_name || "—"}
          </TableCell>
        ) : null}
        <TableCell className="hidden sm:table-cell">
          <div className="flex flex-col gap-1 items-start">
            <Badge variant="outline" className="gap-1 font-normal text-[10px]">
              <PayIcon className="h-3 w-3" />
              {formatPaymentMethod(sale.payment_method)}
            </Badge>
            {sale.source_type && sale.source_type !== "manual" ? (
              <Badge variant="outline" className={`text-[10px] font-normal ${saleSourceBadgeClass(sale.source_type)}`}>
                {saleSourceLabel(sale.source_type)}
              </Badge>
            ) : null}
          </div>
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          <p className="font-semibold tabular-nums">{formatMoney(sale.total, sale.currency)}</p>
          {(sale.amount_paid ?? 0) > 0 && (sale.amount_due ?? 0) > 0 && sale.status === "pending" ? (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
              {formatMoney(sale.amount_paid ?? 0, sale.currency)} paid
            </p>
          ) : null}
          {sale.status === "pending" ? (
            <Badge variant="secondary" className="mt-1 text-[10px] font-normal">
              Pending
            </Badge>
          ) : null}
        </TableCell>
        <TableCell className="w-14 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className={tableRowMenuButtonClass}
                  aria-label="Sale actions"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/sales/${sale.id}`} />}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/sales/${sale.id}/edit`} />}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
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
            <AlertDialogTitle>Delete sale?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {formatMoney(sale.total, sale.currency)} from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => {
                setDeleteOpen(false);
                onDelete(sale.id);
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

type SalesListTableProps = {
  sales: Sale[];
  onDelete: (id: string) => void;
  showBranch?: boolean;
};

export function SalesListTable({ sales, onDelete, showBranch }: SalesListTableProps) {
  const showBranchCol = showBranch ?? sales.some((s) => Boolean(s.branch_name));
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden md:table-cell">Customer</TableHead>
            {showBranchCol ? (
              <TableHead className="hidden lg:table-cell">Branch</TableHead>
            ) : null}
            <TableHead className="hidden sm:table-cell">Payment</TableHead>
            <TableHead className="text-right w-[120px]">Amount</TableHead>
            <TableHead className="w-14 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <SaleTableRow
              key={sale.id}
              sale={sale}
              onDelete={onDelete}
              showBranch={showBranchCol}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
