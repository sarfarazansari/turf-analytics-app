"use client";

import RoleGuard from "@/components/RoleGuard";
import { DashboardPageComponent } from "@/modules/dashboard/pages/DashboardPage";

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <DashboardPageComponent />
    </RoleGuard>
  );
}