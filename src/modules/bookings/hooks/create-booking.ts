import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
import { withTimeout } from "@/lib/withTimeout";
import toast from "react-hot-toast";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-booking"],
    retry: false,

    mutationFn: async (payload: any) => {
      try {
        const response = await withTimeout(
          (async () => {
            return await supabase.rpc("create_booking_with_payment", payload);
          })(),
          10000
        );

        if (response.error) {
          throw response.error;
        }

        return response.data;
      } catch (err) {
        throw err;
      }
    },

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