"use client";

import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";

import type {
  AdminBookingRow,
  AdminBookingSortBy,
  SortOrder,
} from "@/interfaces";
import { DATE_FORMAT_UI } from "@/constants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency-format";

interface BookingsTableProps {
  data: AdminBookingRow[];
  totalCount: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onView: (bookingId: string) => void;
}

const CELL_COUNT = 9; // Update this if you add/remove columns

export function BookingsTable({
  data,
  totalCount,
  page,
  limit,
  isLoading,
  isFetching,
  onPageChange,
  onView,
}: BookingsTableProps) {
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              {/* <TableHead>ID</TableHead> */}
              <TableHead
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Date & Time
                </div>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  Total
                </div>
              </TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(6)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>

                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={CELL_COUNT} className="text-center py-10">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {/* <TableCell className="font-medium">
                    {row.id}
                  </TableCell> */}

                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {dayjs(row.start_datetime).format(
                          DATE_FORMAT_UI
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dayjs(row.start_datetime).format(
                          "hh:mm A"
                        )}{" "}
                        –{" "}
                        {dayjs(row.end_datetime).format(
                          "hh:mm A"
                        )}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{row.customer_name}</TableCell>
                  <TableCell>{row.customer_phone}</TableCell>

                  <TableCell>
                    {formatCurrency(row.total_amount)}
                  </TableCell>

                  <TableCell>
                    {formatCurrency(row.total_paid)}
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        row.total_due > 0 ? "text-red-600" : "text-green-600"
                      )}
                    >
                      {formatCurrency(row.total_due)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        row.payment_status === "FULL_PAID"
                          ? "default"
                          : row.payment_status === "PARTIAL_PAID"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {row.payment_status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        row.booking_status === "COMPLETED"
                          ? "secondary"
                          : row.booking_status === "BOOKED"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {row.booking_status}
                    </Badge>
                  </TableCell>



                  <TableCell className="text-right">
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant="ghost"
                      onClick={() => onView(row.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1}–
            {Math.min(page * limit, totalCount)} of{" "}
            {totalCount}
          </div>

          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>

            <Button
              className="cursor-pointer"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}