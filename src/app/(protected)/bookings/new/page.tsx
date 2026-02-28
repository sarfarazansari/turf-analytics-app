"use client";

import RoleGuard from "@/components/RoleGuard";

export default function NewBookingPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <div>Create Booking Page</div>
    </RoleGuard>
  );
}