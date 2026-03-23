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

import dayjs from "dayjs";

type RevenueTrend = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

type Props = {
  data: RevenueTrend;
};

export function RevenueTrendChart({ data }: Props) {
  const chartData = data.labels.map((label, i) => ({
    date: label,
    thisWeek: data.datasets[0].data[i],
    lastWeek: data.datasets[1].data[i],
  }));

  const chartConfig = {
    thisWeek: {
      label: "This Week",
      color: "green",
    },
    lastWeek: {
      label: "Last Week",
      color: "lightgreen",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <BarChart
        data={chartData}
        barCategoryGap="25%"
        barGap={4}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => dayjs(value).format("ddd")}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                dayjs(value).format("dddd, DD MMM YYYY")
              }
              formatter={(value) =>
                `₹${(value as number).toLocaleString()}`
              }
            />
          }
        />

        <ChartLegend content={<ChartLegendContent />} />

        <Bar
          dataKey="thisWeek"
          fill="var(--color-thisWeek)"
          radius={4}
          maxBarSize={28}
        />

        <Bar
          dataKey="lastWeek"
          fill="var(--color-lastWeek)"
          radius={4}
          maxBarSize={28}
        />
      </BarChart>
    </ChartContainer>
  );
}