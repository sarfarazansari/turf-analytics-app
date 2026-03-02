export const DATE_FORMAT_UI = 'YYYY-MM-DD';
export const DT_TIME_FORMAT_UI = 'YYYY-MM-DD HH:mm';
export const TIME_FORMAT_UI = 'hh:mm A';
export const DATE_FORMAT_API = 'YYYY-MM-DD';
export const SLOT_STATUS = {
  ALL: 'ALL',
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  BLOCKED: 'BLOCKED',
} as const;

export const DATE_FORMAT_CALENDAR = "dd/MM/yyyy";

export const PAYMENT_METHODS = ['UPI', 'CASH', 'ONLINE', 'OTHER'];

export const BOOKING_STATUSES = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'BLOCKED',
];
export type BOOKING_STATUS_TYPE = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "BLOCKED";

export type PAYMENT_STATUS_TYPE = 'PAID' | 'PENDING' | 'REFUNDED';

export const USER_STATUSES = ['ALL', 'ACTIVE', 'INACTIVE', 'BLOCKED'];
export type USER_STATUS_TYPE = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED';