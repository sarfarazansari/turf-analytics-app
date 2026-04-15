export function transformHourlyDemand(
  data: {
    hour: number
    hour_label: string
    minutes_booked: number
  }[],
  startDate: string,
  endDate: string
) {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const diffTime = end.getTime() - start.getTime()
  const days = Math.max(1, diffTime / (1000 * 60 * 60 * 24) + 1)

  return data.map((item) => {
    const avgMinutes = item.minutes_booked / days
    const utilization = avgMinutes / 60

    // 🔥 classification
    let level: "PEAK" | "NORMAL" | "DEAD"

    if (utilization >= 0.8) level = "PEAK"
    else if (utilization >= 0.5) level = "NORMAL"
    else level = "DEAD"

    return {
      hour: item.hour,
      hour_label: item.hour_label,
      utilization: Number(utilization.toFixed(2)),
      minutes_booked: item.minutes_booked, // keep for tooltip
      level,
    }
  })
}