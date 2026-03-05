"use client";

import { useQuery } from "@tanstack/react-query";
import { getPricingSlabs } from "@/services/pricing.service";

export function usePricingSlabs() {
  return useQuery<any>({
    queryKey: ["pricing-slabs"],
    queryFn: () => getPricingSlabs()
  });
}