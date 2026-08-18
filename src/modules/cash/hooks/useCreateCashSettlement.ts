import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCashSettlement } from "../services/cash.service";

type CreateCashSettlementPayload = {
  businessDate: string;
  settlementDate: string;
  amount: number;
  notes?: string | null;
  createdBy: string;
};

export function useCreateCashSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashSettlementPayload) =>
      createCashSettlement(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cash-settlements", variables.businessDate],
      });

      queryClient.invalidateQueries({
        queryKey: ["daily-cash-settlement", variables.businessDate],
      });
    },
  });
}