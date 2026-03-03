export interface AdminBookingDetail {
  id: string;

  customer_name: string;
  phone: string;

  start_datetime: string;
  end_datetime: string;

  total_amount: number;

  payments: {
    id: string;
    amount: number;
    payment_mode: 'CASH' | 'UPI' | 'ONLINE' | 'OTHER';
    created_at: string;
    created_by: string;
  }[];

  booking_status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  created_by: string;
}