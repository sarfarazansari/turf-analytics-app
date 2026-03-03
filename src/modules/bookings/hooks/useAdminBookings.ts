"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type {
  AdminBookingFilters,
  AdminBookingsResponse,
  AdminBookingSortBy,
  SortOrder,
} from "@/interfaces";

interface UseAdminBookingsParams {
  filters: AdminBookingFilters;
  page: number;
  limit: number;
  sortBy: AdminBookingSortBy;
  sortOrder: SortOrder;
}

export function useAdminBookings(filters: AdminBookingFilters & { page: number; limit: number; sortBy: AdminBookingSortBy; sortOrder: SortOrder }) {
  return useQuery<AdminBookingsResponse>({
    queryKey: [
      "admin-bookings",
      filters.fromDate,
      filters.toDate,
      filters.bookingStatus,
      filters.paymentStatus,
      filters.search,
      filters.page,
      filters.limit,
      // filters.sortBy,
      // filters.sortOrder,
    ],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_admin_bookings",
        {
          p_from_date: filters.fromDate,
          p_to_date: filters.toDate,
          p_booking_status: (filters.bookingStatus === "ALL" ? null : filters.bookingStatus),
          p_payment_status: (filters.paymentStatus === "ALL" ? null : filters.paymentStatus),
          p_search: filters.search || null,
          // p_sort_by: sortBy,
          // p_sort_order: sortOrder,
          p_page: filters.page,
          p_limit: filters.limit,
        }
      );

      if (error) {
        throw error;
      }

      return data as AdminBookingsResponse;
    },
    placeholderData: (previousData) => previousData,
  });
}