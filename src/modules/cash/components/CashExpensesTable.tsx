"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/currency-format";
import { Button } from "@/components/ui/button";

type Expense = {
  id: string;
  businessDate: string;
  description: string;
  amount: number;
  billAvailable: boolean;
  notes?: string | null;
};

type CashExpensesTableProps = {
  expenses: Expense[];
  onAddExpense: () => void;
};

export function CashExpensesTable({
  expenses,
  onAddExpense,
}: CashExpensesTableProps) {

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Expenses</h2>

        <Button onClick={onAddExpense}>
          Add Expense
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Bill</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.businessDate}</TableCell>

                <TableCell className="font-medium">
                  {expense.description}
                </TableCell>

                <TableCell>
                  {formatCurrency(expense.amount)}
                </TableCell>

                <TableCell>
                  {expense.billAvailable ? "Yes" : "No"}
                </TableCell>

                <TableCell>
                  {expense.notes || "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}