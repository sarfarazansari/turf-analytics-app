import { z } from "zod";

export const cashSettlementSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0"),

  settlementDate: z.date(),

  notes: z
    .string()
    .trim()
    .optional(),
});

export type CashSettlementFormValues = z.infer<
  typeof cashSettlementSchema
>;