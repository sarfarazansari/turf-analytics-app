"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const startHours = Array.from({ length: 23 }, (_, i) => i + 1);
const endHours = Array.from({ length: 23 }, (_, i) => i + 2);

export default function CustomersFilters({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  const router = useRouter();

  const update = (newFrom: number, newTo: number) => {
    if (newFrom >= newTo) return;

    router.push(`/customers?from=${newFrom}&to=${newTo}&page=1`);
  };

  return (
    <div className="flex gap-4">
      {/* Start Time */}
      <Select
        value={String(from)}
        onValueChange={(val) => update(Number(val), to)}
      >
        <SelectTrigger className="w-30">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {startHours.map((h) => (
            <SelectItem key={h} value={String(h)}>
              {h}:00
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* End Time */}
      <Select
        value={String(to)}
        onValueChange={(val) => update(from, Number(val))}
      >
        <SelectTrigger className="w-30">
          <SelectValue placeholder="End" />
        </SelectTrigger>
        <SelectContent>
          {endHours
            .filter((h) => h > from) // 🔥 prevent invalid selection
            .map((h) => (
              <SelectItem key={h} value={String(h)}>
                {h === 24 ? "24:00" : `${h}:00`}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}