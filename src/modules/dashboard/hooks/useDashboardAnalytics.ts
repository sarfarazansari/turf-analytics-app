"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  DashboardAnalytics,
  DateRange,
} from "../types";
import { getDashboardAnalytics } from "@/services/analytics.service";

interface UseDashboardAnalyticsProps {
  dateRange: DateRange | null;
}

export function useDashboardAnalytics({
  dateRange,
}: UseDashboardAnalyticsProps) {
  return useQuery<DashboardAnalytics>({
    queryKey: ["dashboard-analytics", dateRange],
    queryFn: () => getDashboardAnalytics({ dateRange }),
    enabled: !!dateRange,
  });
}