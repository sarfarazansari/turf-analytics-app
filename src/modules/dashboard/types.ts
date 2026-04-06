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
  paid: number
  pending: number
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

export interface PaymentHealth {
  paid: number
  pending: number
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

