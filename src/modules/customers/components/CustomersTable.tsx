"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DATE_FORMAT_UI } from "@/constants";
import dayjs from "dayjs";

const PAGE_SIZE = 20;

export default function CustomersTable({
  data,
  loading,
  error,
  page,
  from,
  to,
}: any) {
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data || data.length === 0) return <div>No results</div>;

  const totalCount = data[0]?.total_count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const goToPage = (p: number) => {
    router.push(`/customers?from=${from}&to=${to}&page=${p}`);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Last Played</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row: any) => (
              <TableRow key={row.customer_phone}>
                <TableCell>{row.customer_name}</TableCell>
                <TableCell>{row.customer_phone}</TableCell>
                <TableCell className={
                  row.total_bookings >= 5 ? "font-bold text-green-600" : ""
                }>
                  {row.total_bookings}
                </TableCell>
                <TableCell>
                  {dayjs(row.last_played_at).format(DATE_FORMAT_UI)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* pagination */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}