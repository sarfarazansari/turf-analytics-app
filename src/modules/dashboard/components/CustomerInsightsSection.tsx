import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInsights } from "../types";

interface Props {
  data: CustomerInsights;
}

export function CustomerInsightsSection({ data }: Props) {
  return (
    <div className="grid min-w-0 gap-4">
      {/* KPI cards */}
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Total Customers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.kpis.total_customers}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">New Customers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.kpis.new_customers}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Returning Customers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.kpis.returning_customers}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Repeat Customers %</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {data.kpis.repeat_rate}%
          </CardContent>
        </Card>
      </div>

      {/* Customer behaviour cards */}
      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Customer Activity</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            <Metric label="Active" value={data.activity.active_customers} />
            <Metric label="Inactive" value={data.activity.inactive_customers} />
            <Metric label="New" value={data.activity.new_customers} />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Frequency</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
            <Metric label="1x" value={data.frequency.one_time} />
            <Metric label="2–5x" value={data.frequency.mid} />
            <Metric label="5x+" value={data.frequency.high} />
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="break-words text-base sm:text-lg">Retention</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-3 gap-y-4">
            <Metric label="One-time" value={data.retention.first_time_only} />
            <Metric label="Repeat" value={data.retention.repeat_users} />
          </CardContent>
        </Card>
      </div>

      {/* Top customers */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.top_customers && data.top_customers.length > 0 ? (
              data.top_customers.map((customer) => (
                <div
                  key={customer.customer_phone}
                  className="flex min-w-0 flex-col gap-2 border-b pb-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 break-words">
                    <div className="font-medium">{customer.customer_name}</div>
                    <div className="break-all text-sm text-muted-foreground">
                      {customer.customer_phone}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3 text-sm sm:flex-col sm:gap-0 sm:text-right">
                    <div>{customer.period_bookings} (period)</div>
                    <div className="text-muted-foreground">
                      {customer.lifetime_bookings} total
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No customer activity for this period.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: number;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="min-w-0">
      <div className="break-words text-sm text-muted-foreground">{label}</div>
      <div className="text-lg font-medium tabular-nums">{value}</div>
    </div>
  );
}
