import { generateHourSlots } from "./generateHourSlots";

interface RawHourlyData {
  hour: number;
  bookings: number;
}

interface HourlyChartData {
  hour: string;
  bookings: number;
}

export function normalizeHourlyData(
  raw: RawHourlyData[],
  startHour: number,
  endHour: number
): HourlyChartData[] {

  const slots = generateHourSlots(startHour, endHour);

  const map = new Map<number, number>();

  raw.forEach((item) => {
    map.set(item.hour, item.bookings);
  });

  return slots.map((slot) => ({
    hour: slot.label,
    bookings: map.get(slot.hour) ?? 0,
  }));
}