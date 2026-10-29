"use client"

import { useEffect, useState } from "react"
import dayjs from "@/lib/dayjs"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DashboardDateFilterProps {
  onChange: (range: { from: string; to: string }) => void
}

export function DashboardDateFilter({ onChange }: DashboardDateFilterProps) {
  const [range, setRange] = useState<DateRange | undefined>()
  const [calendarMonths, setCalendarMonths] = useState(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateCalendarMonths = () => setCalendarMonths(mediaQuery.matches ? 2 : 1)

    updateCalendarMonths()
    mediaQuery.addEventListener("change", updateCalendarMonths)
    return () => mediaQuery.removeEventListener("change", updateCalendarMonths)
  }, [])

  function handleSelect(value: DateRange | undefined) {
    setRange(value)

    if (!value?.from || !value?.to) return

    onChange({
      from: dayjs(value.from).format("YYYY-MM-DD"),
      to: dayjs(value.to).format("YYYY-MM-DD"),
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {range?.from && range?.to
  ? `${dayjs(range.from).format("DD MMM")} - ${dayjs(range.to).format("DD MMM")}`
  : "Select Date Range"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto max-w-[calc(100vw-1.5rem)] overflow-hidden p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={calendarMonths}
        />
      </PopoverContent>
    </Popover>
  )
}