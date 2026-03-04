export interface HourSlot {
  hour: number
  label: string
}

export function generateHourSlots(start: number, end: number): HourSlot[] {
  const slots: HourSlot[] = []

  for (let hour = start; hour < end; hour++) {
    const next = hour + 1

    slots.push({
      hour,
      label: `${hour.toString().padStart(2, "0")}-${next
        .toString()
        .padStart(2, "0")}`,
    })
  }

  return slots
}