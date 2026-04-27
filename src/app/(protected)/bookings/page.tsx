"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";

import type {
  AdminBookingFilters,
  AdminBookingSortBy,
  SortOrder,
} from "@/interfaces";

import RoleGuard from "@/components/RoleGuard";
import { useAdminBookings } from "@/modules/bookings/hooks/useAdminBookings";
import { SummaryStrip } from "@/modules/bookings/components/SummaryStrip";
import { BookingsFilters } from "@/modules/bookings/components/BookingsFilters";
import { BookingsTable } from "@/modules/bookings/components/BookingsTable";
import {
  buildSearchParams,
  parseFiltersFromSearchParams,
} from "@/modules/bookings/utils/bookingFilterParams";
import { BookingDetailsDrawer } from "@/modules/bookings/components/BookingDetailsDrawer";
import DeleteBookingDialog from "@/modules/bookings/components/DeleteBookingDialog";
import { useSoftDeleteBooking } from "@/modules/bookings/hooks/useSoftDeleteBooking";

export default function BookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Parse URL → Single Source of Truth
  const baseFilters: AdminBookingFilters = useMemo(() => {
    return parseFiltersFromSearchParams(searchParams);
  }, [searchParams]);

  // 🔹 Local State (Pagination + Sorting Only)
  const [page, setPage] = useState<number>(1);
  
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);

  const limit = 20;

  // 🔹 Combined Query Filters
  const queryFilters: any = useMemo(() => {
    return {
      ...baseFilters,
      page,
      limit
    };
  }, [baseFilters, page, limit]);

  const { data, isLoading, isFetching } =
    useAdminBookings(queryFilters);

  // 🔥 When filters change → reset page + update URL
  const handleFilterChange = (
    updated: AdminBookingFilters
  ) => {
    const query = buildSearchParams(updated);

    setPage(1); // Always reset page
    console.log("Updating URL with filters:", query);
    router.replace(`?${query}`, { scroll: false });
  };


  const handleView = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const handleClose = () => {    
    setSelectedBookingId(null);  
  }

  const { mutateAsync: softDeleteBooking, isPending: isDeletingBooking } =
  useSoftDeleteBooking();

  const handleDelete = (bookingId: string) => {
    setDeleteBookingId(bookingId);
  }

  const handleBookingDelete = async (payload: {
    bookingId: string;
    reason: string;
  }) => {
    await softDeleteBooking(payload);
    setDeleteBookingId(null);
    handleFilterChange(baseFilters); // Refresh data with current filters after deletion
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 p-6">
        {/* Summary */}
        <SummaryStrip
          summary={data?.summary}
          isLoading={isLoading || isFetching}
        />

        {/* Filters (URL-driven) */}
        <BookingsFilters
          filters={baseFilters}
          onChange={handleFilterChange}
        />

        {/* Table */}
        <BookingsTable
          data={data?.data ?? []}
          totalCount={data?.pagination?.total ?? 0}
          page={page}
          limit={limit}
          isLoading={isLoading || isDeletingBooking}
          isFetching={isFetching || isDeletingBooking}
          onPageChange={setPage}
          onView={handleView}
          onDelete={handleDelete}
        />

        {/* Drawer Placeholder */}
        {selectedBookingId && (
          <BookingDetailsDrawer isOpen={!!selectedBookingId} onClose={handleClose} bookingId={selectedBookingId} />
        )}

        {/* Delete Confirmation Modal Placeholder */}
        {deleteBookingId && (
          <DeleteBookingDialog 
            bookingId={deleteBookingId}
            open={!!deleteBookingId}
            onClose={() => setDeleteBookingId(null)}
            onConfirm={handleBookingDelete}
          />

        )}
      </div>
    </RoleGuard>
  );
}