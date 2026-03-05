import { supabase } from "@/lib/supabase";
import { DashboardAnalytics, DateRange } from "@/modules/dashboard/types";
import dayjs from "dayjs";

interface UseDashboardAnalyticsProps {
  dateRange: DateRange | null;
}
  
export async function getDashboardAnalytics({
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