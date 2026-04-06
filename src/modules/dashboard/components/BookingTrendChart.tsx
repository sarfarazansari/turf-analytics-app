"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BookingTrendItem, DateRange } from "../types"

interface BookingTrendChartProps {
  // dateRange: DateRange | null
  data?: BookingTrendItem[];
  isLoading?: boolean;
}

export function BookingTrendChart({ data, isLoading }: BookingTrendChartProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trend</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <LineChart data={data ?? []} >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#8884d8"/>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}