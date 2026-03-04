"use client";
export const dynamic = "force-dynamic";
import RoleGuard from "@/components/RoleGuard";
import CreateBookingForm from "@/modules/bookings/components/CreateBookingForm";

export default function NewBookingPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "STAFF"]}>
      <CreateBookingForm />
    </RoleGuard>
  );
}