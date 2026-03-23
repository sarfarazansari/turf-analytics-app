"use client";

import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { SummaryCards } from "../components/SummaryCards";
import { RevenueChart } from "../components/RevenueChart";
import { BookingTrendChart } from "../components/BookingTrendChart";
import { HourlyPerformanceChart } from "../components/HourlyPerformanceChart";
import { PaymentModeChart } from "../components/PaymentModeChart";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";
import type { DateRange } from "../types";
import dayjs from "dayjs"
import { RevenueTrendChart } from "../components/RevenueTrendChart";


export const revalidate = 0;
export function DashboardPageComponent() {

  const [dateRange, setDateRange] = useState<DateRange | null>({
    from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  })

  const { data, isLoading, isError, isPending } = useDashboardAnalytics({
    dateRange,
  });

  if (isLoading || isPending) {
    return <div>Loading dashboard...</div>;
  }

  if (isError) {
    return <div>Error loading dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SummaryCards summary={data?.summary} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart data={data?.revenueTrendNew} />
        <BookingTrendChart data={data?.bookingTrend} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HourlyPerformanceChart
          data={data?.hourlyPerformance}
          isLoading={isLoading}
        />
        <PaymentModeChart data={data?.paymentModes} isLoading={isLoading} />
      </div>
    </div>
  );
}