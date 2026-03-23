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

// { labels: string[]; datasets: [{ label: string; data: number[] }[]] };