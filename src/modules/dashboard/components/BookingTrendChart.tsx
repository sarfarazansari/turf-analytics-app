"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  labels: string[];
  current: number[];
  previous: number[];
};

export function BookingTrendChart({
  labels,
  current,
  previous,
}: Props) {
  // -----------------------------
  // 1. Build chart data
  // -----------------------------
  const chartData = labels.map((label, i) => ({
    label,
    current: current[i],
    previous: previous[i],
  }));

  // -----------------------------
  // 2. Config
  // -----------------------------
  const chartConfig = {
    current: {
      label: "Current",
      color: "#4f46e5",
    },
    previous: {
      label: "Previous",
      color: "#a5b4fc",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trend</CardTitle>
      </CardHeader>

      <CardContent className="h-80 w-full">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
            />

            <YAxis />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${value as number} bookings`
                  }
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Line
              type="monotone"
              dataKey="current"
              stroke="var(--color-current)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="previous"
              stroke="var(--color-previous)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}