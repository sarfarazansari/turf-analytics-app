"use client";

import { useQuery } from "@tanstack/react-query"
import { getSupabase } from "@/lib/supabase";
const supabase = getSupabase();
// const supabase = getSupabase();

export interface PricingSlab {
  id: number
  start_time: string // HH:mm:ss
  end_time: string   // HH:mm:ss
  rate_per_hour: number
  is_active: boolean
}

export const usePricingSlabs = () => {
  return useQuery({
    queryKey: ["pricing-slabs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_slabs")
        .select("*")
        .order("start_time", { ascending: true })

      if (error) throw error
      return data as PricingSlab[]
    },
  })
}