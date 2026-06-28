"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Trash2,
  Pencil,
  CircleDollarSign,
} from "lucide-react";
import {
  formatMoney,
  formatExpenseCategory,
  formatPaymentMethod,
  formatSaleDate,
} from "@/lib/format";
import { expenseCategoryMeta, expensePaymentMeta } from "@/lib/expense-constants";
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
import type { Expense } from "@/types/api";
import { tableRowMenuButtonClass } from "@/components/shared/table-row-actions";

function ExpenseTableRow({
  expense,
  onDelete,
  showBranch,
}: {
  expense: Expense;
  onDelete: (id: string) => void;
  showBranch?: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const catMeta = expenseCategoryMeta(expense.category);
  const payMeta = expensePaymentMeta(expense.payment_method);
  const CatIcon = catMeta?.icon ?? CircleDollarSign;
  const PayIcon = payMeta?.icon ?? CircleDollarSign;

  return (
    <>
      <TableRow className="group">
        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
          {formatSaleDate(expense.expense_date)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <CatIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">
                {catMeta?.label ?? formatExpenseCategory(expense.category)}
              </p>
              {expense.note && (
                <p className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {expense.note}
                </p>
              )}
            </div>
          </div>
        </TableCell>
        {showBranch ? (
          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
            {expense.branch_name || "—"}
          </TableCell>
        ) : null}
        <TableCell className="hidden sm:table-cell">
          <Badge variant="outline" className="gap-1 text-[10px] font-normal">
            <PayIcon className="h-3 w-3" />
            {payMeta?.label ?? formatPaymentMethod(expense.payment_method)}
          </Badge>
        </TableCell>
        <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">
          {formatMoney(expense.amount, expense.currency)}
        </TableCell>
        <TableCell className="w-14 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className={tableRowMenuButtonClass}
                  aria-label="Expense actions"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href={`/expenses/${expense.id}/edit`} />}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
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
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {formatMoney(expense.amount, expense.currency)} from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
              onClick={() => {
                setDeleteOpen(false);
                onDelete(expense.id);
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

type ExpensesListTableProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
};

export function ExpensesListTable({ expenses, onDelete }: ExpensesListTableProps) {
  const showBranchCol = expenses.some((e) => Boolean(e.branch_name));
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Category</TableHead>
            {showBranchCol ? (
              <TableHead className="hidden lg:table-cell">Branch</TableHead>
            ) : null}
            <TableHead className="hidden sm:table-cell">Payment</TableHead>
            <TableHead className="text-right w-[120px]">Amount</TableHead>
            <TableHead className="w-14 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <ExpenseTableRow
              key={expense.id}
              expense={expense}
              onDelete={onDelete}
              showBranch={showBranchCol}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
