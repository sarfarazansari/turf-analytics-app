"use client";

import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { SummaryCards } from "../components/SummaryCards";
import { RevenueTrendChart } from "../components/RevenueTrendChart";
import { BookingTrendChart } from "../components/BookingTrendChart";
import { HourlyPerformanceChart } from "../components/HourlyPerformanceChart";
import { PaymentModeChart } from "../components/PaymentModeChart";
import { useKpiAnalytics } from "../hooks/useKpiAnalytics";
import type { DateRange } from "../types";
import dayjs from "dayjs";
import { useTrendAnalytics } from "../hooks/useTrendAnalytics";

export const revalidate = 0;

type DashboardView = "WEEKLY" | "MONTHLY" | "CUSTOM";

export function DashboardPageComponent() {
  const [view, setView] = useState<DashboardView>("WEEKLY");

  const [dateRange, setDateRange] = useState<DateRange | null>({
    from: dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  // -----------------------------
  // 1. Resolve date range (CORE)
  // -----------------------------
  let startDate: string;
  let endDate: string;

  if (view === "WEEKLY") {
    startDate = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"); // Monday
    endDate = dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD"); // Sunday
  } else if (view === "MONTHLY") {
    startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    endDate = dayjs().format("YYYY-MM-DD");
  } else {
    startDate = dateRange?.from!;
    endDate = dateRange?.to!;
  }

  // -----------------------------
  // 2. KPI (existing)
  // -----------------------------

  const { 
    data: kpiData,
    isLoading: kpiLoading,
    isError: kpiError, 
    isPending 
  } = useKpiAnalytics({
    view,
    dateRange: view === "CUSTOM" ? dateRange : null,
  });


  // -----------------------------
  // 3. Trend (new)
  // -----------------------------
  const {
    data: trendData,
    isLoading: trendLoading,
    isError: trendError,
  } = useTrendAnalytics({
    startDate,
    endDate,
    view,
  });

  const isLoading = kpiLoading || trendLoading;
  const isError = kpiError || trendError;
  

  if (isLoading || isPending) {
    return <div>Loading dashboard...</div>;
  }

  if (isError) {
    return <div>Error loading dashboard data.</div>;
  }

  console.log(trendData)

  return (
    <div className="space-y-6">
      <DashboardHeader
        view={view}
        onViewChange={setView}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* KPI Cards */}
      <SummaryCards summary={kpiData.summary} isLoading={kpiLoading} />


      {/* Trend Charts */}
      { trendData && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          <RevenueTrendChart
            labels={trendData.labels}
            current={trendData.revenue.current}
            previous={trendData.revenue.previous}
          />
          <BookingTrendChart
            labels={trendData.labels}
            current={trendData.bookings.current}
            previous={trendData.bookings.previous}
          />
       
        </div>
      )}

      {/* If you want, I’ll fix RevenueChart + BookingTrendChart properly — right now I guarantee they’re not aligned with your new system. */}
{/*
      

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HourlyPerformanceChart
          data={data?.hourlyPerformance}
          isLoading={isLoading}
        />
        <PaymentModeChart data={data?.paymentModes} isLoading={isLoading} />
      </div> */}
    </div>
  );
}