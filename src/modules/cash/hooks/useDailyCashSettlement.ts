import { useQuery } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";

import { getDailyCashSettlement } from "../services/cash.service";

export function useDailyCashSettlement(selectedDate: Date) {
  const businessDate = dayjs(selectedDate).format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["daily-cash-settlement", businessDate],

    queryFn: () => getDailyCashSettlement(businessDate),

    enabled: !!selectedDate,
  });
}