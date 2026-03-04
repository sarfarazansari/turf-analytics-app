"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import type { AdminBookingsSummary } from "@/interfaces";
import { formatCurrency } from "@/lib/currency-format";

interface SummaryStripProps {
  summary?: AdminBookingsSummary;
  isLoading: boolean;
}


function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: (v: number) => string;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 0.4,
      onUpdate(latest) {
        setDisplay(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {format ? format(display) : display}
    </span>
  );
}

export function SummaryStrip({
  summary,
  isLoading,
}: SummaryStripProps) {
  const cards = [
    {
      label: "Total Bookings",
      value: summary?.total_bookings ?? 0,
      format: undefined,
    },
    {
      label: "Total Revenue",
      value: summary?.total_revenue ?? 0,
      format: formatCurrency,
    },
    {
      label: "Total Paid",
      value: summary?.total_paid ?? 0,
      format: formatCurrency,
    },
    {
      label: "Outstanding",
      value: summary?.total_outstanding ?? 0,
      format: formatCurrency,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="rounded-2xl shadow-sm"
        >
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">
              {card.label}
            </div>

            <motion.div
              key={card.value}
              initial={{ opacity: 0.6, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mt-2 text-2xl font-semibold ${
  card.label === "Outstanding" && card.value > 0
    ? "text-red-500"
    : ""
}`}
            >
              {isLoading ? (
                "—"
              ) : (
                <AnimatedNumber
                  value={card.value}
                  format={card.format}
                />
              )}
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}