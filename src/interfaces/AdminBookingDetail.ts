export interface AdminBookingDetail {
  id: string
  customer_name: string
  customer_phone: string
  start_datetime: string
  end_datetime: string
  booking_status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
  notes: string
  created_at: string
  total_amount: number
  total_paid: number
  payment_status: 'FULL_PAID' | 'PARTIAL_PAID' | 'UNPAID';
  payments: Payment[]
}

export interface Payment {
  id: string
  amount: number
  payment_mode: 'CASH' | 'UPI' | 'ONLINE' | 'OTHER';
  created_at: string
}