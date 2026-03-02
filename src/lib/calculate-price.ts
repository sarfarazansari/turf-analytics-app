import dayjs from "dayjs"
import { PricingSlab } from "@/modules/pricing/api/pricing-api"

export function calculateBookingTotal(
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  slabs: PricingSlab[]
) {
  if (!start || !end || !slabs?.length) return 0

  let total = 0
  let current = start

  while (current.isBefore(end)) {
    const hour = current.format("HH:mm:ss")

    const matchedSlab = slabs.find(
      (slab) =>
        hour >= slab.start_time &&
        hour < slab.end_time
    )

    if (!matchedSlab) {
      throw new Error(`No pricing slab found for ${hour}`)
    }

    total += matchedSlab.rate_per_hour
    current = current.add(1, "hour")
  }

  return total
}