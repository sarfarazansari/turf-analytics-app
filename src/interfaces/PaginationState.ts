export interface PaginationState {
  page: number;
  limit: number; // fixed 20
  total: number;
  totalPages: number;
}