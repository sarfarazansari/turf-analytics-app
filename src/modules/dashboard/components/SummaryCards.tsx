"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSummary } from "../types";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";
import { formatCurrency } from "@/lib/currency-format";
import { formatNumber, formatPercentage } from "@/lib/number-format";

interface SummaryCardsProps {
  summary?: DashboardSummary;
  isLoading?: boolean;
}

export function SummaryCards({
  summary,
  isLoading,
}: SummaryCardsProps) {
  
  if (isLoading) {
    return <SummaryCardsSkeleton />
  }

  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
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
      </Card>
    </div>
  );
}