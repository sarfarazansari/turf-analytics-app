export interface AdminBookingRow {
  id: string;

  booking_date: string;        // YYYY-MM-DD
  start_datetime: string;      // ISO
  end_datetime: string;        // ISO

  customer_name: string;
  customer_phone: string;

  total_amount: number;
  total_paid: number;
  total_due: number;

  payment_status: 'FULL_PAID' | 'PARTIAL_PAID' | 'UNPAID';
  booking_status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';

  created_by: string;
  created_at: string;
}