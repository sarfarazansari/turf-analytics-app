"use client";

import { DateRange } from "../types";
import { DashboardDateFilter } from "./DashboardDateFilter";

type DashboardView = "WEEKLY" | "MONTHLY" | "CUSTOM";

interface DashboardHeaderProps {
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;

  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function DashboardHeader({
  view,
  onViewChange,
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* View Switch */}
        <div className="flex rounded-md border overflow-hidden">
          {["WEEKLY", "MONTHLY", "CUSTOM"].map((item) => (
            <button
              key={item}
              onClick={() => onViewChange(item as DashboardView)}
              className={`px-4 py-2 text-sm transition ${
                view === item
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Date Filter only for CUSTOM */}
        {view === "CUSTOM" && (
          <DashboardDateFilter onChange={onDateRangeChange} />
        )}
      </div>
    </div>
  );
}