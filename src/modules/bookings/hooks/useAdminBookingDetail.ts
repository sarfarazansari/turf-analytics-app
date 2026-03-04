"use client";

import { useQuery } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import type { AdminBookingDetail } from "@/interfaces";

export function useAdminBookingDetail(bookingId: string | null) {
  return useQuery<AdminBookingDetail>({
    queryKey: ["admin-booking-detail", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID");

      const { data, error } = await supabase.rpc(
        "get_admin_booking_detail",
        { p_booking_id: bookingId }
      );

      if (error) throw error;

      return data as AdminBookingDetail;
    },
    enabled: !!bookingId,
  });
}