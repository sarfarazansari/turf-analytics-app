import { useQuery } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";

import { getCashExpenses } from "../services/cash.service";

export function useCashExpenses(
  selectedDate: Date,
  enabled = true
) {
  const businessDate = dayjs(selectedDate).format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["cash-expenses", businessDate],
    queryFn: () => getCashExpenses(businessDate),
    enabled: enabled && !!selectedDate,
  });
}