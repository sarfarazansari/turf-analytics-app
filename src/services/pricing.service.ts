import { PricingSlab } from "@/interfaces/PricingSlab";
import { supabase } from "@/lib/supabase";

  
export async function getPricingSlabs() {

  const { data, error } = await supabase
    .from("pricing_slabs")
    .select("*")
    .order("start_time", { ascending: true })

  if (error) throw error
  return data as PricingSlab[]
}