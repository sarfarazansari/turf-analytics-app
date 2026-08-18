"use client";

import RoleGuard from "@/components/RoleGuard";
import { CashPageComponent } from "@/modules/cash/components/CashPage";
export const dynamic = "force-dynamic";
export default function CashPage() {

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <CashPageComponent />
    </RoleGuard>
  );
}