import { useQuery } from "@tanstack/react-query";
import { getCustomerInsights } from "@/services/analytics.service";


interface Props {
  startDate: string; // ISO
  endDate: string;   // ISO
  enabled?: boolean;
}

export function useCustomerInsights({ startDate, endDate, enabled = true }: Props) {
  
  return useQuery({
    queryKey: ["customer-insights", startDate, endDate],
    queryFn: () => getCustomerInsights({ startDate, endDate }),
    enabled: !!startDate && !!endDate && enabled,
  });
}