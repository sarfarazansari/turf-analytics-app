import dayjs, { Dayjs } from "dayjs";

type Slab = {
  start: string; // HH:mm
  end: string;   // HH:mm
  rate: number;  // per hour
};

const slabs: Slab[] = [
  { start: "06:00", end: "10:00", rate: 350 },
  { start: "10:00", end: "17:00", rate: 300 },
  { start: "17:00", end: "24:00", rate: 550 },
  { start: "00:00", end: "06:00", rate: 550 },
];

export function calculateTotalAmount(
  start: Dayjs,
  end: Dayjs
): number {
  let total = 0;
  let current = start;

  while (current.isBefore(end)) {
    const nextMinute = current.add(1, "minute");

    const hour = current.hour();
    const minute = current.minute();
    const currentTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    const slab = slabs.find((s) => {
      if (s.start === "17:00" && s.end === "24:00") {
        return currentTime >= "17:00";
      }
      if (s.start === "00:00" && s.end === "06:00") {
        return currentTime < "06:00";
      }
      return currentTime >= s.start && currentTime < s.end;
    });

    if (!slab) {
      throw new Error("No pricing slab found");
    }

    total += slab.rate / 60;

    current = nextMinute;
  }

  return Math.round(total); // round to nearest rupee
}