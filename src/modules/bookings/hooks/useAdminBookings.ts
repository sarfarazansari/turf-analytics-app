"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  AdminBookingFilters,
  AdminBookingsResponse,
} from "@/interfaces";
import { getAdminBookings } from "@/services/bookings.service";

interface UseAdminBookingsParams extends AdminBookingFilters {
  page: number;
  limit: number;
}

export function useAdminBookings(filters: UseAdminBookingsParams) {
  return useQuery<AdminBookingsResponse>({
    queryKey: [
      "admin-bookings",
      filters.fromDate,
      filters.toDate,
      filters.bookingStatus,
      filters.paymentStatus,
      filters.search,
      filters.page,
      filters.limit
    ],
    queryFn: () => getAdminBookings(filters),
    placeholderData: (previousData) => previousData,
  });
}