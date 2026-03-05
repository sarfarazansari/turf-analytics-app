"use client";

import { useQuery } from "@tanstack/react-query";
import type { AdminBookingDetail } from "@/interfaces";
import { getAdminBookingDetails } from "@/services/bookings.service";

export function useAdminBookingDetail(bookingId: string | null) {
  return useQuery<AdminBookingDetail>({
    queryKey: ["admin-booking-detail", bookingId],
    queryFn: () => getAdminBookingDetails(bookingId as string),
    enabled: !!bookingId,
  });
}