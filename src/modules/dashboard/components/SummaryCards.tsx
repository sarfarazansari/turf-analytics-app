"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Summary } from "../types";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";
import { formatCurrency } from "@/lib/currency-format";
import { formatNumber, formatPercentage } from "@/lib/number-format";

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const isPositive = card.change >= 0;

        return (
          <Card
            key={card.label}
          >
            <CardHeader>
              <CardTitle>{card.label}</CardTitle>
            </CardHeader>

            <CardContent className="mt-2 flex items-end justify-between">
              <h2 className="text-xl font-semibold">{card.value}</h2>

              <span
                className={`text-sm font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "↑" : "↓"} {formatPercentage(card.change)}
              </span>
            </CardContent>

            <CardFooter className="mt-1 text-xs text-gray-400">
              Prev: {card.previous}
            </CardFooter>
          </Card>
        );
      })}
      <Card>
        <CardHeader>
          <CardTitle>Payment Health</CardTitle>
        </CardHeader>

        <CardContent className="mt-2 flex justify-between text-sm">
          <span>Paid: ₹{summary.paymentHealth.paid}</span>
          <span>Pending: ₹{summary.paymentHealth.pending}</span>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {formatCurrency(summary?.totalRevenue ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {formatNumber(summary?.totalBookings ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Hours</CardTitle>
        </CardHeader>
        <CardContent>
          {formatNumber(summary?.totalHoursBooked ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          {formatPercentage(summary?.occupancyRate ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancellations</CardTitle>
        </CardHeader>
        <CardContent>
          {formatNumber(summary?.cancellationCount ?? 0)}
        </CardContent>
      </Card> */}
    </div>
  );
}