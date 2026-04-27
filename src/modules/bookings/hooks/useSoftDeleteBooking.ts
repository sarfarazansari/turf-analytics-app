"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"

type SoftDeleteBookingPayload = {
  bookingId: string;
  reason: string;
};

export function useSoftDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, reason }: SoftDeleteBookingPayload) => {
      const { error } = await supabase.rpc("delete_booking", {
        p_booking_id: bookingId,
        p_reason: reason,
      });

      if (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"], exact: false });
    },
  });
}