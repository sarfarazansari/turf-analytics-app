"use client";

import RoleGuard from "@/components/RoleGuard";

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div>Admin Dashboard</div>
    </RoleGuard>
  );
}