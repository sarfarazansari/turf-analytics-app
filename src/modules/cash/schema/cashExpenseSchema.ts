import { z } from "zod";

export const cashExpenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  billAvailable: z.boolean(),

  notes: z
    .string()
    .trim()
    .optional(),
});

export type CashExpenseFormValues = z.infer<
  typeof cashExpenseSchema
>;