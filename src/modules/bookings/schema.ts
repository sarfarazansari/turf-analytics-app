import { z } from "zod";
import dayjs from "dayjs";

export const bookingFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Customer name is required"),

  customer_phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter valid 10 digit phone number"),

  booking_date: z
    .string()
    .min(1, "Booking date is required"),

  start_time: z
    .string()
    .min(1, "Start time is required"),

  end_time: z
    .string()
    .min(1, "End time is required"),

  advance_amount: z
    .number()
    .min(0, "Advance cannot be negative")
    .default(0),

  payment_mode: z
    .enum(["CASH", "UPI"])
    .optional(),

  collected_by: z
    .string()
    .min(1, "Collected by is required"),

  notes: z
    .string()
    .optional(),
})
.superRefine((data, ctx) => {
  const start = dayjs(`${data.booking_date} ${data.start_time}`);
  const end = dayjs(`${data.booking_date} ${data.end_time}`);

  // Handle midnight crossover
  const finalEnd =
    end.isBefore(start) ? end.add(1, "day") : end;

  if (!finalEnd.isAfter(start)) {
    ctx.addIssue({
      code: 'custom',
      message: "End time must be after start time",
      path: ["end_time"],
    });
  }

  const durationHours = finalEnd.diff(start, "hour", true);

  if (durationHours <= 0) {
    ctx.addIssue({
      code: 'custom',
      message: "Invalid booking duration",
      path: ["end_time"],
    });
  }

  // OPTIONAL: enforce minimum 1 hour if needed
  if (durationHours < 1) {
    ctx.addIssue({
      code: 'custom',
      message: "Minimum booking duration is 1 hour",
      path: ["end_time"],
    });
  }
});