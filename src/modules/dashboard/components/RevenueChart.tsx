"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSkeleton } from "./ChartSkeleton";
import { formatCurrency } from "@/lib/currency-format";
import { formatNumber, formatPercentage } from "@/lib/number-format";

interface RevenueChartProps {
  data?: {
    date: string;
    revenue: number;
  }[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {

  // const data = [
  //   { date: "Mon", revenue: 0 },
  //   { date: "Tue", revenue: 0 },
  //   { date: "Wed", revenue: 0 },
  //   { date: "Thu", revenue: 0 },
  //   { date: "Fri", revenue: 0 },
  //   { date: "Sat", revenue: 0 },
  //   { date: "Sun", revenue: 0 },
  // ]

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <BarChart data={data ?? []}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: any) => formatCurrency(value)}
            />
            <Bar dataKey="revenue" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]}  />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}