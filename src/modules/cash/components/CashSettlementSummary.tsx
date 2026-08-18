"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-format";

type CashSettlementSummaryProps = {
  cashAvailable: number;
  totalSettled: number;
  onAddSettlement: () => void;
};

export function CashSettlementSummary({
  cashAvailable,
  totalSettled,
  onAddSettlement,
}: CashSettlementSummaryProps) {
  console.log("CashSettlementSummary rendered with cashAvailable:", cashAvailable, "and totalSettled:", totalSettled);
  const remaining = cashAvailable - totalSettled;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cash Settlement</CardTitle>

        <Button onClick={onAddSettlement}>
          Add Settlement
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Cash In Hand
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(cashAvailable)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Settled
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(totalSettled)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Remaining
            </p>
            <p className="text-xl font-semibold">
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}