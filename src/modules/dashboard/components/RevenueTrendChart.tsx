"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
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

export function RevenueTrendChart({
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
      <BarChart data={chartData} barCategoryGap="25%" barGap={4}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                `₹${(value as number).toLocaleString()}`
              }
            />
          }
        />

        <ChartLegend content={<ChartLegendContent />} />

        <Bar
          dataKey="current"
          fill="var(--color-current)"
          radius={4}
          maxBarSize={28}
        />

        <Bar
          dataKey="previous"
          fill="var(--color-previous)"
          radius={4}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
    </CardContent>
    </Card>
  );
}