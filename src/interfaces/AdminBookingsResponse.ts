import { AdminBookingRow } from "./AdminBookingRow";
import { AdminBookingsSummary } from "./AdminBookingsSummary";
import { PaginationState } from "./PaginationState";

export interface AdminBookingsResponse {
  data: AdminBookingRow[];
  pagination: PaginationState; // Adjust this type based on your actual pagination structure
  summary: AdminBookingsSummary;
}