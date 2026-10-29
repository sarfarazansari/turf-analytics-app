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
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {/* View Switch */}
        <div className="flex flex-wrap rounded-md border overflow-hidden">
          {["WEEKLY", "MONTHLY", "CUSTOM"].map((item) => (
            <button
              key={item}
              onClick={() => onViewChange(item as DashboardView)}
              className={`px-2 py-2 text-xs transition sm:px-4 sm:text-sm ${
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