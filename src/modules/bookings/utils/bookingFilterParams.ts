import dayjs from "dayjs";
import { AdminBookingFilters } from "@/interfaces";

export function parseFiltersFromSearchParams(
  params: URLSearchParams
): AdminBookingFilters {
  const today = dayjs().format("YYYY-MM-DD");

  return {
    fromDate: params.get("from") || today,
    toDate: params.get("to") || today,
    bookingStatus: (params.get("bookingStatus") as any) || "ALL",
    paymentStatus: (params.get("paymentStatus") as any) || "ALL",
    search: params.get("search") || "",
    page: Number(params.get("page")) || 1,
  };
}

export function buildSearchParams(
  filters: AdminBookingFilters
): string {
  const params = new URLSearchParams();

  params.set("from", filters.fromDate);
  params.set("to", filters.toDate);

  if (filters.bookingStatus !== "ALL")
    params.set("bookingStatus", filters.bookingStatus);

  if (filters.paymentStatus !== "ALL")
    params.set("paymentStatus", filters.paymentStatus);

  if (filters.search)
    params.set("search", filters.search);

  if (filters.page)
    params.set("page", filters.page.toString());

  return params.toString();
}