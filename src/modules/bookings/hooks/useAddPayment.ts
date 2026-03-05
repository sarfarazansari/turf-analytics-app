"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookingPayment } from "@/services/bookings.service";

export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookingPayment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-booking-detail", variables.bookingId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-bookings"],
      });
    },
  });
}