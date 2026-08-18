"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/currency-format";

type Settlement = {
  id: string;
  businessDate: string;
  settlementDate: string;
  amount: number;
  notes?: string | null;
};

type CashSettlementsTableProps = {
  settlements: Settlement[];
  onAddSettlement?: () => void;
};

export function CashSettlementsTable({
  settlements,
  onAddSettlement,
}: CashSettlementsTableProps) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-6 py-4">
      <h2 className="font-semibold">Settlements</h2>

      <Button onClick={onAddSettlement}>
        Add Settlement
      </Button>
    </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Date</TableHead>
            <TableHead>Settlement Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {settlements.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No settlements found.
              </TableCell>
            </TableRow>
          ) : (
            settlements.map((settlement) => (
              <TableRow key={settlement.id}>
                <TableCell>{settlement.businessDate}</TableCell>

                <TableCell>{settlement.settlementDate}</TableCell>

                <TableCell className="font-medium">
                  {formatCurrency(settlement.amount)}
                </TableCell>

                <TableCell>
                  {settlement.notes || "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}