import { useQuery } from "@tanstack/react-query";
import { getWeekdayWeekendStats } from "@/services/analytics.service";

export function useWeekdayWeekendStats({
  startDate,
  endDate,
  enabled = true,
}: {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["weekday-weekend-stats", startDate, endDate],
    queryFn: () =>
      getWeekdayWeekendStats({
        startDate,
        endDate,
      }),
    enabled: !!startDate && !!endDate && enabled,
  });
}