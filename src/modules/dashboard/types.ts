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

export interface DashboardAnalytics {
  summary: DashboardSummary;
  revenueTrend: RevenueTrendItem[];
  bookingTrend: BookingTrendItem[];
  hourlyPerformance: HourlyPerformanceItem[];
  paymentModes: PaymentModeItem[];
}