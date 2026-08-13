import { PricingSlab } from "@/interfaces/PricingSlab"
import dayjs from "@/lib/dayjs";

export function calculateBookingTotal(
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  slabs: PricingSlab[]
) {
  if (!start || !end || !slabs?.length) return 0;

  const applicableVersion = slabs
    .filter((slab) =>
      !dayjs(slab.effective_from).isAfter(start)
    )
    .sort(
      (a, b) =>
        dayjs(b.effective_from).valueOf() -
        dayjs(a.effective_from).valueOf()
    )[0];

  if (!applicableVersion) {
    throw new Error("No pricing version found");
  }

  const versionSlabs = slabs.filter(
    (slab) =>
      slab.pricing_version_id ===
      applicableVersion.pricing_version_id
  );

  let total = 0;
  let current = start;

  while (current.isBefore(end)) {
    const hour = current.format("HH:mm:ss");

    const matchedSlab = versionSlabs.find(
      (slab) =>
        hour >= slab.start_time &&
        hour < slab.end_time
    );

    if (!matchedSlab) {
      throw new Error(`No pricing slab found for ${hour}`);
    }

    total += matchedSlab.rate_per_hour;
    current = current.add(1, "hour");
  }

  return total;
}