"use client";

import RoleGuard from "@/components/RoleGuard";
import CustomersPage from "@/modules/customers/components/CustomersPage";
export const dynamic = "force-dynamic";
export default function CustomerPage() {

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 p-6">
        <CustomersPage />
      </div>
    </RoleGuard>
  );
}