"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  DashboardAnalytics,
  DateRange,
} from "../types";
import { normalizeHourlyData } from "../utils/normalizeHourlyData";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import dayjs from "dayjs";

interface UseDashboardAnalyticsProps {
  dateRange: DateRange | null;
}

export function useDashboardAnalytics({
  dateRange,
}: UseDashboardAnalyticsProps) {
  return useQuery<DashboardAnalytics>({
    queryKey: ["dashboard-analytics", dateRange],

    queryFn: async () => {

      const { data, error } = await supabase.rpc("get_dashboard_analytics", {
        p_from_date:  dayjs(dateRange?.from).format("YYYY-MM-DD"),
        p_to_date: dayjs(dateRange?.to).format("YYYY-MM-DD"),
      });
      if (error) {
        throw new Error(error.message);
      }
      return data as DashboardAnalytics;
      // placeholder until backend thread
      // placeholder raw data
      const rawHourly = [
        { hour: 18, bookings: 5 },
        { hour: 19, bookings: 8 },
        { hour: 22, bookings: 2 },
      ];

      const hourlyPerformance = normalizeHourlyData(
        rawHourly,
        6,
        24
      );

      return {
        summary: {
          totalRevenue: 0,
          totalBookings: 0,
          totalHoursBooked: 0,
          occupancyRate: 0,
          cancellationCount: 0,
        },

        revenueTrend: [],

        bookingTrend: [],

        hourlyPerformance,

        paymentModes: [],
      };
    },

    enabled: !!dateRange,
  });
}