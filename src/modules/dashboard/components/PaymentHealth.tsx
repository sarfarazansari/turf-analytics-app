"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Summary } from "../types";

export function PaymentHealth({ paymentHealth }: { paymentHealth: Summary["paymentHealth"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Health</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">

        {/* 🔹 Efficiency */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Collection Efficiency</span>
          <span className="text-lg font-semibold">
            {paymentHealth.current.efficiency.toFixed(1)}%
          </span>
        </div>

        {/* 🔹 Paid vs Total */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Collected</span>
          <span className="font-medium">
            ₹{paymentHealth.current.paid} / ₹{paymentHealth.current.total}
          </span>
        </div>

        {/* 🔹 Pending */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Pending</span>
          <span className="font-medium text-red-600">
            ₹{paymentHealth.current.pending}
          </span>
        </div>

        {/* 🔹 Payment Behavior */}
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span>Fully Paid</span>
            <span>{paymentHealth.current.fully_paid}</span>
          </div>
          <div className="flex justify-between">
            <span>Partial</span>
            <span>{paymentHealth.current.partially_paid}</span>
          </div>
          <div className="flex justify-between">
            <span>Unpaid</span>
            <span className="text-red-600">
              {paymentHealth.current.unpaid}
            </span>
          </div>
        </div>

      </CardContent>

      {/* 🔹 Trend vs Previous */}
      <CardFooter className="text-xs text-muted-foreground">
        <span>
          Prev: {paymentHealth.previous.efficiency.toFixed(1)}% →
          <span
            className={`ml-1 font-medium ${paymentHealth.current.efficiency >=
                paymentHealth.previous.efficiency
                ? "text-green-600"
                : "text-red-600"
              }`}
          >
            {(
              paymentHealth.current.efficiency -
              paymentHealth.previous.efficiency
            ).toFixed(1)}
            %
          </span>
        </span>
      </CardFooter>
    </Card>
  )
}