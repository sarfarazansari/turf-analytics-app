"use client";

import RoleGuard from "@/components/RoleGuard";

export default function BookingsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div>Admin Bookings Page</div>
    </RoleGuard>
  );
}