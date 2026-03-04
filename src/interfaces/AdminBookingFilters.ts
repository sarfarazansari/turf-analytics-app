export interface AdminBookingFilters {
  fromDate: string;      // YYYY-MM-DD
  toDate: string;        // YYYY-MM-DD
  bookingStatus: 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'ALL';
  paymentStatus: 'FULL_PAID' | 'PARTIAL_PAID' | 'UNPAID' | 'ALL';
  search: string;        // name / phone / bookingId
  page?: number;
}