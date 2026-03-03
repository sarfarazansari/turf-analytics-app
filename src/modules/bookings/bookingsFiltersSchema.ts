import { z } from "zod";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

// export const bookingsFiltersSchema = z.object({
//   fromDate: z.date(),
//   toDate: z.date(),
//   bookingStatus: z.enum([
//     "ALL",
//     "BOOKED",
//     "COMPLETED",
//     "CANCELLED",
//   ]),
//   paymentStatus: z.enum([
//     "ALL",
//     "FULL_PAID",
//     "PARTIAL",
//     "UNPAID",
//   ]),
//   search: z.string(),
// });

export const bookingsFiltersSchema = z
  .object({
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
    bookingStatus: z.enum(["ALL", "BOOKED", "COMPLETED", "CANCELLED"]),
    paymentStatus: z.enum(["ALL", "FULL_PAID", "PARTIAL", "UNPAID"]),
    search: z.string().optional(),
  })
  .refine(
    (data) => dayjs(data.dateRange.to).isSameOrAfter(data.dateRange.from, "day"),
    {
      message: "End date must be after start date",
      path: ["dateRange"],
    }
  )
  .refine(
    (data) =>
      dayjs(data.dateRange.to).diff(data.dateRange.from, "day") <= 90,
    {
      message: "Date range cannot exceed 90 days",
      path: ["dateRange"],
    }
  );