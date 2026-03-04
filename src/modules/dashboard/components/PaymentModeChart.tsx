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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MyCustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};


export function PaymentModeChart({ data, isLoading }: PaymentModeChartProps) {

  // const data = [
  //   { name: "UPI", value: 0 },
  //   { name: "Cash", value: 0 },
  //   { name: "Online", value: 0 },
  //   { name: "Other", value: 0 },
  // ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Modes</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%" aspect={3}>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              outerRadius={100}
              label
              fill="#8884d8"
              isAnimationActive={true}
              shape={MyCustomPie}
            >
              
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}