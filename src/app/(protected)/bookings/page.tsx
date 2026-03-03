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

export default function BookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Parse URL → Single Source of Truth
  const baseFilters: AdminBookingFilters = useMemo(() => {
    return parseFiltersFromSearchParams(searchParams);
  }, [searchParams]);

  // 🔹 Local State (Pagination + Sorting Only)
  const [page, setPage] = useState<number>(1);
  
  const [selectedBookingId, setSelectedBookingId] =
    useState<string | null>(null);

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
    console.log("Updated Filters:", updated); // Debug log
    const query = buildSearchParams(updated);

    setPage(1); // Always reset page
    router.replace(`?${query}`, { scroll: false });
  };


  const handleView = (bookingId: string) => {
    setSelectedBookingId(bookingId);
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
          isLoading={isLoading}
          isFetching={isFetching}
          onPageChange={setPage}
          onView={handleView}
        />

        {/* Drawer Placeholder */}
        {selectedBookingId && (
          <div>
            {/* Future Drawer */}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}