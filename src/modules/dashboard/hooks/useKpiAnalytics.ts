
import { useQuery } from "@tanstack/react-query";
import { getKPIAnalytics } from "@/services/analytics.service";
import { DashboardView, DateRange } from "../types";

interface UseDashboardAnalyticsParams {
  view: DashboardView;
  dateRange: DateRange | null;
}

export function useKpiAnalytics({
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
  });
}