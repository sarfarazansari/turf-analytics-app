"use client";

import * as React from "react";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { CalendarIcon, X } from "lucide-react";
import type { AdminBookingFilters } from "@/interfaces";
import { bookingsFiltersSchema } from "../bookingsFiltersSchema";
import { DATE_FORMAT_UI } from "@/constants";
import { DateRange } from "react-day-picker";

type FormValues = z.infer<typeof bookingsFiltersSchema>;

interface BookingsFiltersProps {
  filters: AdminBookingFilters;
  onChange: (filters: AdminBookingFilters) => void;
}

type PresetType = "TODAY" | "LAST_7" | "THIS_MONTH" | null;

export function BookingsFilters({
  filters,
  onChange,
}: BookingsFiltersProps) {
  const today = dayjs();
  const [activePreset, setActivePreset] = useState<PresetType>("TODAY");

  const form = useForm<FormValues>({
    resolver: zodResolver(bookingsFiltersSchema),
    defaultValues: {
      dateRange: {
        from: dayjs(filters.fromDate).toDate(),
        to: dayjs(filters.toDate).toDate(),
      },
      bookingStatus: filters.bookingStatus,
      paymentStatus: filters.paymentStatus,
      search: filters.search,
    },
  });

  const dateRange = form.watch("dateRange");
  const bookingStatus = form.watch("bookingStatus");
  const paymentStatus = form.watch("paymentStatus");
  const search = form.watch("search");
  const isFirstRender = useRef(true);

  // 🔥 Debounced Update
  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const timeout = setTimeout(() => {
      // const { dateRange } = values;

      if (!dateRange?.from || !dateRange?.to) return;

      onChange({
        fromDate: dayjs(dateRange.from).format("YYYY-MM-DD"),
        toDate: dayjs(dateRange.to).format("YYYY-MM-DD"),
        bookingStatus: bookingStatus,
        paymentStatus: paymentStatus,
        search: search?.trim() || "",
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [dateRange, bookingStatus, paymentStatus, search, onChange]);

  // ✅ Preset Logic
  const applyPreset = (preset: PresetType) => {
    let from: dayjs.Dayjs;
    let to: dayjs.Dayjs = today;

    switch (preset) {
      case "TODAY":
        from = today;
        break;
      case "LAST_7":
        from = today.subtract(6, "day");
        break;
      case "THIS_MONTH":
        from = today.startOf("month");
        break;
      default:
        return;
    }

    setActivePreset(preset);

    form.setValue("dateRange", {
      from: from.toDate(),
      to: to.toDate(),
    });
  };

  const resetToToday = () => {
    applyPreset("TODAY");

    form.setValue("bookingStatus", "ALL");
    form.setValue("paymentStatus", "ALL");
    form.setValue("search", "");
  };

  return (
    <div className="bg-card p-4 rounded-2xl shadow-sm space-y-4">
      
      {/* 🔥 Presets */}
      <div className="flex flex-wrap gap-2">
        <Button
          className="cursor-pointer"
          variant={activePreset === "TODAY" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("TODAY")}
        >
          Today
        </Button>

        <Button
          className="cursor-pointer"
          variant={activePreset === "LAST_7" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("LAST_7")}
        >
          Last 7 Days
        </Button>

        <Button
          className="cursor-pointer"
          variant={activePreset === "THIS_MONTH" ? "default" : "outline"}
          size="sm"
          onClick={() => applyPreset("THIS_MONTH")}
        >
          This Month
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dayjs(dateRange.from).format(DATE_FORMAT_UI)} —{" "}
                {dayjs(dateRange.to).format(DATE_FORMAT_UI)}
              </Button>
            </PopoverTrigger>
            <PopoverContent  className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (!range?.from) return;

                  setActivePreset(null); // manual override

                  form.setValue("dateRange", {
                    from: range.from,
                    to: range.to ?? range.from,
                  });
                }}
                disabled={(date) =>
                  dayjs(date).isAfter(today, "day")
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Booking Status */}
        <div className="space-y-2">
          <Label>Booking Status</Label>
          <Select
            value={bookingStatus}
            onValueChange={(value) =>
              form.setValue("bookingStatus", value as any)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="BOOKED">Booked</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select
            value={paymentStatus}
            onValueChange={(value) =>
              form.setValue("paymentStatus", value as any)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FULL_PAID">Full Paid</SelectItem>
              <SelectItem value="PARTIAL_PAID">Partial Paid</SelectItem>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Name, phone, booking ID..."
              {...form.register("search")}
            />
            {search && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => form.setValue("search", "")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={resetToToday}
            className="w-full cursor-pointer"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}