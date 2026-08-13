export interface PricingSlab {
  id: string
  start_time: string // HH:mm:ss
  end_time: string   // HH:mm:ss
  rate_per_hour: number
  is_active: boolean
  pricing_version_id: string;
  effective_from: string;
}