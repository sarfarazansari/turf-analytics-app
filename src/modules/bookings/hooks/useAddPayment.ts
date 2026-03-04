"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();

interface AddPaymentInput {
  bookingId: string;
  amount: number;
  paymentMode: "CASH" | "UPI" | "ONLINE" | "OTHER";
}

export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      amount,
      paymentMode,
    }: AddPaymentInput) => {
      const { error } = await supabase.rpc(
        "add_booking_payment",
        {
          p_booking_id: bookingId,
          p_amount: amount,
          p_payment_mode: paymentMode,
        }
      );

      if (error) throw error;
    },
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