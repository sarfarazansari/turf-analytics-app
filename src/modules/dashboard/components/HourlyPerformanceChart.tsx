"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HourlyDemandItem } from "../types";

interface HourlyPerformanceChartProps {
  data: HourlyDemandItem[];
}

const getColor = (level: string) => {
  if (level === "PEAK") return "#ef4444"   // red
  if (level === "NORMAL") return "#f59e0b" // yellow
  return "#22c55e"                         // green
}

export function HourlyPerformanceChart({
  data
}: HourlyPerformanceChartProps) {


  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Performance</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="hour_label"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 1]}
                tickFormatter={(value) => `${value * 100}%`}
              />

              <Tooltip
                formatter={(value: number, _, payload) => {
                  const p = payload.payload

                  return [
                    `${Math.round(value * 100)}% (${p.minutes_booked} mins)`,
                    `${p.level}`,
                  ]
                }}
                labelFormatter={(label) => `Time: ${label}`}
              />

              <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-4 text-sm mt-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded" /> Peak
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded" /> Normal
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded" /> Dead
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}