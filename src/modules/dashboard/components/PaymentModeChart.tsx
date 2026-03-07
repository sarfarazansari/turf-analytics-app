"use client"

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieSectorShapeProps,
  Sector,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DateRange, PaymentModeItem } from "../types"

interface PaymentModeChartProps {
  // dateRange: DateRange | null
  data?: PaymentModeItem[];
  isLoading?: boolean;
}



export function PaymentModeChart({ data, isLoading }: PaymentModeChartProps) {


  if (isLoading) {
    return <div>Loading payment mode data...</div>;
  }
  // const data = [
  //   { mode: "UPI", amount: 0 },
  //   { mode: "Cash", amount: 0 },
  //   { mode: "Online", amount: 0 },
  //   { mode: "Other", amount: 0 },
  // ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const chartData = data?.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Modes</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <PieChart>
    <Pie
      data={chartData}
      dataKey="amount"
      nameKey="mode"
      outerRadius={100}
      label
    />
    <Tooltip />
  </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}