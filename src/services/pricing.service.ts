import { PricingSlab } from "@/interfaces/PricingSlab";
import { supabase } from "@/lib/supabase";

export async function getPricingSlabs() {
  const { data, error } = await supabase
    .from("pricing_slabs")
    .select(`
      id,
      start_time,
      end_time,
      rate_per_hour,
      is_active,
      pricing_version_id,
      pricing_versions!inner (
        effective_from
      )
    `)
    .eq("is_active", true)
    .order("start_time", { ascending: true });

  if (error) throw error;

  return data.map((slab: any) => ({
    id: slab.id,
    start_time: slab.start_time,
    end_time: slab.end_time,
    rate_per_hour: slab.rate_per_hour,
    is_active: slab.is_active,
    pricing_version_id: slab.pricing_version_id,
    effective_from: slab.pricing_versions.effective_from,
  })) as PricingSlab[];
}