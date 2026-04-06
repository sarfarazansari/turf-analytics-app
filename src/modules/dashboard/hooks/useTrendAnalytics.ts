import { useQuery } from "@tanstack/react-query";
import { fetchTrendAnalytics } from "@/services/analytics.service";
import { DashboardView } from "../types";

export function useTrendAnalytics({
  startDate,
  endDate,
  view,
}: {
  startDate: string;
  endDate: string;
  view: DashboardView;
}) {
  return useQuery({
    queryKey: ["trend-analytics", startDate, endDate, view],
    queryFn: () =>
      fetchTrendAnalytics({
        startDate,
        endDate,
        view,
      }),
    enabled: !!startDate && !!endDate && !!view,
  });
}