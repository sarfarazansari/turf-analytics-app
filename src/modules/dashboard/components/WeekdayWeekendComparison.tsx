"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Data = {
  weekday: {
    revenue: number;
    bookings: number;
    minutes: number;
  };
  weekend: {
    revenue: number;
    bookings: number;
    minutes: number;
  };
};

export function WeekdayWeekendComparison({ data }: { data: Data }) {
  const weekday = data.weekday;
  const weekend = data.weekend;

  // -----------------------------
  // Derived Metrics
  // -----------------------------

  const avgWeekday =
    weekday.bookings > 0 ? weekday.revenue / weekday.bookings : 0;

  const avgWeekend =
    weekend.bookings > 0 ? weekend.revenue / weekend.bookings : 0;

  // -----------------------------
  // % Change Helper
  // -----------------------------

  const getChange = (a: number, b: number) => {
    if (a === 0) return 0;
    return ((b - a) / a) * 100;
  };

  // -----------------------------
  // Metrics Array
  // -----------------------------

  const metrics = [
    {
      label: "Revenue",
      weekday: weekday.revenue,
      weekend: weekend.revenue,
    },
    {
      label: "Bookings",
      weekday: weekday.bookings,
      weekend: weekend.bookings,
    },
    {
      label: "Avg Value",
      weekday: avgWeekday,
      weekend: avgWeekend,
    },
    {
      label: "Minutes",
      weekday: weekday.minutes,
      weekend: weekend.minutes,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekday vs Weekend</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const change = getChange(m.weekday, m.weekend);

            return (
              <div
                key={m.label}
                className="rounded-2xl border p-4 space-y-2"
              >
                <div className="text-sm text-muted-foreground">
                  {m.label}
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Wkdy</span>
                  <span>{formatValue(m.weekday, m.label)}</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Wknd</span>
                  <span>{formatValue(m.weekend, m.label)}</span>
                </div>

                <div
                  className={`text-sm font-medium ${change > 0
                      ? "text-green-600"
                      : change < 0
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                >
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// -----------------------------
// Formatter
// -----------------------------

function formatValue(value: number, label: string) {
  if (label === "Revenue" || label === "Avg Value") {
    return `₹${Math.round(value)}`;
  }

  if (label === "Minutes") {
    return `${Math.round(value / 60)}h`;
  }

  return value;
}