export interface DateRange {
  from: string;
  to: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalBookings: number;
  totalHoursBooked: number;
  occupancyRate: number;
  cancellationCount: number;
  avgBookingValue: number;
}

export interface RevenueTrendItem {
  date: string;
  revenue: number;
}

export interface BookingTrendItem {
  date: string;
  bookings: number;
}

export interface HourlyPerformanceItem {
  hour: string;
  bookings: number;
}

export interface PaymentModeItem {
  mode: string;
  count: number;
}

export interface RevenueTrendChartData {
  labels: string[]
  datasets: RevenueTrendChartDataset[]
}

export interface RevenueTrendChartDataset {
  label: string
  data: number[]
}


export interface DashboardAnalytics {
  summary: DashboardSummary;
  revenueTrend: RevenueTrendItem[];
  revenueTrendNew: RevenueTrendChartData;
  bookingTrend: BookingTrendItem[];
  hourlyPerformance: HourlyPerformanceItem[];
  paymentModes: PaymentModeItem[];
}

export interface KPIsData {
  current_bookings: number
  previous_bookings: number
  current_revenue: number
  previous_revenue: number
  current_booked_hours: number
  previous_booked_hours: number
  payment_health: PaymentHealth
  total_hours_current: number
  total_hours_previous: number
}

export type DashboardView = "WEEKLY" | "MONTHLY" | "CUSTOM";
// { labels: string[]; datasets: [{ label: string; data: number[] }[]] };

type KPIItem = {
  current: number;
  previous: number;
  changePercent: number;
};

export interface Current {
  paid: number
  pending: number
  total: number
  efficiency: number
  fully_paid: number
  partially_paid: number
  unpaid: number
}

export interface Previous {
  paid: number
  pending: number
  total: number
  efficiency: number
}


export interface PaymentHealth {
  current: Current
  previous: Previous
}

export interface KPIsResponse {
  summary: Summary
}

export interface Summary {
  revenue: KPIItem
  bookings: KPIItem
  utilization: KPIItem
  avgBookingValue: KPIItem
  paymentHealth: PaymentHealth
}

export interface TrendApiItem {
  date: string
  revenue: number
  bookings: number
}

export interface TrendDataApiResponse {
  current: TrendApiItem[]
  previous: TrendApiItem[]
}

export interface TrendItem {
  current: number[]
  previous: number[]
}

export interface TrendMappedData {
  labels: string[]
  revenue: TrendItem
  bookings: TrendItem
}

export interface HourlyDemandItemAPI {
  hour: number
  hour_label: string
  minutes_booked: number
}

export interface HourlyDemandItem {
  // avgMinutes: number
  hour: number
  hour_label: string
  minutes_booked: number
  utilization: number
  level: "PEAK" | "NORMAL" | "DEAD"
}

export interface WeekStatItem {
  revenue: number
  bookings: number
  minutes: number
}

export interface GetWeekdayWeekendStats {
  weekday: WeekStatItem
  weekend: WeekStatItem
}


export interface CustomerInsights {
  kpis: {
    total_customers: number;
    new_customers: number;
    returning_customers: number;
    repeat_rate: number;
  };
  activity: {
    active_customers: number;
    inactive_customers: number;
    new_customers: number;
  };
  frequency: {
    one_time: number;
    mid: number;
    high: number;
  };
  retention: {
    first_time_only: number;
    repeat_users: number;
  };
  top_customers: {
    customer_phone: string;
    customer_name: string;
    period_bookings: number;
    lifetime_bookings: number;
  }[];
}