"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Summary } from "../types";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";
import { formatCurrency } from "@/lib/currency-format";
import { formatNumber, formatPercentage } from "@/lib/number-format";
import { PaymentHealth } from "./PaymentHealth";

interface SummaryCardsProps {
  summary: Summary;
  isLoading?: boolean;
}

export function SummaryCards({
  summary,
  isLoading,
}: SummaryCardsProps) {
  
  if (isLoading) {
    return <SummaryCardsSkeleton />
  }

  const cards = [
    {
      label: "Revenue",
      value: formatCurrency(summary.revenue.current),
      previous: formatCurrency(summary.revenue.previous),
      change: summary.revenue.changePercent,
    },
    {
      label: "Bookings",
      value: formatNumber(summary.bookings.current),
      previous: formatNumber(summary.bookings.previous),
      change: summary.bookings.changePercent,
    },
    {
      label: "Utilization",
      value: `${summary.utilization.current.toFixed(1)}%`,
      previous: `${summary.utilization.previous.toFixed(1)}%`,
      change: summary.utilization.changePercent,
    },
    {
      label: "Avg Booking Value",
      value: formatCurrency(summary.avgBookingValue.current),
      previous: formatCurrency(summary.avgBookingValue.previous),
      change: summary.avgBookingValue.changePercent,
    },
  ];


  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const isPositive = card.change >= 0;

        return (
          <Card
            key={card.label}
          >
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>

            <CardContent className="mt-2 flex min-w-0 flex-wrap items-end justify-between gap-2">
              <h2 className="min-w-0 break-words text-lg font-semibold sm:text-xl">{card.value}</h2>

              <span
                className={`shrink-0 text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "↑" : "↓"} {formatPercentage(card.change)}
              </span>
            </CardContent>

            <CardFooter className="mt-1">
              Prev: {card.previous}
            </CardFooter>
          </Card>
        );
      })}

      <PaymentHealth paymentHealth={summary.paymentHealth}></PaymentHealth>
      
    </div>
  );
}