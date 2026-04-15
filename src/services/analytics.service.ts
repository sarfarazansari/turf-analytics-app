import { supabase } from "@/lib/supabase";
import { DashboardAnalytics, DashboardView, DateRange, KPIsData, KPIsResponse, TrendMappedData } from "@/modules/dashboard/types";
import { mapTrendData } from "@/modules/dashboard/utils/analyticsMapper";
import dayjs from "dayjs";


interface UseDashboardAnalyticsProps {
  view: DashboardView;
  dateRange: DateRange | null;
}

function getChangePercent(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100; // or decide if you want null instead
  }

  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function mapKpiData(raw: KPIsData) {
  const revenueCurrent = raw.current_revenue ?? 0;
  const revenuePrevious = raw.previous_revenue ?? 0;

  const bookingsCurrent = raw.current_bookings ?? 0;
  const bookingsPrevious = raw.previous_bookings ?? 0;

  const hoursCurrent = raw.total_hours_current ?? 0;
  const hoursPrevious = raw.total_hours_previous ?? 0;

  const paid = raw.paid ?? 0;
  const pending = raw.pending ?? 0;

  const avgBookingValueCurrent =
    bookingsCurrent > 0 ? revenueCurrent / bookingsCurrent : 0;

  const avgBookingValuePrevious =
    bookingsPrevious > 0 ? revenuePrevious / bookingsPrevious : 0;

  const utilizationCurrent =
    hoursCurrent > 0 ? (hoursCurrent / (hoursCurrent || 1)) * 100 : 0;

  const utilizationPrevious =
    hoursPrevious > 0 ? (hoursPrevious / (hoursPrevious || 1)) * 100 : 0;

  return {
    summary: {
      revenue: {
        current: revenueCurrent,
        previous: revenuePrevious,
        changePercent: getChangePercent(
          revenueCurrent,
          revenuePrevious
        ),
      },

      bookings: {
        current: bookingsCurrent,
        previous: bookingsPrevious,
        changePercent: getChangePercent(
          bookingsCurrent,
          bookingsPrevious
        ),
      },

      utilization: {
        current: utilizationCurrent,
        previous: utilizationPrevious,
        changePercent: getChangePercent(
          utilizationCurrent,
          utilizationPrevious
        ),
      },

      avgBookingValue: {
        current: Number(avgBookingValueCurrent.toFixed(2)),
        previous: Number(avgBookingValuePrevious.toFixed(2)),
        changePercent: getChangePercent(
          avgBookingValueCurrent,
          avgBookingValuePrevious
        ),
      },

      paymentHealth: {
        paid,
        pending,
      },
    },
  };
}

function getDateRanges(
  view: DashboardView,
  dateRange: DateRange | null 
): any {
  const today = dayjs();

  // WEEKLY (last 7 days vs previous 7 days)
  if (view === "WEEKLY") {
    const end = today;
    const start = today.subtract(6, "day");

    const prevEnd = start.subtract(1, "day");
    const prevStart = prevEnd.subtract(6, "day");

    return {
      current: {
        from: start.format("YYYY-MM-DD"),
        to: end.format("YYYY-MM-DD"),
      },
      previous: {
        from: prevStart.format("YYYY-MM-DD"),
        to: prevEnd.format("YYYY-MM-DD"),
      },
    };
  }

  // MONTHLY (current month till today vs same period last month)
  if (view === "MONTHLY") {
    const start = today.startOf("month");
    const end = today;

    const prevStart = today.subtract(1, "month").startOf("month");
    const prevEnd = today.subtract(1, "month").endOf("month");

    return {
      current: {
        from: start.format("YYYY-MM-DD"),
        to: end.format("YYYY-MM-DD"),
      },
      previous: {
        from: prevStart.format("YYYY-MM-DD"),
        to: prevEnd.format("YYYY-MM-DD"),
      },
    };
  }

  // CUSTOM (user selected vs previous same duration)
  if (!dateRange) {
    throw new Error("Custom view requires date range");
  }

  const start = dayjs(dateRange.from);
  const end = dayjs(dateRange.to);

  const diff = end.diff(start, "day");

  const prevEnd = start.subtract(1, "day");
  const prevStart = prevEnd.subtract(diff, "day");

  return {
    current: {
      from: start.format("YYYY-MM-DD"),
      to: end.format("YYYY-MM-DD"),
    },
    previous: {
      from: prevStart.format("YYYY-MM-DD"),
      to: prevEnd.format("YYYY-MM-DD"),
    },
  };
}
  
export async function getDashboardAnalyticsOld({
  dateRange,
}: UseDashboardAnalyticsProps) {

  const { data, error } = await supabase.rpc("get_dashboard_analytics", {
    p_from_date:  dayjs(dateRange?.from).format("YYYY-MM-DD"),
    p_to_date: dayjs(dateRange?.to).format("YYYY-MM-DD"),
  });
  if (error) {
    throw new Error(error.message);
  }
  return data as DashboardAnalytics;
}

export async function getKPIAnalytics({
  view,
  dateRange,
}: UseDashboardAnalyticsProps) {
  const ranges = getDateRanges(view, dateRange);
  const { data, error } = await supabase.rpc("get_kpis", {
    start_date: ranges.current.from,
    end_date: ranges.current.to,
    compare_start_date: ranges.previous.from,
    compare_end_date: ranges.previous.to,
  });

  if (error) {
    throw new Error(error.message);
  }

  return mapKpiData(data) as KPIsResponse;
}


export async function fetchTrendAnalytics({
  startDate,
  endDate,
  view,
}: {
  startDate: string;
  endDate: string;
  view: DashboardView;
}) {
  const { data, error } = await supabase.rpc("get_trend_analytics", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(error.message);
  }

  return mapTrendData(data, view) as TrendMappedData;
}


export async function getWeekdayWeekendStats({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { data, error } = await supabase.rpc("get_weekday_weekend_stats", {
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? {
    weekday: { revenue: 0, bookings: 0, minutes: 0 },
    weekend: { revenue: 0, bookings: 0, minutes: 0 },
  };

}