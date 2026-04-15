import { supabase } from "@/lib/supabase";
import { HourlyDemandItemAPI } from "@/modules/dashboard/types";

export async function fetchHourlyDemand({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) {
  const { data, error } = await supabase.rpc("get_hourly_demand", {
    p_start_date: startDate,
    p_end_date: endDate,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data as HourlyDemandItemAPI[]
}