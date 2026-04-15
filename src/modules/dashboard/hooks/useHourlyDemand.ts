import { useQuery } from "@tanstack/react-query"
import { fetchHourlyDemand } from "@/services/hourly-demand.service"

export function useHourlyDemand({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) {
  return useQuery({
    queryKey: ["hourly-demand", startDate, endDate],
    queryFn: () => fetchHourlyDemand({ startDate, endDate }),
    enabled: !!startDate && !!endDate,
  })
}