"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  DashboardView,
  DateRange,
} from "../types";
import { getKPIAnalytics } from "@/services/analytics.service";

interface UseDashboardAnalyticsParams {
  view: DashboardView;
  dateRange: DateRange | null;
}



// export function useDashboardAnalytics({
//   view,
//   dateRange,
// }: UseDashboardAnalyticsParams) {
//   return useQuery<DashboardAnalytics>({
//     queryKey: ["dashboard-analytics", dateRange],
//     queryFn: () => getDashboardAnalytics({ dateRange }),
//     enabled: !!dateRange,
//   });
// }

export function useDashboardAnalytics({
  view,
  dateRange,
}: UseDashboardAnalyticsParams) {
  return useQuery({
    queryKey: [
      "kpi-analytics",
      view,
      dateRange?.from,
      dateRange?.to,
],
    queryFn: () => getKPIAnalytics({ view, dateRange }),
    enabled: view === "CUSTOM" ? !!dateRange : true
    // staleTime: 1000 * 60 * 5, // 5 min
  });
}