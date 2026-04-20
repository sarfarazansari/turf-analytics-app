"use client";

import { useSearchParams, useRouter } from "next/navigation";
import CustomersFilters from "./CustomersFilters";
import CustomersTable from "./CustomersTable";
import { useCustomers } from "../hooks/useCustomers";

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));
  const page = Number(searchParams.get("page") || 1);

  // redirect if missing params (important)
  if (!from || !to) {
    router.replace("/customers?from=18&to=22&page=1");
    return null;
  }

  const { data, loading, error } = useCustomers({
    from,
    to,
    page,
  });

  return (
    <div className="space-y-4">
      <CustomersFilters from={from} to={to} />
      <CustomersTable
        data={data}
        loading={loading}
        error={error}
        page={page}
        from={from}
        to={to}
      />
    </div>
  );
}