"use client";

import { DateRange } from "../types";
import { DashboardDateFilter } from "./DashboardDateFilter";

interface DashboardHeaderProps {
  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
}

export function DashboardHeader({
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <DashboardDateFilter onChange={onDateRangeChange} />
    </div>
  );
}