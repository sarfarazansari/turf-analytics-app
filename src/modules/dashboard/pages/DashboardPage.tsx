"use client";

import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { SummaryCards } from "../components/SummaryCards";
import { RevenueTrendChart } from "../components/RevenueTrendChart";
import { BookingTrendChart } from "../components/BookingTrendChart";
import dayjs from "@/lib/dayjs";
import { useKpiAnalytics } from "../hooks/useKpiAnalytics";
import type { DateRange, HourlyDemandItem } from "../types";
import { useTrendAnalytics } from "../hooks/useTrendAnalytics";
import { HourlyPerformanceChart } from "../components/HourlyPerformanceChart"
import { useHourlyDemand } from "../hooks/useHourlyDemand"
import { transformHourlyDemand } from "../utils/hourlyTransform"
import { useWeekdayWeekendStats } from "../hooks/useWeekdayWeekendStats";
import { WeekdayWeekendComparison } from "../components/WeekdayWeekendComparison";
import { useCustomerInsights } from "../hooks/useCustomerInsights";
import { CustomerInsightsSection } from "../components/CustomerInsightsSection";
import isoWeek from "dayjs/plugin/isoWeek";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SummaryCardsSkeleton } from "../components/SummaryCardsSkeleton";
dayjs.extend(isoWeek);

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
    startDate = dayjs().startOf("isoWeek").format("YYYY-MM-DD"); // Monday
    endDate = dayjs().endOf("isoWeek").format("YYYY-MM-DD"); // Sunday
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
    isPending,
    refetch: refetchKpi,
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
    refetch: refetchTrend,
  } = useTrendAnalytics({
    startDate,
    endDate,
    view,
  });

  // -----------------------------
  // 3. Hourly Demand (new)
  // -----------------------------

  const {
    data: hourlyRaw,
    isLoading: hourlyLoading,
    isError: hourlyError,
    refetch: refetchHourly,
  } = useHourlyDemand({
    startDate,
    endDate,
  })

  const hourlyData: HourlyDemandItem[] = hourlyRaw ? transformHourlyDemand(hourlyRaw, startDate, endDate) : []

  // -----------------------------
  // 3. weekday vs weekend (new)
  // -----------------------------

  const {
    data: weekdayWeekendData,
    isLoading: weekdayWeekendLoading,
    isError: weekdayWeekendError,
    refetch: refetchWeekdayWeekend,
  } = useWeekdayWeekendStats({
    startDate,
    endDate,
  });


  // -----------------------------
  // 3. Customer Insights (new - not implemented yet)
  // -----------------------------

  const { 
    data: customerInsightsData, 
    isLoading: customerInsightsLoading, 
    isError: customerInsightsError,
    refetch: refetchCustomerInsights,
  } = useCustomerInsights({
    startDate,
    endDate,
  });

  const isLoading = kpiLoading || trendLoading || hourlyLoading || weekdayWeekendLoading || customerInsightsLoading;
  const isError = kpiError || trendError || hourlyError || weekdayWeekendError || customerInsightsError;
  

  if (isLoading || isPending) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <SummaryCardsSkeleton />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>

        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border p-4">
        <p className="text-sm text-destructive">Error loading dashboard data.</p>
        <Button
          variant="outline"
          onClick={() => {
            void Promise.all([
              refetchKpi(),
              refetchTrend(),
              refetchHourly(),
              refetchWeekdayWeekend(),
              refetchCustomerInsights(),
            ]);
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

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

      {/* Hourly Demand */}
      {hourlyData && hourlyData.length > 0 && (
        <HourlyPerformanceChart data={hourlyData} />
      )}

      {/* Weekday vs Weekend */}
      {weekdayWeekendData && (
        <WeekdayWeekendComparison data={weekdayWeekendData} />
      )}

      {/* Customer Insights */}
      {customerInsightsData && (
        <CustomerInsightsSection data={customerInsightsData} />
      )}
    </div>
  );
}