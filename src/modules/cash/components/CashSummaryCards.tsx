"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatCurrency } from "@/lib/currency-format";

type CashSummaryCardsProps = {
  totalRevenue: number;
  cashCollected: number;
  onlineCollected: number;
  cashExpenses: number;
  cashInHand: number;
};

export function CashSummaryCards({
  totalRevenue,
  cashCollected,
  onlineCollected,
  cashExpenses,
  cashInHand,

}: CashSummaryCardsProps) {
  

  const cards = [
    {
      title: "Revenue",
      value: totalRevenue,
    },
    {
      title: "Cash Collected",
      value: cashCollected,
    },
    {
      title: "Online Collected",
      value: onlineCollected,
    },
    {
      title: "Cash Expenses",
      value: cashExpenses,
    },
    {
      title: "Cash In Hand",
      value: cashInHand,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="break-words text-xl font-semibold sm:text-2xl">
              {formatCurrency(card.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}