import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBookingWithPayment } from "@/services/bookings.service";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-booking"],
    retry: false,
    mutationFn: createBookingWithPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error: any) => {
      console.error("SUPABASE RPC ERROR:", error);
      toast.error(
        error?.message || "Server not responding. Please try again."
      );
    },
  });
};