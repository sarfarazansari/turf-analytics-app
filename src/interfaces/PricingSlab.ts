export interface PricingSlab {
  id: number
  start_time: string // HH:mm:ss
  end_time: string   // HH:mm:ss
  rate_per_hour: number
  is_active: boolean
}