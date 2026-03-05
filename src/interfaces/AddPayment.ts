export interface AddPaymentInput {
  bookingId: string;
  amount: number;
  paymentMode: "CASH" | "UPI" | "ONLINE" | "OTHER";
}