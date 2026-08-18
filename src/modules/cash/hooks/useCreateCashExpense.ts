import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCashExpense } from "../services/cash.service";

type CreateCashExpensePayload = {
  businessDate: string;
  amount: number;
  description: string;
  billAvailable: boolean;
  notes?: string | null;
  createdBy: string;
};

export function useCreateCashExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashExpensePayload) =>
      createCashExpense(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cash-expenses", variables.businessDate],
      });

      queryClient.invalidateQueries({
        queryKey: ["daily-cash-settlement", variables.businessDate],
      });
    },
  });
}