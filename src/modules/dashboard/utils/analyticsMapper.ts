import dayjs from "dayjs";
import { DashboardView, TrendDataApiResponse } from "../types";


export function mapTrendData(
  data: TrendDataApiResponse,
  view: DashboardView
): any {

  if (!data) return null;

  const { current, previous } = data;

  // -----------------------------
  // 1. Labels (smart logic)
  // -----------------------------
  let labels: string[] = [];

  if (view === "WEEKLY") {
    // Always fixed
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  } else if (view === "MONTHLY") {
    // 1 → n (based on data length)
    labels = current.map((_, i) => (i + 1).toString());
  } else {
    // CUSTOM → actual dates
    labels = current.map((d) =>
      dayjs(d.date).format("DD MMM")
    );
  }

  // -----------------------------
  // 2. Revenue
  // -----------------------------
  const revenueCurrent = current.map((d) => d.revenue);
  const revenuePrevious = previous.map((d) => d.revenue);

  // -----------------------------
  // 3. Bookings
  // -----------------------------
  const bookingsCurrent = current.map((d) => d.bookings);
  const bookingsPrevious = previous.map((d) => d.bookings);

  return {
    labels,
    revenue: {
      current: revenueCurrent,
      previous: revenuePrevious,
    },
    bookings: {
      current: bookingsCurrent,
      previous: bookingsPrevious,
    },
  };
}