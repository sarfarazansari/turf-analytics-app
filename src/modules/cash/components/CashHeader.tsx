"use client";

import { useState } from "react";
import { format } from "date-fns";
import dayjs from "@/lib/dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DATE_FORMAT_CALENDAR } from "@/constants";

type CashHeaderProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onRefresh: () => void;
};

export function CashHeader({
  selectedDate,
  onDateChange,
  onRefresh,
}: CashHeaderProps) {
  const isToday = dayjs(selectedDate).isSame(dayjs(), "day");
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

  const handlePreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);

    onDateChange(previousDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    onDateChange(nextDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Popover
          open={isDatePopoverOpen}
          onOpenChange={setIsDatePopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="max-w-full truncate pl-3 text-left font-normal"
            >
              {format(selectedDate, DATE_FORMAT_CALENDAR)}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) return;

                onDateChange(date);
                setIsDatePopoverOpen(false);
              }}
              disabled={(date) => dayjs(date).isAfter(dayjs(), "day")}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousDay}
          aria-label="Previous day"
        >
          ←
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={isToday}
          onClick={handleNextDay}
          aria-label="Next day"
        >
          →
        </Button>

        <Button
          variant="outline"
          onClick={handleToday}
        >
          Today
        </Button>
      </div>

      <Button variant="outline" className="self-start sm:self-auto" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}