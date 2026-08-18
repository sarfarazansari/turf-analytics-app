import { useQuery } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";

import { getCashSettlements } from "../services/cash.service";

export function useCashSettlements(
  selectedDate: Date,
  enabled = true
) {
  const businessDate = dayjs(selectedDate).format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["cash-settlements", businessDate],
    queryFn: () => getCashSettlements(businessDate),
    enabled: enabled && !!selectedDate,
  });
}