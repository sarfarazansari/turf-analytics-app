"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateHourSlots } from "../utils/generateHourSlots"
import { formatCurrency } from "@/lib/currency-format";
import { formatNumber, formatPercentage } from "@/lib/number-format";

interface HourlyPerformanceChartProps {
  data?: {
    hour: string;
    bookings: number;
  }[];
  isLoading?: boolean;
}

export function HourlyPerformanceChart({
  data,
  isLoading
}: HourlyPerformanceChartProps) {

  const slots = generateHourSlots(6, 24)

  // placeholder data
  // const data = slots.map((slot) => ({
  //   hour: slot.label,
  //   bookings: 0,
  // }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Performance</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <BarChart layout="vertical" data={data ?? []}>
            <XAxis type="number" />
            <YAxis dataKey="hour" type="category" width={60} />
            <Tooltip
              formatter={(value: any) => `${value} bookings`}
            />
            <Bar dataKey="bookings" fill="#82ca9d" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}