import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInsights } from "../types";

interface Props {
  data: CustomerInsights;
}

export function CustomerInsightsSection({ data }: Props) {
  return (
    <div className="grid gap-4">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Customers</CardTitle></CardHeader>
          <CardContent>{data.kpis.total_customers}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>New Customers</CardTitle></CardHeader>
          <CardContent>{data.kpis.new_customers}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Returning Customers</CardTitle></CardHeader>
          <CardContent>{data.kpis.returning_customers}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Repeat Customers %</CardTitle></CardHeader>
          <CardContent>{data.kpis.repeat_rate}%</CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-3 gap-3">

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div>Active: {data.activity.active_customers}</div>
            <div>Inactive: {data.activity.inactive_customers}</div>
            <div>New: {data.activity.new_customers}</div>
          </CardContent>
        </Card>

        {/* Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Frequency</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div>1x: {data.frequency.one_time}</div>
            <div>2–5x: {data.frequency.mid}</div>
            <div>5x+: {data.frequency.high}</div>
          </CardContent>
        </Card>

        {/* Retention */}
        <Card>
          <CardHeader>
            <CardTitle>Retention</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div>One-time: {data.retention.first_time_only}</div>
            <div>Repeat: {data.retention.repeat_users}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.top_customers.map((c) => (
              <div
                key={c.customer_phone}
                className="flex justify-between border-b pb-1"
              >
                <div>
                  <div className="font-medium">{c.customer_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.customer_phone}
                  </div>
                </div>

                <div className="text-right">
                  <div>{c.period_bookings} (period)</div>
                  <div className="text-sm text-muted-foreground">
                    {c.lifetime_bookings} total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}